const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
}

class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setToken(token: string | null) {
        this.token = token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
    ): Promise<T> {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        if (this.token) {
            (headers as Record<string, string>)["Authorization"] =
                `Bearer ${this.token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "API request failed");
        }

        return data;
    }

    // Auth endpoints
    async googleLogin(credential: string) {
        return this.request<{ user: any; token: string }>("/auth/google", {
            method: "POST",
            body: JSON.stringify({ credential }),
        });
    }

    async getMe() {
        return this.request<{ user: any }>("/auth/me");
    }

    async logout() {
        return this.request("/auth/logout", { method: "POST" });
    }

    // Profile endpoints
    async getProfile() {
        return this.request<{ profile: any }>("/profile");
    }

    async updateProfile(data: any) {
        return this.request<{ profile: any }>("/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    // Education CRUD
    async addEducation(data: any) {
        return this.request("/profile/education", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateEducation(id: string, data: any) {
        return this.request(`/profile/education/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async deleteEducation(id: string) {
        return this.request(`/profile/education/${id}`, { method: "DELETE" });
    }

    // Experience CRUD
    async addExperience(data: any) {
        return this.request("/profile/experience", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateExperience(id: string, data: any) {
        return this.request(`/profile/experience/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async deleteExperience(id: string) {
        return this.request(`/profile/experience/${id}`, { method: "DELETE" });
    }

    // Skills CRUD
    async addSkill(data: any) {
        return this.request("/profile/skills", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async deleteSkill(id: string) {
        return this.request(`/profile/skills/${id}`, { method: "DELETE" });
    }

    // Projects CRUD
    async addProject(data: any) {
        return this.request("/profile/projects", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateProject(id: string, data: any) {
        return this.request(`/profile/projects/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async deleteProject(id: string) {
        return this.request(`/profile/projects/${id}`, { method: "DELETE" });
    }

    // AI endpoints
    async generateForPlatform(platform: string, data?: any) {
        return this.request<{ content: string }>(`/ai/generate/${platform}`, {
            method: "POST",
            body: JSON.stringify(data || {}),
        });
    }

    async improveBio(bio: string, tone?: string) {
        return this.request<{ improvedBio: string }>("/ai/improve-bio", {
            method: "POST",
            body: JSON.stringify({ bio, tone }),
        });
    }

    async suggestSkills() {
        return this.request<{ suggestedSkills: string }>("/ai/suggest-skills", {
            method: "POST",
        });
    }

    // Certifications CRUD
    async addCertification(data: any) {
        return this.request("/profile/certifications", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async deleteCertification(id: string) {
        return this.request(`/profile/certifications/${id}`, {
            method: "DELETE",
        });
    }

    // Sync local profile to cloud
    async syncLocalProfile(profileData: any) {
        return this.request<{ profile: any }>("/profile/sync", {
            method: "POST",
            body: JSON.stringify(profileData),
        });
    }
}

export const api = new ApiClient(API_URL);
export default api;
