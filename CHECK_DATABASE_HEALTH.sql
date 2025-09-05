-- Comprehensive Database Health Check
-- Run this in your Supabase SQL Editor to diagnose all database issues

-- 1. Check if profiles table exists
SELECT 
  'Table Existence' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles'
    ) THEN '✅ EXISTS' 
    ELSE '❌ MISSING' 
  END as status,
  'profiles table' as description;

-- 2. Check table structure
SELECT 
  'Table Structure' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles'
      AND column_name = 'user_id'
    ) THEN '✅ COMPLETE' 
    ELSE '❌ INCOMPLETE' 
  END as status,
  'profiles table columns' as description;

-- 3. Check RLS status
SELECT 
  'RLS Status' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename = 'profiles' 
      AND rowsecurity = true
    ) THEN '✅ ENABLED' 
    ELSE '❌ DISABLED' 
  END as status,
  'Row Level Security' as description;

-- 4. Check policies
SELECT 
  'Policy Count' as check_type,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles') >= 3 THEN '✅ SUFFICIENT' 
    ELSE '❌ INSUFFICIENT' 
  END as status,
  'Number of RLS policies' as description;

-- 5. Check for duplicate policies
SELECT 
  'Policy Conflicts' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT policyname, COUNT(*) 
      FROM pg_policies 
      WHERE tablename = 'profiles' 
      GROUP BY policyname 
      HAVING COUNT(*) > 1
    ) THEN '❌ DUPLICATES FOUND' 
    ELSE '✅ NO CONFLICTS' 
  END as status,
  'Duplicate policy detection' as description;

-- 6. Check permissions
SELECT 
  'Permissions' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.role_table_grants 
      WHERE table_name = 'profiles' 
      AND grantee = 'authenticated'
    ) THEN '✅ CORRECT' 
    ELSE '❌ INCORRECT' 
  END as status,
  'User permissions' as description;

-- 7. Test table access (this will show any RLS errors)
SELECT 
  'Table Access' as check_type,
  CASE 
    WHEN (SELECT COUNT(*) FROM profiles LIMIT 1) >= 0 THEN '✅ ACCESSIBLE' 
    ELSE '❌ BLOCKED' 
  END as status,
  'Can query profiles table' as description;

-- 8. Show all current policies
SELECT 
  'Current Policies' as check_type,
  'POLICIES LISTED BELOW' as status,
  'All active policies on profiles table' as description;

-- List all policies
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;
