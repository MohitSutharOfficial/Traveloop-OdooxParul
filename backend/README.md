# Traveloop Backend API

Express.js REST API workspace for Traveloop.

The active hackathon demo currently uses Supabase Auth plus frontend mock trip data, and `supabase-schema.sql` contains the Traveloop database model for profiles, trips, destinations, itineraries, packing items, notes, invoices, and community posts.

## Development

```bash
cd backend
npm install
npm run dev
```

## Environment

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
