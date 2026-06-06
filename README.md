# Get Resume AI

A powerful, AI-driven ATS-friendly Resume Builder application. Create professional, high-impact resumes with real-time editing, premium template selection, and smart profile management.

## 🚀 Key Features

- **Real-time Resume Builder**: Dynamic editing with live preview.
- **Template Selection**: Choose from premium, curated ATS-optimized designs.
- **User Profile Management**: Global personal information management for quick resume generation.
- **Smart Controls**: Toggle sections (Summary, Projects, Skills) and switch between Fresher/Experienced modes.
- **ATS Recovery**: Built-in logic to ensure resumes pass through automated screening systems.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4.
- **State Management**: React Context API (ResumeContext, AuthContext).
- **Icons**: Lucide React.
- **Routing**: React Router DOM v7.
- **Backend (Server)**: Node.js, Express.
- **AI Integration**: AI-driven suggestions and ATS scoring.

## 📁 Directory Structure

Get Resume AI Project/
├── client/                  # React Frontend 
|
|-- server/                  # Node.js Backend 
|
|-- README.md                # Project Documentation


## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Frontend Setup (Client)
```bash
cd client
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

### 3. Backend Setup (Server)
```bash
cd server
npm install
# Configure your environment variables in .env
npm start
```

## 🤝 Contribution Guide

1. Create a feature branch.
2. Ensure you use the global `ResumeProvider` for state-dependent pages.
3. Follow the premium design system (Vanilla CSS components + Tailwind utilities).
4. For icons, use the `lucide-react` library but verify legacy icon support.

---
Built with ❤️ by the Get Resume team.
