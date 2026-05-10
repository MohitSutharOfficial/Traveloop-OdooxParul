-- Demo Data Setup Script
-- Run this AFTER creating the demo users in Supabase Auth

-- First, get the user IDs from Supabase Auth
-- You can find them in: Supabase Dashboard → Authentication → Users
-- Replace the UUIDs below with the actual user IDs

-- Example: If admin user ID is 'abc-123-def' and demo user ID is 'xyz-789-ghi'

-- Set admin flag for admin user
-- Replace 'ADMIN_USER_ID_HERE' with actual admin user ID from Supabase Auth
UPDATE profiles 
SET is_admin = true 
WHERE id = '6a5f1760-1ab2-4b94-a123-eef2d1c52541';

-- Ensure demo user is NOT admin
-- Replace 'DEMO_USER_ID_HERE' with actual demo user ID from Supabase Auth
UPDATE profiles 
SET is_admin = false 
WHERE id = '6130142a-b9f8-4c7d-b389-409d70495f1d';

-- Sample trips for demo user
INSERT INTO trips (owner_id, name, destination, start_date, end_date, status, budget_total, budget_spent, currency, cover_photo, planning_score)
VALUES
  -- Replace 'DEMO_USER_ID_HERE' with actual demo user ID from Supabase Auth
  ('6130142a-b9f8-4c7d-b389-409d70495f1d', 'Weekend in Goa', 'Goa, India', '2026-06-15', '2026-06-17', 'upcoming', 25000, 5000, 'INR', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', 65),
  ('6130142a-b9f8-4c7d-b389-409d70495f1d', 'Rajasthan Heritage Tour', 'Jaipur, India', '2026-07-01', '2026-07-07', 'upcoming', 50000, 12000, 'INR', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', 45),
  ('6130142a-b9f8-4c7d-b389-409d70495f1d', 'Kerala Backwaters', 'Alleppey, India', '2026-05-20', '2026-05-25', 'completed', 35000, 33000, 'INR', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', 100);

-- Sample destinations (these are shared across all users)
INSERT INTO destinations (name, country, description, image_url)
VALUES
  ('Goa', 'India', 'Beautiful beaches and Portuguese heritage', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'),
  ('Jaipur', 'India', 'The Pink City with magnificent forts and palaces', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800'),
  ('Kerala', 'India', 'Gods Own Country with backwaters and tea plantations', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'),
  ('Ladakh', 'India', 'High altitude desert with stunning landscapes', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800');

-- Sample activities
INSERT INTO activities (name, description, category, rating, image_url)
VALUES
  ('Beach Hopping in Goa', 'Visit the best beaches in Goa', 'sightseeing', 4.5, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'),
  ('Amber Fort Tour', 'Explore the magnificent Amber Fort', 'sightseeing', 4.8, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400'),
  ('Kerala Houseboat Stay', 'Experience Kerala backwaters on a houseboat', 'accommodation', 4.7, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400'),
  ('Pangong Lake Visit', 'Visit the stunning Pangong Lake', 'sightseeing', 4.9, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400');

-- Sample community posts
INSERT INTO community_posts (author_id, title, body, destination, image_url)
VALUES
  ('6130142a-b9f8-4c7d-b389-409d70495f1d', 'Amazing Goa Trip', 'Just returned from an amazing trip to Goa! The beaches were pristine and the seafood was incredible. Highly recommend visiting during the off-season for a more peaceful experience.', 'Goa, India', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600'),
  ('6130142a-b9f8-4c7d-b389-409d70495f1d', 'Rajasthan Hotel Booking Tip', 'Pro tip: Book your Rajasthan hotels in advance during peak season. The heritage hotels fill up quickly!', 'Jaipur, India', null);

-- Instructions:
-- 1. Create demo users in Supabase Auth Dashboard first
-- 2. Get their user IDs from the Users table
-- 3. Replace 'DEMO_USER_ID_HERE' with the actual UUID
-- 4. Run this script in Supabase SQL Editor

-- Example of how to find user IDs:
-- SELECT id, email FROM auth.users WHERE email IN ('demo@traveloop.com', 'admin@traveloop.com');
