// User types
export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    createdAt?: string;
}

export interface GuestUser {
    id: string;
    name: string;
    isGuest: true;
}

export type AuthUser = User | GuestUser;

// Profile types
export interface Profile {
    id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    bio?: string;
    profilePic?: string;
    linkedIn?: string;
    github?: string;
    portfolio?: string;
    education: Education[];
    experience: Experience[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
    description?: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current: boolean;
    description?: string;
}

export interface Skill {
    id: string;
    name: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    category?: string;
}

export interface Project {
    id: string;
    title: string;
    description?: string;
    techStack: string[];
    liveUrl?: string;
    repoUrl?: string;
    startDate?: string;
    endDate?: string;
}

export interface Certification {
    id: string;
    name: string;
    issuingOrg: string;
    issueDate?: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
}

// Platform types
export type PlatformType =
    | "linkedin"
    | "github"
    | "resume"
    | "freelance"
    | "job_portal"
    | "cover_letter";
