import { Router } from "express";
import prisma from "../lib/prisma";
import geminiModel from "../lib/gemini";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Platform types for customization
type PlatformType =
    | "linkedin"
    | "github"
    | "resume"
    | "freelance"
    | "job_portal"
    | "cover_letter";

// Generate platform-specific profile
router.post(
    "/generate/:platform",
    authMiddleware,
    async (req: AuthRequest, res) => {
        try {
            const platform = req.params.platform as PlatformType;
            const { jobTitle, company, additionalContext } = req.body;

            // Get user's complete profile
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

            const platformPrompts: Record<PlatformType, string> = {
                linkedin: `Generate a professional LinkedIn profile summary and headline. Focus on achievements, career goals, and professional brand.`,
                github: `Generate a GitHub profile README. Focus on technical skills, projects, and open-source contributions. Use markdown format.`,
                resume: `Generate a professional resume in structured format. Focus on relevant experience, skills, and achievements. Be concise and impactful.`,
                freelance: `Generate a freelancer profile bio. Emphasize unique selling points, expertise areas, and client benefits. Make it engaging.`,
                job_portal: `Generate a job portal profile optimized for ATS. Focus on keywords, quantifiable achievements, and relevant experience.`,
                cover_letter: `Generate a compelling cover letter for the role of ${jobTitle || "the position"} at ${company || "the company"}. Be professional yet personable.`,
            };

            const prompt = `
You are an AI profile optimization expert. Based on the following user profile data, ${platformPrompts[platform]}

User Profile:
- Name: ${profile.firstName} ${profile.lastName}
- Bio: ${profile.bio || "Not provided"}
- Location: ${profile.location || "Not provided"}

Education:
${profile.education.map((e) => `- ${e.degree} at ${e.institution} (${e.fieldOfStudy || ""})`).join("\n") || "None"}

Experience:
${profile.experience.map((e) => `- ${e.position} at ${e.company} (${e.current ? "Current" : "Past"}): ${e.description || ""}`).join("\n") || "None"}

Skills:
${profile.skills.map((s) => `- ${s.name} (${s.level})`).join("\n") || "None"}

Projects:
${profile.projects.map((p) => `- ${p.title}: ${p.description || ""} [${p.techStack.join(", ")}]`).join("\n") || "None"}

Certifications:
${profile.certifications.map((c) => `- ${c.name} by ${c.issuingOrg}`).join("\n") || "None"}

${additionalContext ? `Additional Context: ${additionalContext}` : ""}

Generate the ${platform} optimized content:
`;

            const result = await geminiModel.generateContent(prompt);
            const generatedContent = result.response.text();

            res.json({
                success: true,
                platform,
                content: generatedContent,
            });
        } catch (error) {
            console.error("AI generation error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to generate content",
            });
        }
    },
);

// Improve bio using AI
router.post("/improve-bio", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const { bio, tone } = req.body; // tone: professional, casual, creative

        const prompt = `
Improve the following bio to make it more ${tone || "professional"} and impactful. 
Keep it concise but compelling. Fix any grammar issues.

Original bio:
"${bio}"

Improved bio:
`;

        const result = await geminiModel.generateContent(prompt);
        const improvedBio = result.response.text();

        res.json({ success: true, improvedBio });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to improve bio",
        });
    }
});

// Suggest skills based on profile
router.post(
    "/suggest-skills",
    authMiddleware,
    async (req: AuthRequest, res) => {
        try {
            const profile = await prisma.profile.findUnique({
                where: { userId: req.user!.id },
                include: { skills: true, experience: true, projects: true },
            });

            const prompt = `
Based on the following user experience and projects, suggest 5-10 relevant skills they might want to add to their profile.
Only suggest skills not already in their list.

Current Skills: ${profile?.skills.map((s) => s.name).join(", ") || "None"}
Experience: ${profile?.experience.map((e) => `${e.position} at ${e.company}`).join(", ") || "None"}
Projects: ${profile?.projects.map((p) => `${p.title} (${p.techStack.join(", ")})`).join(", ") || "None"}

Return as a JSON array of skill names:
`;

            const result = await geminiModel.generateContent(prompt);
            const suggestedSkills = result.response.text();

            res.json({ success: true, suggestedSkills });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to suggest skills",
            });
        }
    },
);

export default router;
