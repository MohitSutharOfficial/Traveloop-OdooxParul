# Graph Report - travel  (2026-05-11)

## Corpus Check
- 120 files · ~43,277 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 398 nodes · 319 edges · 30 communities detected
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 37|Community 37]]

## God Nodes (most connected - your core abstractions)
1. `InvoiceService` - 9 edges
2. `InvoiceController` - 8 edges
3. `TripService` - 8 edges
4. `commit()` - 8 edges
5. `CommunityController` - 7 edges
6. `ItineraryController` - 7 edges
7. `PackingController` - 7 edges
8. `TripController` - 7 edges
9. `CommunityService` - 7 edges
10. `ItineraryService` - 7 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --calls--> `testConnection()`  [INFERRED]
  backend\src\server.ts → backend\src\config\supabase.ts
- `signup()` --calls--> `handleSignupWithEmail()`  [INFERRED]
  backend\src\controllers\auth.controller.ts → backend\src\services\auth.service.ts
- `login()` --calls--> `handleLogin()`  [INFERRED]
  backend\src\controllers\auth.controller.ts → backend\src\services\auth.service.ts
- `verifyEmail()` --calls--> `verifyEmailToken()`  [INFERRED]
  backend\src\controllers\auth.controller.ts → backend\src\services\auth.service.ts
- `resendConfirmation()` --calls--> `resendConfirmationEmail()`  [INFERRED]
  backend\src\controllers\auth.controller.ts → backend\src\services\auth.service.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (12): forgotPassword(), login(), resendConfirmation(), signup(), verifyEmail(), handleLogin(), handlePasswordResetRequest(), handleSignupWithEmail() (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (13): closeCreateModal(), closeItemModal(), createInvoiceNumber(), downloadTextFile(), encodeItemDescription(), formatMoney(), handleAddItem(), handleCreateInvoice() (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (6): closeUserModal(), handleSaveUser(), handleSearch(), handleSortChange(), loadData(), addDays()

### Community 3 - "Community 3"
Cohesion: 0.31
Nodes (8): commit(), handleAddActivity(), handleAddSection(), handleDeleteActivity(), handleDeleteSection(), handleDragEnd(), handleUpdateActivity(), handleUpdateSection()

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (1): InvoiceService

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (2): cancelEdit(), saveEdit()

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (1): InvoiceController

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (1): TripService

### Community 8 - "Community 8"
Cohesion: 0.25
Nodes (1): CommunityController

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (1): ItineraryController

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (1): PackingController

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (1): TripController

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (1): CommunityService

### Community 13 - "Community 13"
Cohesion: 0.25
Nodes (1): ItineraryService

### Community 14 - "Community 14"
Cohesion: 0.29
Nodes (1): PackingService

### Community 15 - "Community 15"
Cohesion: 0.29
Nodes (1): ActivityController

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (1): AdminController

### Community 17 - "Community 17"
Cohesion: 0.29
Nodes (1): DestinationController

### Community 18 - "Community 18"
Cohesion: 0.29
Nodes (1): NoteController

### Community 19 - "Community 19"
Cohesion: 0.29
Nodes (1): ActivityService

### Community 20 - "Community 20"
Cohesion: 0.33
Nodes (1): AdminService

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (1): DestinationService

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (1): NoteService

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (2): closeModal(), handleSubmit()

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (1): ProfileService

### Community 28 - "Community 28"
Cohesion: 0.4
Nodes (2): testConnection(), bootstrap()

### Community 29 - "Community 29"
Cohesion: 0.4
Nodes (1): ProfileController

### Community 32 - "Community 32"
Cohesion: 0.5
Nodes (2): handleEmailSignUp(), validatePassword()

### Community 34 - "Community 34"
Cohesion: 0.5
Nodes (1): AppError

### Community 37 - "Community 37"
Cohesion: 0.67
Nodes (2): geocodeAllLocations(), geocodeLocation()

## Knowledge Gaps
- **Thin community `Community 4`** (10 nodes): `invoice.service.ts`, `InvoiceService`, `.addItem()`, `.create()`, `.delete()`, `.getById()`, `.listByTrip()`, `.recalculateTotal()`, `.removeItem()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (10 nodes): `Checklist.tsx`, `beginEdit()`, `cancelEdit()`, `handleCreate()`, `handleDelete()`, `handleResetAll()`, `handleShare()`, `handleToggle()`, `run()`, `saveEdit()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (9 nodes): `invoice.controller.ts`, `InvoiceController`, `.addItem()`, `.create()`, `.delete()`, `.getById()`, `.listByTrip()`, `.removeItem()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (9 nodes): `trip.service.ts`, `TripService`, `.create()`, `.delete()`, `.getById()`, `.getByIdAdmin()`, `.getStats()`, `.listByOwner()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (8 nodes): `community.controller.ts`, `CommunityController`, `.create()`, `.delete()`, `.getById()`, `.like()`, `.list()`, `.unlike()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (8 nodes): `itinerary.controller.ts`, `ItineraryController`, `.create()`, `.delete()`, `.getById()`, `.listByTrip()`, `.reorder()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (8 nodes): `packing.controller.ts`, `PackingController`, `.bulkCreate()`, `.create()`, `.delete()`, `.listByTrip()`, `.togglePacked()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (8 nodes): `trip.controller.ts`, `TripController`, `.create()`, `.delete()`, `.getById()`, `.list()`, `.stats()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (8 nodes): `community.service.ts`, `CommunityService`, `.create()`, `.delete()`, `.getById()`, `.like()`, `.list()`, `.unlike()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (8 nodes): `itinerary.service.ts`, `ItineraryService`, `.create()`, `.delete()`, `.getById()`, `.listByTrip()`, `.reorder()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (8 nodes): `packing.service.ts`, `PackingService`, `.bulkCreate()`, `.create()`, `.delete()`, `.listByTrip()`, `.togglePacked()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (7 nodes): `activity.controller.ts`, `ActivityController`, `.create()`, `.delete()`, `.getById()`, `.list()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (7 nodes): `admin.controller.ts`, `AdminController`, `.createUser()`, `.dashboard()`, `.deleteUser()`, `.listUsers()`, `.updateUser()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (7 nodes): `destination.controller.ts`, `DestinationController`, `.create()`, `.delete()`, `.getById()`, `.list()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (7 nodes): `note.controller.ts`, `NoteController`, `.create()`, `.delete()`, `.getById()`, `.listByTrip()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (7 nodes): `activity.service.ts`, `ActivityService`, `.create()`, `.delete()`, `.getById()`, `.list()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (7 nodes): `admin.service.ts`, `AdminService`, `.createUser()`, `.deleteUser()`, `.getDashboard()`, `.listUsers()`, `.updateUser()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (7 nodes): `destination.service.ts`, `DestinationService`, `.create()`, `.delete()`, `.getById()`, `.list()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (7 nodes): `note.service.ts`, `NoteService`, `.create()`, `.delete()`, `.getById()`, `.listByTrip()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (7 nodes): `Notes.tsx`, `closeModal()`, `handleDelete()`, `handleSubmit()`, `openCreateModal()`, `openEditModal()`, `run()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (6 nodes): `profile.service.ts`, `ProfileService`, `.getById()`, `.list()`, `.update()`, `.upsert()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (5 nodes): `supabase.ts`, `server.ts`, `createUserClient()`, `testConnection()`, `bootstrap()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (5 nodes): `profile.controller.ts`, `ProfileController`, `.getMe()`, `.list()`, `.updateMe()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (5 nodes): `SignUp.tsx`, `handleChange()`, `handleEmailSignUp()`, `handleOAuthSignUp()`, `validatePassword()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (4 nodes): `error.middleware.ts`, `AppError`, `.constructor()`, `errorHandler()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (4 nodes): `MapView.tsx`, `geocodeAllLocations()`, `geocodeLocation()`, `MapUpdater()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `loadData()` connect `Community 2` to `Community 3`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._