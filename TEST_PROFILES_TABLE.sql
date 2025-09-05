-- Test Script to Check Profiles Table
-- Run this in your Supabase SQL Editor

-- 1. Check if profiles table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) as table_exists;

-- 2. If table exists, show its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Check if there are any profiles
SELECT COUNT(*) as profile_count FROM profiles;

-- 4. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 5. Test inserting a profile (this will fail if RLS is blocking)
-- Uncomment the line below to test:
-- INSERT INTO profiles (user_id, full_name, role) VALUES ('00000000-0000-0000-0000-000000000000', 'Test User', 'USER');
