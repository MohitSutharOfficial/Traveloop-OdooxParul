-- =========================================================
-- Traveloop Supabase Database Schema
-- =========================================================
-- Execute this in the Supabase SQL Editor for the travel planning demo.
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- ENUM TYPES
-- =========================================================

CREATE TYPE travel_style AS ENUM ('adventure', 'relaxation', 'cultural', 'business');
CREATE TYPE trip_status AS ENUM ('draft', 'upcoming', 'active', 'completed', 'cancelled');
CREATE TYPE invoice_status AS ENUM ('draft', 'issued', 'paid', 'void');
CREATE TYPE itinerary_item_type AS ENUM ('flight', 'hotel', 'activity', 'meal', 'transfer', 'note');

-- =========================================================
-- TABLES
-- =========================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(40),
  city VARCHAR(120),
  country VARCHAR(120),
  preferred_travel_style travel_style DEFAULT 'adventure',
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(160) NOT NULL,
  country VARCHAR(160) NOT NULL,
  region VARCHAR(160),
  image_url TEXT,
  description TEXT,
  average_daily_budget NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(180) NOT NULL,
  destination VARCHAR(180) NOT NULL,
  cover_photo TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status trip_status DEFAULT 'draft',
  planning_score INTEGER DEFAULT 0 CHECK (planning_score BETWEEN 0 AND 100),
  budget_total NUMERIC(12, 2) DEFAULT 0,
  budget_spent NUMERIC(12, 2) DEFAULT 0,
  currency CHAR(3) DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT trips_date_order CHECK (end_date >= start_date)
);

CREATE TABLE itinerary_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  item_type itinerary_item_type NOT NULL,
  title VARCHAR(180) NOT NULL,
  location VARCHAR(180),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  notes TEXT,
  cost NUMERIC(10, 2) DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  name VARCHAR(180) NOT NULL,
  category VARCHAR(120),
  description TEXT,
  price_from NUMERIC(10, 2),
  rating NUMERIC(3, 2) CHECK (rating BETWEEN 0 AND 5),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE packing_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  label VARCHAR(160) NOT NULL,
  category VARCHAR(120),
  is_packed BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE trip_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  title VARCHAR(180) NOT NULL,
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  invoice_number VARCHAR(80) UNIQUE NOT NULL,
  status invoice_status DEFAULT 'draft',
  currency CHAR(3) DEFAULT 'USD',
  total NUMERIC(12, 2) DEFAULT 0,
  issued_at DATE,
  paid_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description VARCHAR(220) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  destination VARCHAR(180),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_destinations_name ON destinations(name);
CREATE INDEX idx_trips_owner ON trips(owner_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX idx_itinerary_trip ON itinerary_items(trip_id);
CREATE INDEX idx_activities_destination ON activities(destination_id);
CREATE INDEX idx_packing_trip ON packing_items(trip_id);
CREATE INDEX idx_notes_trip ON trip_notes(trip_id);
CREATE INDEX idx_invoices_trip ON invoices(trip_id);
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_community_destination ON community_posts(destination);

-- =========================================================
-- FUNCTIONS & TRIGGERS
-- =========================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itinerary_items_updated_at
  BEFORE UPDATE ON itinerary_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packing_items_updated_at
  BEFORE UPDATE ON packing_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_notes_updated_at
  BEFORE UPDATE ON trip_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are readable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users manage their own profile"
  ON profiles FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Destinations are public"
  ON destinations FOR SELECT
  USING (true);

CREATE POLICY "Activities are public"
  ON activities FOR SELECT
  USING (true);

CREATE POLICY "Users manage their own trips"
  ON trips FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users manage itinerary for owned trips"
  ON itinerary_items FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = itinerary_items.trip_id AND trips.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = itinerary_items.trip_id AND trips.owner_id = auth.uid()));

CREATE POLICY "Users manage packing for owned trips"
  ON packing_items FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = packing_items.trip_id AND trips.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = packing_items.trip_id AND trips.owner_id = auth.uid()));

CREATE POLICY "Users manage notes for owned trips"
  ON trip_notes FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_notes.trip_id AND trips.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_notes.trip_id AND trips.owner_id = auth.uid()));

CREATE POLICY "Users manage invoices for owned trips"
  ON invoices FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = invoices.trip_id AND trips.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = invoices.trip_id AND trips.owner_id = auth.uid()));

CREATE POLICY "Users manage invoice items for owned invoices"
  ON invoice_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM invoices
      JOIN trips ON trips.id = invoices.trip_id
      WHERE invoices.id = invoice_items.invoice_id
        AND trips.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM invoices
      JOIN trips ON trips.id = invoices.trip_id
      WHERE invoices.id = invoice_items.invoice_id
        AND trips.owner_id = auth.uid()
    )
  );

CREATE POLICY "Community posts are public"
  ON community_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can post"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- =========================================================
-- SEED DATA
-- =========================================================

INSERT INTO destinations (name, country, region, image_url, average_daily_budget) VALUES
('Paris', 'France', 'Europe', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', 220),
('Bali', 'Indonesia', 'Southeast Asia', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', 120),
('Tokyo', 'Japan', 'Asia', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', 180),
('New York', 'United States', 'North America', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', 260),
('London', 'United Kingdom', 'Europe', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', 240);

INSERT INTO activities (name, category, description, price_from, rating, image_url) VALUES
('Louvre Museum Highlights', 'Culture', 'A curated walk through classic Paris galleries.', 45, 4.8, 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=400'),
('Ubud Rice Terrace Walk', 'Nature', 'Morning walk through Bali rice terraces and local cafes.', 30, 4.7, 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400'),
('Shibuya Night Food Tour', 'Food', 'Street food stops and neon viewpoints in Tokyo.', 65, 4.9, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400');

-- =========================================================
-- END OF SCHEMA
-- =========================================================
