# ProfileStack 🚀

**One Profile, Everywhere** – AI-powered profile management platform that acts as a centralized storage for all your professional information.

## 🎯 Problem Statement

Students and early professionals repeatedly enter the same information across multiple platforms. This leads to:

- Inconsistent information across platforms
- Wasted time rewriting and reformatting profiles
- Poorly optimized resumes or profiles
- Reduced productivity and missed opportunities

## 💡 Solution

ProfileStack allows users to **store once, modify intelligently, and use everywhere**:

- **Centralized Profile Storage**: Single source of truth for all your professional data
- **AI-Driven Customization**: Adapt profiles for LinkedIn, GitHub, resumes, freelance platforms, and more
- **Google Sign-In**: Seamless authentication with cloud sync
- **Guest Mode**: Try without signing in – data stored locally
- **One-Click Modification**: Change tone, format, and emphasis based on platform or role

## 🏗️ Tech Stack

| Layer        | Technology                          | Deployment       |
| ------------ | ----------------------------------- | ---------------- |
| **Frontend** | Next.js 16, React 19, TailwindCSS 4 | Vercel           |
| **Backend**  | Express.js, TypeScript              | Google Cloud     |
| **Database** | PostgreSQL + Prisma ORM             | Google Cloud SQL |
| **AI**       | Google Gemini API                   | -                |
| **Auth**     | Google OAuth 2.0                    | -                |

## 📁 Project Structure

```
ProfileStack/
├── frontend/              # Next.js frontend (Vercel)
│   ├── app/               # App router pages
│   │   ├── page.tsx       # Auth page
│   │   └── dashboard/     # Protected dashboard pages
│   ├── components/        # React components
│   ├── lib/               # Store & API client
│   └── types/             # TypeScript interfaces
├── backend/               # Express.js API (Google Cloud)
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── lib/           # Prisma & Gemini clients
│   │   └── middleware/    # Auth middleware
│   └── prisma/            # Database schema
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- Google OAuth Client ID
- Gemini API Key

### 1. Clone & Setup

```bash
git clone https://github.com/your-username/profilestack.git
cd profilestack
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma migrate dev
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
pnpm install
cp .env.example .env.local
# Add NEXT_PUBLIC_GOOGLE_CLIENT_ID
pnpm dev
```

### Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔐 Authentication

| Mode               | Storage      | Sync            |
| ------------------ | ------------ | --------------- |
| **Google Sign-In** | PostgreSQL   | ✅ Cloud synced |
| **Guest Mode**     | localStorage | ❌ Local only   |

## 📡 API Endpoints

### Auth

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| POST   | `/api/auth/google` | Google OAuth login |
| POST   | `/api/auth/logout` | Logout             |
| GET    | `/api/auth/me`     | Get current user   |

### Profile

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| GET    | `/api/profile`            | Get complete profile |
| PUT    | `/api/profile`            | Update profile info  |
| POST   | `/api/profile/education`  | Add education        |
| POST   | `/api/profile/experience` | Add experience       |
| POST   | `/api/profile/skills`     | Add skill            |
| POST   | `/api/profile/projects`   | Add project          |

### AI

| Method | Endpoint                     | Description                        |
| ------ | ---------------------------- | ---------------------------------- |
| POST   | `/api/ai/generate/:platform` | Generate platform-specific profile |
| POST   | `/api/ai/improve-bio`        | Improve bio with AI                |
| POST   | `/api/ai/suggest-skills`     | Get skill suggestions              |

## 🔮 Roadmap

- [x] Google OAuth authentication
- [x] Guest mode with local storage
- [ ] Complete profile management forms
- [ ] AI-powered profile generation
- [ ] Platform export (LinkedIn, GitHub, etc.)
- [ ] Resume PDF generation
- [ ] Chrome extension for auto-fill

## 📄 License

MIT License

---

<p align="center">Made with ❤️ by Mohd Rafey</p>
