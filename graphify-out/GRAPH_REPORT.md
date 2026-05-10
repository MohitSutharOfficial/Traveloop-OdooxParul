# Graph Report - travel  (2026-05-10)

## Corpus Check
- 103 files · ~25,935 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 306 nodes · 213 edges · 23 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 31|Community 31]]

## God Nodes (most connected - your core abstractions)
1. `InvoiceService` - 9 edges
2. `InvoiceController` - 8 edges
3. `TripService` - 8 edges
4. `ItineraryController` - 7 edges
5. `PackingController` - 7 edges
6. `TripController` - 7 edges
7. `ItineraryService` - 7 edges
8. `PackingService` - 7 edges
9. `DestinationController` - 6 edges
10. `NoteController` - 6 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --calls--> `testConnection()`  [INFERRED]
  backend\src\server.ts → backend\src\config\supabase.ts
- `addDays()` --calls--> `getDateRange()`  [INFERRED]
  backend\src\utils\dateUtils.ts → frontend\src\pages\CalendarView.tsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (2): getDateRange(), addDays()

### Community 1 - "Community 1"
Cohesion: 0.29
Nodes (1): InvoiceService

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (1): InvoiceController

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (1): TripService

### Community 4 - "Community 4"
Cohesion: 0.25
Nodes (1): ItineraryController

### Community 5 - "Community 5"
Cohesion: 0.25
Nodes (1): PackingController

### Community 6 - "Community 6"
Cohesion: 0.25
Nodes (1): TripController

### Community 7 - "Community 7"
Cohesion: 0.25
Nodes (1): ItineraryService

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (1): PackingService

### Community 9 - "Community 9"
Cohesion: 0.29
Nodes (1): DestinationController

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (1): NoteController

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (1): ActivityService

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (1): DestinationService

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (1): NoteService

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (1): ActivityController

### Community 16 - "Community 16"
Cohesion: 0.33
Nodes (1): CommunityController

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (1): CommunityService

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (1): ProfileService

### Community 21 - "Community 21"
Cohesion: 0.4
Nodes (2): testConnection(), bootstrap()

### Community 22 - "Community 22"
Cohesion: 0.4
Nodes (1): ProfileController

### Community 23 - "Community 23"
Cohesion: 0.5
Nodes (2): handleEmailSignUp(), validatePassword()

### Community 24 - "Community 24"
Cohesion: 0.5
Nodes (1): AppError

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (2): getInitials(), UserMenuDropdown()

## Knowledge Gaps
- **Thin community `Community 0`** (14 nodes): `dateUtils.ts`, `CalendarView.tsx`, `getDateRange()`, `getEventsForDate()`, `getEventsForTimeSlot()`, `goToToday()`, `handleCreateEvent()`, `handleTimeSlotClick()`, `navigateBack()`, `navigateForward()`, `addDays()`, `calculateOverdue()`, `formatDate()`, `getDaysDifference()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 1`** (10 nodes): `invoice.service.ts`, `InvoiceService`, `.addItem()`, `.create()`, `.delete()`, `.getById()`, `.listByTrip()`, `.recalculateTotal()`, `.removeItem()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 2`** (9 nodes): `invoice.controller.ts`, `InvoiceController`, `.addItem()`, `.create()`, `.delete()`, `.getById()`, `.listByTrip()`, `.removeItem()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 3`** (9 nodes): `trip.service.ts`, `TripService`, `.create()`, `.delete()`, `.getById()`, `.getByIdAdmin()`, `.getStats()`, `.listByOwner()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (8 nodes): `itinerary.controller.ts`, `ItineraryController`, `.create()`, `.delete()`, `.getById()`, `.listByTrip()`, `.reorder()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (8 nodes): `packing.controller.ts`, `PackingController`, `.bulkCreate()`, `.create()`, `.delete()`, `.listByTrip()`, `.togglePacked()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (8 nodes): `trip.controller.ts`, `TripController`, `.create()`, `.delete()`, `.getById()`, `.list()`, `.stats()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (8 nodes): `itinerary.service.ts`, `ItineraryService`, `.create()`, `.delete()`, `.getById()`, `.listByTrip()`, `.reorder()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (8 nodes): `packing.service.ts`, `PackingService`, `.bulkCreate()`, `.create()`, `.delete()`, `.listByTrip()`, `.togglePacked()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (7 nodes): `destination.controller.ts`, `DestinationController`, `.create()`, `.delete()`, `.getById()`, `.list()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (7 nodes): `note.controller.ts`, `NoteController`, `.create()`, `.delete()`, `.getById()`, `.listByTrip()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (7 nodes): `activity.service.ts`, `ActivityService`, `.create()`, `.delete()`, `.getById()`, `.list()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (7 nodes): `destination.service.ts`, `DestinationService`, `.create()`, `.delete()`, `.getById()`, `.list()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (7 nodes): `note.service.ts`, `NoteService`, `.create()`, `.delete()`, `.getById()`, `.listByTrip()`, `.update()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (6 nodes): `activity.controller.ts`, `ActivityController`, `.create()`, `.delete()`, `.getById()`, `.list()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (6 nodes): `community.controller.ts`, `CommunityController`, `.create()`, `.delete()`, `.getById()`, `.list()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (6 nodes): `community.service.ts`, `CommunityService`, `.create()`, `.delete()`, `.getById()`, `.list()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (6 nodes): `profile.service.ts`, `ProfileService`, `.getById()`, `.list()`, `.update()`, `.upsert()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (5 nodes): `supabase.ts`, `server.ts`, `createUserClient()`, `testConnection()`, `bootstrap()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (5 nodes): `profile.controller.ts`, `ProfileController`, `.getMe()`, `.list()`, `.updateMe()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (5 nodes): `SignUp.tsx`, `handleChange()`, `handleEmailSignUp()`, `handleOAuthSignUp()`, `validatePassword()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (4 nodes): `error.middleware.ts`, `AppError`, `.constructor()`, `errorHandler()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (3 nodes): `getInitials()`, `UserMenuDropdown()`, `UserMenuDropdown.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._