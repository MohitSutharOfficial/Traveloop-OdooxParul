-- =========================================================
-- Traveloop Sample Data
-- Run this in Supabase SQL Editor after supabase-schema.sql.
-- =========================================================

TRUNCATE TABLE invoice_items CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE trip_notes CASCADE;
TRUNCATE TABLE packing_items CASCADE;
TRUNCATE TABLE itinerary_items CASCADE;
TRUNCATE TABLE community_posts CASCADE;
TRUNCATE TABLE activities CASCADE;
TRUNCATE TABLE destinations CASCADE;

INSERT INTO destinations (name, country, region, image_url, average_daily_budget) VALUES
('Paris', 'France', 'Europe', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', 220),
('Bali', 'Indonesia', 'Southeast Asia', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', 120),
('Tokyo', 'Japan', 'Asia', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', 180),
('New York', 'United States', 'North America', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', 260),
('London', 'United Kingdom', 'Europe', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', 240);

INSERT INTO activities (name, category, description, price_from, rating, image_url) VALUES
('Louvre Museum Highlights', 'Cultural', 'A curated walk through classic Paris galleries.', 45, 4.8, 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=400'),
('Ubud Rice Terrace Walk', 'Adventure', 'Morning walk through Bali rice terraces and local cafes.', 30, 4.7, 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400'),
('Shibuya Night Food Tour', 'Food', 'Street food stops and neon viewpoints in Tokyo.', 65, 4.9, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400');

INSERT INTO community_posts (title, body, destination, image_url) VALUES
('Three quiet cafes near the Seine', 'A short list for slow mornings between museums.', 'Paris', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400'),
('Bali packing notes for monsoon season', 'Light layers, dry bags, sandals, and an extra phone pouch helped a lot.', 'Bali', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400');
