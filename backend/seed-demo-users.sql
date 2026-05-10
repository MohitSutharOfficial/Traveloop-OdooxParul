-- Create demo users for testing
-- Note: These users need to be created in Supabase Auth first, then we add their profile data

-- This script assumes the users have been created in Supabase Auth with these credentials:
-- Admin: admin@traveloop.com / admin123
-- Demo: demo@traveloop.com / demo123

-- You need to create these users in Supabase Auth Dashboard first, then run this script
-- Or use the Supabase Auth API to create them programmatically

-- Example profile data (update the user_id with actual Supabase Auth user IDs)
-- INSERT INTO profiles (id, email, full_name, avatar_url, created_at, updated_at)
-- VALUES 
--   ('admin-user-id-here', 'admin@traveloop.com', 'Admin User', null, now(), now()),
--   ('demo-user-id-here', 'demo@traveloop.com', 'Demo User', null, now(), now());

-- Sample trips for demo user
-- INSERT INTO trips (owner_id, name, destination, start_date, end_date, status, budget_total, budget_spent, currency)
-- VALUES
--   ('demo-user-id-here', 'Weekend in Goa', 'Goa, India', '2026-06-15', '2026-06-17', 'upcoming', 25000, 0, 'INR'),
--   ('demo-user-id-here', 'Rajasthan Heritage Tour', 'Jaipur, India', '2026-07-01', '2026-07-07', 'upcoming', 50000, 0, 'INR');

-- Note: Replace 'demo-user-id-here' and 'admin-user-id-here' with actual Supabase Auth user IDs
