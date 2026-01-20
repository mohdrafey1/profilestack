import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Get user profile
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: req.user!.id },
            include: {
                education: true,
                experience: true,
                skills: true,
                projects: true,
                certifications: true,
            },
        });

        if (!profile) {
            return res
                .status(404)
                .json({ success: false, message: "Profile not found" });
        }

        res.json({ success: true, profile });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get profile",
        });
    }
});

// Update profile basic info
router.put("/", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            location,
            bio,
            profilePic,
            linkedIn,
            github,
            portfolio,
        } = req.body;

        const profile = await prisma.profile.update({
            where: { userId: req.user!.id },
            data: {
                firstName,
                lastName,
                email,
                phone,
                location,
                bio,
                profilePic,
                linkedIn,
                github,
                portfolio,
            },
        });

        res.json({ success: true, profile });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
});

// === Education CRUD ===
router.post("/education", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: req.user!.id },
        });
        const education = await prisma.education.create({
            data: { ...req.body, profileId: profile!.id },
        });
        res.status(201).json({ success: true, education });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add education",
        });
    }
});

router.put("/education/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const education = await prisma.education.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json({ success: true, education });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update education",
        });
    }
});

router.delete(
    "/education/:id",
    authMiddleware,
    async (req: AuthRequest, res) => {
        try {
            await prisma.education.delete({ where: { id: req.params.id } });
            res.json({ success: true, message: "Education deleted" });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete education",
            });
        }
    },
);

// === Experience CRUD ===
router.post("/experience", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: req.user!.id },
        });
        const experience = await prisma.experience.create({
            data: { ...req.body, profileId: profile!.id },
        });
        res.status(201).json({ success: true, experience });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add experience",
        });
    }
});

router.put("/experience/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const experience = await prisma.experience.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json({ success: true, experience });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update experience",
        });
    }
});

router.delete(
    "/experience/:id",
    authMiddleware,
    async (req: AuthRequest, res) => {
        try {
            await prisma.experience.delete({ where: { id: req.params.id } });
            res.json({ success: true, message: "Experience deleted" });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete experience",
            });
        }
    },
);

// === Skills CRUD ===
router.post("/skills", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: req.user!.id },
        });
        const skill = await prisma.skill.create({
            data: { ...req.body, profileId: profile!.id },
        });
        res.status(201).json({ success: true, skill });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add skill",
        });
    }
});

router.delete("/skills/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
        await prisma.skill.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: "Skill deleted" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete skill",
        });
    }
});

// === Projects CRUD ===
router.post("/projects", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: req.user!.id },
        });
        const project = await prisma.project.create({
            data: { ...req.body, profileId: profile!.id },
        });
        res.status(201).json({ success: true, project });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add project",
        });
    }
});

router.put("/projects/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const project = await prisma.project.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update project",
        });
    }
});

router.delete(
    "/projects/:id",
    authMiddleware,
    async (req: AuthRequest, res) => {
        try {
            await prisma.project.delete({ where: { id: req.params.id } });
            res.json({ success: true, message: "Project deleted" });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete project",
            });
        }
    },
);

// === Certifications CRUD ===
router.post(
    "/certifications",
    authMiddleware,
    async (req: AuthRequest, res) => {
        try {
            const profile = await prisma.profile.findUnique({
                where: { userId: req.user!.id },
            });
            const certification = await prisma.certification.create({
                data: { ...req.body, profileId: profile!.id },
            });
            res.status(201).json({ success: true, certification });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to add certification",
            });
        }
    },
);

router.delete(
    "/certifications/:id",
    authMiddleware,
    async (req: AuthRequest, res) => {
        try {
            await prisma.certification.delete({ where: { id: req.params.id } });
            res.json({ success: true, message: "Certification deleted" });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete certification",
            });
        }
    },
);

export default router;
