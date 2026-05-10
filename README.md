# Traveloop

Traveloop is a premium, intelligent, full-stack travel planning and itinerary management platform. The application is built with a modern React, Vite, and TypeScript frontend, backed by a robust Express.js, TypeScript, and Supabase PostgreSQL architecture. Traveloop provides seamless authentication, collaborative community feeds, dynamic day-by-day itineraries, interactive geographic mapping, budgeting and invoice generation, travel checklists, and real-time synchronization.

---

### 🎥 Watch the Live Demo & Video Walkthrough 
### https://drive.google.com/file/d/1aF5TKKzDlbUgtd2lTsYal-ZPm8tL_B6V/view?t=2.143

---

<table>
<tr>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105107.png" alt="Trips Page" width="100%"/>
    </td>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105124.png" alt="Trips Page" width="100%"/>
    </td>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105145.png" alt="Trips Page" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105230.png" alt="Itinerary Page" width="100%"/>
    </td>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105243.png" alt="Map Page" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105312.png" alt="Search Cities Page" width="100%"/>
    </td>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105320.png" alt="Search Activities Page" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105329.png" alt="Community Feed" width="100%"/>
    </td>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105338.png" alt="Community Post" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105346.png" alt="Checklist Page" width="100%"/>
    </td>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105356.png" alt="Notes Page" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105425.png" alt="Invoices List" width="100%"/>
    </td>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105440.png" alt="Invoice Details Page" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105450.png" alt="Profile Page" width="100%"/>
    </td>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105502.png" alt="Admin Dashboard" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="screenshots/Screenshot%202026-05-11%20105541.png" alt="Profile Modal Edit" width="100%"/>
    </td>
  
  </tr>
</table>


## Architecture Overview

The codebase is organized as a monorepo containing distinct, decoupled frontend and backend services to enable clean separation of concerns, high performance, and flexible deployment.

- **Frontend**: A high-fidelity single-page application (SPA) styled with custom premium dark-mode CSS and Tailwind tokens. It leverages React 18, Lucide React icons, and standard state management frameworks to deliver micro-animations and smooth page transitions.
- **Backend**: An Express.js REST API layer that handles business logic, security validations, database migrations, seed data parsing, and user synchronization.
- **Database**: Powered by Supabase PostgreSQL, equipped with Row-Level Security (RLS) policies to secure user data, and pre-seeded with rich sample trips, city guides, notes, and activity structures.

---

## Technical Stack

### Frontend Service
- **Build Tool**: Vite
- **Framework**: React 18 (TypeScript)
- **Styling**: Tailwind CSS combined with Vanilla CSS variables for responsive theme styling
- **Icons & Visuals**: Lucide React
- **Services**: Supabase Client SDK for direct authentication operations

### Backend Service
- **Runtime**: Node.js
- **Server Framework**: Express.js (TypeScript)
- **Authentication & Core Database**: Supabase Service Role and Client SDKs
-  **Transactional Mail service** : Resend Api
- **Database Model**: Supabase PostgreSQL with custom RLS policies and relational constraints
- **Containerization**: Docker-ready with Dockerfile and environment configs

---

## Detailed Directory Map

```text
travel/
├── backend/                   - Express.js API codebase
│   ├── src/
│   │   ├── config/            - Supabase connection bootstrap
│   │   ├── controllers/       - Express handlers for trips, notes, invoices, etc.
│   │   ├── middleware/        - Error handling, validation, and authentication verification
│   │   ├── services/          - Business logic implementation
│   │   └── server.ts          - Server application entrypoint
│   ├── supabase-schema.sql    - Full database schema with tables and constraints
│   ├── seed-demo-data.sql     - High-fidelity SQL seed scripts for mock system database
│   ├── Dockerfile             - Production build container configuration
│   └── package.json           - Node backend dependencies
├── frontend/                  - Single-page React application
│   ├── src/
│   │   ├── components/        - Shared global components
│   │   ├── data/              - Fallback static and layout dataset providers
│   │   ├── pages/             - Page screen views for all 18 travel routes
│   │   ├── App.tsx            - Frontend routing and shell layout
│   │   └── main.tsx           - React entry point
│   └── package.json           - React frontend dependencies
├── screenshots/               - Interactive app screenshot storage
└── README.md                  - Primary project documentation (this file)
```

---


---

## Database Schema Configuration

The core PostgreSQL tables are structured with relational constraints to ensure data integrity. The primary relationships are structured as follows:

- **profiles**: Extended user information tied directly to Supabase Auth UUID records.
- **trips**: User travel plans including name, destination, start date, end date, budget, and cover image.
- **destinations**: Curated places with location tags and category associations.
- **itinerary_days / itinerary_activities**: Detailed chronological day-by-day itineraries.
- **packing_items**: Packing categories and target counts matched to specific trips.
- **notes**: Custom rich-text notes tied to relevant trips.
- **invoices / invoice_items**: Detailed cost tracking and financial records.
- **community_posts / post_likes**: Shared social feeds with functional like tracking.

Row-Level Security (RLS) policies are fully implemented across all schemas to prevent cross-tenant data leaks, ensuring users only read or write records that belong to them.

---

## Getting Started

Follow these steps to run the frontend and backend instances locally.

### Prerequisite Setup
Ensure you have Node.js (version 18 or above) installed on your system.

### Environment Variable Setup

For ease of setup, you can copy the contents of the respective `.env.example` files or use the configuration blocks below.

1. **Frontend Configuration**  
   Create a `.env` file inside the `frontend` folder:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

   # API Configuration
   VITE_API_URL=http://localhost:3000/api/v1

   # OpenWeather API
   VITE_OPENWEATHER_KEY=your-openweather-api-key
   ```

2. **Backend Configuration**  
   Create a `.env` file inside the `backend` folder:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3000
   API_VERSION=v1

   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   SUPABASE_JWT_SECRET=your-supabase-jwt-secret

   # Database (direct connection for migrations)
   DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres

   # CORS
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

   # OpenWeather API
   OPENWEATHER_API_KEY=your-openweather-api-key

   # Email Service (Resend)
   RESEND_API_KEY=your-resend-api-key
   FROM_EMAIL=noreply@yourdomain.com
   APP_URL=http://localhost:5173

   # Logging
   LOG_LEVEL=info

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

### Executing the Services

#### 1. Launching the Backend Service
From the root project directory:
```bash
cd backend
npm install
npm run dev
```
The server will boot up and listen on port 3000, connected to your Supabase PostgreSQL cluster.

#### 2. Launching the Frontend Application
In a separate terminal, from the root project directory:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to the address shown in the terminal (typically `http://localhost:5173`) to view and interact with the application.


  