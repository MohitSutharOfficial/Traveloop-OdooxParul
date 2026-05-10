# Traveloop

Traveloop is a premium, intelligent, full-stack travel planning and itinerary management platform. The application is built with a modern React, Vite, and TypeScript frontend, backed by a robust Express.js, TypeScript, and Supabase PostgreSQL architecture. Traveloop provides seamless authentication, collaborative community feeds, dynamic day-by-day itineraries, interactive geographic mapping, budgeting and invoice generation, travel checklists, and real-time synchronization.

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

## Core Features and Routes

### Authentication and User Security
- **Path**: `/` (Landing/Login), `/signup`, `/forgot-password`
- **Security**: Complete password complexity validations, email verification mechanics, and secure JSON Web Token (JWT) verification utilizing custom Express.js authentication middleware.

### Traveloop Core Dashboard
- **Path**: `/dashboard`
- **Utility**: Presents featured trips, curated explore sections, live budget cards, and search navigation portals.

### Trips Hub and Creator Wizard
- **Path**: `/trips`, `/trip/create`
- **Utility**: Centralized management portal listing current and past trips. Creates newly tailored trips using a step-by-step wizard.

### Advanced Itinerary and Interactive Map
- **Path**: `/itinerary/:id`, `/map/:id`
- **Utility**: Dynamic day-by-day scheduling of activities, sorting mechanics, and real-time geocoding integrations to plot itinerary stops directly onto live maps.

### Explore and Search Directory
- **Path**: `/search/cities`, `/search/activities`
- **Utility**: Advanced search filters to explore destinations, find localized activities, and add them directly into your active itinerary.

### Checklist and Dynamic Notes
- **Path**: `/checklist`, `/notes`
- **Utility**: Pack list optimizer with category-based item grouping, real-time packing progress tracking, and an extensive scratchpad notes organizer.

### Budgets and Invoice System
- **Path**: `/invoice/:id`
- **Utility**: Comprehensive financial tracking allowing itemized cost tracking, auto-calculated VAT/taxes, total aggregation, and professional text-file summaries exportable directly to the user's local disk.

### Traveloop Social Community
- **Path**: `/community`
- **Utility**: Interactive space where users share travelogues, write trip updates, search topics, and interact through liking or commenting.

### Platform Administration Control
- **Path**: `/admin`, `/profile`
- **Utility**: Comprehensive console providing user directory filtering, record updates, stats monitoring, and user deletion tools.

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

1. **Frontend Configuration**  
   Create a `.env` file inside the `frontend` folder with the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Backend Configuration**  
   Create a `.env` file inside the `backend` folder with the following variables:
   ```env
   PORT=3000
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:5173
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
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


  