-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'ACTOR', 'DIRECTOR', 'PRODUCER', 'WRITER', 'CINEMATOGRAPHER', 'PRODUCTION_COMPANY', 'EDITOR', 'SOUND_DESIGNER', 'PRODUCTION_DESIGNER', 'COSTUME_DESIGNER', 'MAKEUP_ARTIST', 'STUNT_COORDINATOR', 'VISUAL_EFFECTS_ARTIST', 'MUSIC_COMPOSER', 'ART_DIRECTOR', 'LOCATION_MANAGER')),
  bio TEXT,
  location TEXT,
  website TEXT,
  phone TEXT,
  date_of_birth DATE,
  experience TEXT,
  education TEXT,
  skills TEXT[],
  portfolio TEXT[],
  social_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Create index on role for role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Admins can insert profiles for other users
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'role', 'USER'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;

-- Insert a default admin user if needed (replace with your email)
-- INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
-- VALUES ('admin@filmcollab.com', crypt('your-admin-password', gen_salt('bf')), NOW(), NOW(), NOW(), '{"full_name": "Admin User", "role": "ADMIN"}');

-- Note: The above admin user creation is commented out for security
-- You should create your admin user through the signup process instead
