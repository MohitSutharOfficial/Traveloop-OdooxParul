# Graph Report - travel  (2026-05-10)

## Corpus Check
- 97 files · ~24,809 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 244 nodes · 159 edges · 14 communities detected
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 22|Community 22]]

## God Nodes (most connected - your core abstractions)
1. `MaintenanceRequestController` - 8 edges
2. `MaintenanceTeamController` - 8 edges
3. `MaintenanceRequestService` - 8 edges
4. `MaintenanceTeamService` - 8 edges
5. `EquipmentService` - 7 edges
6. `EquipmentController` - 6 edges
7. `UserController` - 3 edges
8. `startCronJobs()` - 3 edges
9. `connectDatabase()` - 2 edges
10. `testConnection()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `connectDatabase()` --calls--> `testConnection()`  [INFERRED]
  backend\src\config\database.ts → backend\src\config\supabase.ts
- `authenticate()` --calls--> `verifyToken()`  [INFERRED]
  backend\src\middleware\auth.middleware.ts → backend\src\utils\jwt.ts
- `getDateRange()` --calls--> `addDays()`  [INFERRED]
  frontend\src\pages\CalendarView.tsx → backend\src\utils\dateUtils.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (2): getDateRange(), addDays()

### Community 1 - "Community 1"
Cohesion: 0.25
Nodes (1): MaintenanceRequestController

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (1): MaintenanceTeamController

### Community 3 - "Community 3"
Cohesion: 0.28
Nodes (1): MaintenanceRequestService

### Community 4 - "Community 4"
Cohesion: 0.25
Nodes (1): MaintenanceTeamService

### Community 5 - "Community 5"
Cohesion: 0.25
Nodes (1): EquipmentService

### Community 6 - "Community 6"
Cohesion: 0.25
Nodes (2): authenticate(), verifyToken()

### Community 7 - "Community 7"
Cohesion: 0.29
Nodes (1): EquipmentController

### Community 11 - "Community 11"
Cohesion: 0.5
Nodes (2): handleEmailSignUp(), validatePassword()

### Community 12 - "Community 12"
Cohesion: 0.5
Nodes (2): connectDatabase(), testConnection()

### Community 13 - "Community 13"
Cohesion: 0.5
Nodes (1): UserController

### Community 14 - "Community 14"
Cohesion: 0.83
Nodes (3): startCronJobs(), startOverdueCheckJob(), startPreventiveGeneratorJob()

### Community 15 - "Community 15"
Cohesion: 0.5
Nodes (1): AppError

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (2): getInitials(), UserMenuDropdown()

## Knowledge Gaps
- **Thin community `Community 0`** (14 nodes): `dateUtils.ts`, `CalendarView.tsx`, `getDateRange()`, `getEventsForDate()`, `getEventsForTimeSlot()`, `goToToday()`, `handleCreateEvent()`, `handleTimeSlotClick()`, `navigateBack()`, `navigateForward()`, `addDays()`, `calculateOverdue()`, `formatDate()`, `getDaysDifference()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 1`** (9 nodes): `maintenance-request.controller.ts`, `MaintenanceRequestController`, `.create()`, `.delete()`, `.getAll()`, `.getById()`, `.getOverdue()`, `.update()`, `.updateStage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 2`** (9 nodes): `maintenance-team.controller.ts`, `MaintenanceTeamController`, `.addMember()`, `.create()`, `.delete()`, `.getAll()`, `.getById()`, `.removeMember()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 3`** (9 nodes): `maintenance-request.service.ts`, `MaintenanceRequestService`, `.create()`, `.delete()`, `.getAll()`, `.getById()`, `.getOverdue()`, `.update()`, `.updateStage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (9 nodes): `maintenance-team.service.ts`, `MaintenanceTeamService`, `.addMember()`, `.create()`, `.delete()`, `.getAll()`, `.getById()`, `.removeMember()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (8 nodes): `equipment.service.ts`, `EquipmentService`, `.create()`, `.delete()`, `.getAll()`, `.getById()`, `.getOpenRequestsCount()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (8 nodes): `auth.middleware.ts`, `jwt.ts`, `authenticate()`, `authorize()`, `generateRefreshToken()`, `generateToken()`, `verifyRefreshToken()`, `verifyToken()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (7 nodes): `equipment.controller.ts`, `EquipmentController`, `.create()`, `.delete()`, `.getAll()`, `.getById()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (5 nodes): `SignUp.tsx`, `handleChange()`, `handleEmailSignUp()`, `handleOAuthSignUp()`, `validatePassword()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (4 nodes): `database.ts`, `supabase.ts`, `connectDatabase()`, `testConnection()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (4 nodes): `user.controller.ts`, `UserController`, `.getAll()`, `.getById()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (4 nodes): `error.middleware.ts`, `AppError`, `.constructor()`, `errorHandler()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (3 nodes): `getInitials()`, `UserMenuDropdown()`, `UserMenuDropdown.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._