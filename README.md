# ProfileStack 🚀

**One Profile, Everywhere** – AI-powered profile management platform that acts as a centralized storage for all your professional information.

![ProfileStack Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=ProfileStack)

## 🎯 Problem Statement

Students and early professionals repeatedly enter the same personal, academic, and professional information across multiple platforms. This leads to:

- Inconsistent information across platforms
- Wasted time rewriting and reformatting profiles
- Poorly optimized resumes or profiles
- Reduced productivity and missed opportunities

## 💡 Solution

ProfileStack allows users to **store once, modify intelligently, and use everywhere**:

- **Centralized Profile Storage**: Single source of truth for all your professional data
- **AI-Driven Customization**: Adapt profiles for LinkedIn, GitHub, resumes, freelance platforms, and more
- **One-Click Modification**: Change tone, format, and emphasis based on platform or role
- **Consistent Data**: Keep information up-to-date across all platforms

## 🏗️ Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| **Frontend** | Next.js 16, React 19, TailwindCSS 4 |
| **Backend**  | Express.js, TypeScript              |
| **Database** | PostgreSQL + Prisma ORM             |
| **AI**       | Google Gemini API                   |
| **DevOps**   | Docker, Docker Compose              |

## 📁 Project Structure

```
ProfileStack/
├── frontend/              # Next.js frontend application
│   ├── app/               # App router pages
│   ├── public/            # Static assets
│   └── package.json
├── backend/               # Express.js API server
│   ├── src/
│   │   ├── index.ts       # Entry point
│   │   ├── lib/           # Prisma & Gemini clients
│   │   ├── middleware/    # Auth middleware
│   │   └── routes/        # API routes
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
├── docker-compose.yml     # Container orchestration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- pnpm (recommended) or npm
- Google Gemini API Key

### 1. Clone & Setup Environment

```bash
# Clone the repository
git clone https://github.com/your-username/profilestack.git
cd profilestack

# Copy environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 2. Development with Docker

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Development without Docker

```bash
# Start PostgreSQL (requires local installation)
# Or use: docker-compose up postgres -d

# Backend
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev

# Frontend (new terminal)
cd frontend
pnpm install
pnpm dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | User login        |
| POST   | `/api/auth/logout`   | User logout       |
| GET    | `/api/auth/me`       | Get current user  |

### Profile Management

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| GET    | `/api/profile`            | Get complete profile |
| PUT    | `/api/profile`            | Update profile info  |
| POST   | `/api/profile/education`  | Add education        |
| POST   | `/api/profile/experience` | Add experience       |
| POST   | `/api/profile/skills`     | Add skill            |
| POST   | `/api/profile/projects`   | Add project          |

### AI Features

| Method | Endpoint                     | Description                        |
| ------ | ---------------------------- | ---------------------------------- |
| POST   | `/api/ai/generate/:platform` | Generate platform-specific profile |
| POST   | `/api/ai/improve-bio`        | Improve bio with AI                |
| POST   | `/api/ai/suggest-skills`     | Get skill suggestions              |

## 🔮 Roadmap

- [ ] User authentication & authorization
- [ ] Complete profile management
- [ ] AI-powered profile generation
- [ ] Platform export (LinkedIn, GitHub, etc.)
- [ ] Resume PDF generation
- [ ] Chrome extension for auto-fill
- [ ] Analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">Made with ❤️ by ProfileStack Team</p>
