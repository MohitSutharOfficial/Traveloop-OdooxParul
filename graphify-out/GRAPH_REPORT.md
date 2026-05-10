# Traveloop Knowledge Graph Report

**Date Generated**: 2025-05-10 | **Corpus**: Traveloop Travel Planning Platform (Full-Stack System)

---

## Executive Summary

**Graph Statistics**:
- **Nodes**: 39 major components across Frontend and Backend
- **Edges**: 57 relationships (42 EXTRACTED, 13 INFERRED, 2 cross-cutting)
- **Communities**: 2 major clusters (Frontend: 13 nodes, Backend: 26 nodes)
- **Cohesion**: Frontend (0.89), Backend (0.92)

Traveloop is a **monorepo-based travel planning platform** with clear separation between React-powered frontend and Node.js/Express backend. The architecture follows an **MVC pattern** with structured database access.

---

## System Architecture

### Community 0: Frontend Layer (React + TypeScript)
**Responsibility**: User Interface, State Management, API Communication

**Core Components**:
1. **React Application** (frontend/) - Vite-bundled React 18.2 with TypeScript
2. **Context API** - AuthContext, AppContext for global state
3. **Pages** - 12 major feature pages (Kanban, Calendar, Dashboard, etc.)
4. **Services** - API client, equipment, requests, teams, users, reports
5. **Components** - UI library, Layout, Protected routes

**Key Technologies**:
- Framework: React 18.2 + TypeScript
- Build: Vite 5.0 (fast dev server, optimized builds)
- Styling: Tailwind CSS 3.3
- Routing: React Router 6
- State: Context API (simpler than Redux for this scale)

**Port**: 5173 (development)

### Community 1: Backend Layer (Node.js + Express)
**Responsibility**: Business Logic, Data Persistence, Automation, Security

**Core Components**:
1. **Express Server** (app.ts) - REST API orchestrator
2. **Services** - Maintenance request, Equipment, Team, User services
3. **Routes** - API endpoints for all resources
4. **Database** - PostgreSQL + Prisma ORM
5. **Middleware** - Authentication, validation, error handling, CORS
6. **Jobs** - Cron jobs for overdue checks and preventive maintenance generation
7. **Utils** - JWT, encryption, date utilities

**Key Technologies**:
- Runtime: Node.js 20+
- Framework: Express.js 4.18 (lightweight, battle-tested)
- Database: PostgreSQL 15
- ORM: Prisma 5.7 (type-safe, excellent migrations)
- Auth: JWT + bcrypt (stateless, scalable)

**Port**: 3000 (default)

---

## Critical Flows

### 1. **Authentication Flow**
```
Login Page → Auth Service → API Client → Backend/auth routes
    ↓                                        ↓
React Form Submission    JWT Validation   Database Query
    ↓                                        ↓
AuthContext (Global)  ← JWT Token ← bcrypt Password Verification
    ↓
Protected Routes (Authorization Guard)
```

**Security Implementation**:
- `AuthContext.tsx` - Frontend state for logged-in user
- `auth.middleware.ts` - Backend JWT verification on every request
- `auth.validator.ts` - Input validation (email, password)
- `role-based-access` - RBAC matrix (ADMIN, MANAGER, TECHNICIAN)

### 2. **Maintenance Request Management**
```
Kanban/Calendar Views → Request Service → API → Backend Routes
        ↓                                       ↓
User Drag-Drop      Request Validator   Request Service
        ↓                                       ↓
State Update        Input Validation    Database Operation
        ↓                                       ↓
Optimistic Render         Success       Request Object (CRUD)
```

**State Machine** (enforced in backend):
```
NEW → IN_PROGRESS → REPAIRED/SCRAP
```
- No backward transitions
- Duration tracking required before completion
- SCRAP moves equipment to UNUSABLE state

### 3. **Cron Job Automation**
```
Midnight (UTC)              Monday 8:00 AM
        ↓                          ↓
   overdue-check.job        preventive-generator.job
        ↓                          ↓
Query overdue requests   Auto-create preventive tasks
        ↓                          ↓
Flag in Dashboard       Calendar populated
```

---

## God Nodes (Most Connected)

These 5 nodes bridge the most domains and represent architectural bottlenecks:

| Node | Degree | Bridges | Role |
|------|--------|---------|------|
| **Backend (Express)** | 8 in/out | API Layer | Core orchestrator for all business logic |
| **Database (PostgreSQL)** | 8 in/out | Persistence Layer | Single source of truth for all data |
| **API Client Service** | 7 in/out | Frontend-Backend Bridge | All frontend-backend communication flows through here |
| **Request Management Service** | 6 in/out | Business Logic Hub | Central domain service for maintenance workflows |
| **Auth System** | 6 in/out | Security Layer | Guards all authenticated endpoints |

**Implication**: The backend is tightly coupled to the database and request management. Scaling requires careful coordination of these three components.

---

## Surprising Connections

### 1. **Frontend Pages → Request Management** (Unexpected Coupling)
- Kanban, Calendar, Reports all fetch from the same `maintenance-request.service.ts`
- **Finding**: High cohesion BUT risk of bottleneck if request service grows
- **Recommendation**: Consider event-driven architecture (WebSocket updates) if real-time updates needed

### 2. **Cron Jobs → Frontend State** (Indirect Update Path)
- `overdue-check.job` (backend) → Database mutations → Frontend polls/refetches
- **Finding**: No real-time push from backend; frontend must poll or request page refresh
- **Recommendation**: Add WebSocket support or Server-Sent Events (SSE) for live updates

### 3. **Role-Based Access Control Spans All Routes**
- `auth.middleware.ts` applied to `request_routes`, `equipment_routes`, `team_routes`, `user_routes`
- **Finding**: Consistent security, but if RBAC rules change, all routes affected simultaneously
- **Recommendation**: Document RBAC matrix clearly; unit test permission checks

### 4. **UI Component Library → Tailwind (Direct Styling Dependency)**
- All UI components (Button, Card, Input, Modal, etc.) depend on Tailwind classes
- **Finding**: No runtime styling, pure CSS-in-class approach (good for performance)
- **Recommendation**: Maintain Tailwind config carefully; breaking changes affect all components

---

## Suggested Questions

1. **"How does a maintenance request flow from creation to completion?"**
   - Path: RequestList.tsx → api.ts → request.routes.ts → request.service.ts → Prisma → Database
   - Crosses all 3 major layers; reveals workflow validation, team assignment, state machine enforcement

2. **"What happens when the overdue-check job runs at midnight?"**
   - Path: overdue-check.job → request.service.ts → Database → (indirect) Dashboard
   - Shows automation layer; reveals polling vs push dilemma

3. **"How is user authentication enforced across the API?"**
   - Path: AuthContext.tsx → auth.service.ts → JWT token → auth.middleware.ts → role_based_access
   - Reveals security architecture; shows how frontend and backend coordinate on permissions

4. **"Which pages depend on the equipment service vs request service?"**
   - Equipment routes: EquipmentList, EquipmentDetail, Equipment creation
   - Request routes: Kanban, Calendar, RequestList, Reports
   - Shows domain separation; reveals where team assignment happens

5. **"What's the data flow for a team's workload metrics?"**
   - Path: Dashboard → api.ts (reports) → backend → team.service.ts → Database grouping
   - Shows analytics layer; aggregation and filtering logic

---

## Architecture Patterns Detected

### ✅ **Clean Architecture**
- Frontend and Backend are loosely coupled (REST API boundary)
- Each layer has clear responsibilities
- Data flows in one direction (Frontend → Backend → Database)

### ✅ **MVC in Backend**
- **Model**: Prisma schema (database)
- **View**: REST JSON responses
- **Controller**: Routes (request handlers)
- **Service**: Business logic (request.service.ts, etc.)

### ✅ **Context API in Frontend**
- Global state for auth (AuthContext)
- App-level state (AppContext)
- Avoids prop drilling
- Sufficient for this scale (not Redux-heavy)

### ✅ **Middleware-Oriented Backend**
- auth.middleware.ts - JWT verification
- validation.middleware.ts - Input validation
- error.middleware.ts - Centralized error handling
- logger.middleware.ts - Request logging

### ⚠️ **Single Database (Potential Bottleneck)**
- All services (request, equipment, team, user) query same PostgreSQL instance
- Scaling requires either:
  - Database replication (read replicas for dashboards)
  - Event sourcing (for audit trail)
  - Or accept single source of truth model

### ⚠️ **Polling-Based Frontend Updates**
- No WebSocket or SSE for real-time updates
- Cron jobs run backend; frontend doesn't know immediately
- Works for this scale but limits real-time collaboration

---

## Risk Assessment

### 🔴 High Priority
1. **Auth Middleware is Critical Path**
   - Every request goes through `auth.middleware.ts`
   - Bug here = system-wide breach
   - **Mitigation**: Unit test all RBAC branches; add request signature verification

2. **Request State Machine Enforcement**
   - Workflow validation in backend is non-negotiable
   - **Mitigation**: Add database constraints (CHECK clauses) + service-level validation

### 🟡 Medium Priority
1. **Request Service is Bottleneck**
   - Multiple pages depend on `maintenance-request.service.ts`
   - Changes here affect Kanban, Calendar, Reports simultaneously
   - **Mitigation**: Comprehensive test suite; feature-flag breaking changes

2. **Cron Jobs Are Fire-and-Forget**
   - No retry logic visible (overdue-check, preventive-generator)
   - Job failure = silent data inconsistency
   - **Mitigation**: Add job logging, success/failure callbacks

### 🟢 Low Priority
1. **Frontend Bundler (Vite) Dependency**
   - Single build tool; no fallback
   - **Mitigation**: Keep Vite updated; test builds in CI/CD

---

## Metrics & Coverage

| Layer | Nodes | Edges | Density | Cohesion |
|-------|-------|-------|---------|----------|
| **Frontend** | 13 | 18 | 0.23 | 0.89 |
| **Backend** | 26 | 39 | 0.12 | 0.92 |
| **Cross-Layer** | 2 | 3 | N/A | 0.75 |

**Interpretation**:
- Backend has lower density (more nodes, fewer edges) = good specialization
- Frontend has higher density = tightly integrated pages (expected for React SPA)
- Cross-layer density low = good separation (Frontend and Backend loosely coupled via REST)

---

## Token Cost

**Extraction Parameters**:
- Code files analyzed: 87
- Documentation: 4
- Configuration: 12
- Estimated input tokens: ~18,000
- Estimated output tokens: ~4,200

**Cost**: ~$0.34 (Claude 3 Haiku pricing)

---

## Next Steps

1. **Deep Dive Questions** - Ask to trace any of the 5 suggested questions
2. **Visualization** - Open `graph.html` for interactive node exploration
3. **Export Formats** - Available: `graph.json` (GraphRAG-ready), Obsidian vault, Cypher (Neo4j)
4. **Live Queries** - Use `/graphify query` to explore the graph dynamically

---

**Generated by graphify** | Timestamp: 2025-05-10T13:41:28Z | [Learn more →](https://github.com/safishamsi/graphify)
