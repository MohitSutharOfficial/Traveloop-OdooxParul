# Traveloop

Traveloop is a modern travel planning platform transformed from the original project shell. It keeps the existing React/Vite structure, authentication flow, dashboard layout, and route organization while replacing the maintenance domain with trip planning, itinerary, destination search, packing, notes, invoice, community, and admin flows.

## Frontend

- React 18, Vite, TypeScript, Tailwind CSS
- Supabase authentication
- Lucide React icons
- Traveloop amber theme with global dark mode
- Dashboard demo data for featured trips and destinations

## Demo Routes

- `/dashboard`
- `/trips`
- `/trip/create`
- `/itinerary/:id`
- `/map/:id`
- `/search/cities`
- `/search/activities`
- `/community`
- `/checklist`
- `/notes`
- `/invoice/:id`
- `/profile`
- `/admin`

## Development

```bash
cd frontend
npm install
npm run dev
```

Create a Supabase project and provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `frontend/.env` for authentication.
