import { Router } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Login
router.post("/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res
                .status(400)
                .json({ success: false, message: "No credential provided" });
        }

        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid token" });
        }

        const { email, name, picture, sub: googleId } = payload;

        // Find or create user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Create new user with profile
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || "User",
                    googleId,
                    picture,
                    profile: {
                        create: {
                            firstName: name?.split(" ")[0] || "",
                            lastName: name?.split(" ").slice(1).join(" ") || "",
                            email,
                            profilePic: picture,
                        },
                    },
                },
            });
        } else {
            // Update existing user
            user = await prisma.user.update({
                where: { email },
                data: {
                    googleId,
                    picture,
                    name: name || user.name,
                },
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                picture: user.picture,
            },
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ success: false, message: "Login failed" });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully" });
});

// Get current user
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: {
                id: true,
                email: true,
                name: true,
                picture: true,
                createdAt: true,
            },
        });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to get user" });
    }
});

export default router;
