# 🔧 Supabase Authentication Setup Guide

## Step 1: Create Supabase Project

1. **Go to [https://supabase.com](https://supabase.com)**
2. **Sign up/Login** to your account
3. **Create a new project**:
   - Click "New Project"
   - Choose your organization
   - Enter project name: `filmcollab` (or your preferred name)
   - Enter a secure database password
   - Choose a region close to you
   - Click "Create new project"

## Step 2: Get Your API Keys

1. **Go to Project Settings**:
   - In your Supabase dashboard, click the gear icon (⚙️) next to your project name
   - Select "API" from the sidebar

2. **Copy the required values**:
   - **Project URL**: Copy the "Project URL" (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **Anon Key**: Copy the "anon public" key (starts with `eyJ...`)

## Step 3: Create Environment File

1. **Create `.env.local` file** in your project root (same level as `package.json`)

2. **Add the following content**:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Optional - for Google OAuth later
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional - for file uploads later
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

3. **Replace the placeholder values**:
   - Replace `https://your-project.supabase.co` with your actual Project URL
   - Replace `your-supabase-anon-key` with your actual anon key

## Step 4: Configure Supabase Authentication

1. **Go to Authentication Settings**:
   - In your Supabase dashboard, click "Authentication" in the sidebar
   - Click "Settings"

2. **Configure Site URL**:
   - Add `http://localhost:3000` to "Site URL" (for development)
   - Add `http://localhost:3000/auth/callback` to "Redirect URLs"

3. **Enable Email Authentication**:
   - Make sure "Enable email confirmations" is ON
   - You can disable "Enable email confirmations" for testing if you want

## Step 4.5: Create Required Database Tables

**🚨 CRITICAL: This step is required to fix the "Cannot read properties of undefined (reading 'user')" error!**

1. **Go to SQL Editor**:
   - In your Supabase dashboard, click "SQL Editor" in the left sidebar
   - Click "New Query"

2. **Run the Setup Script**:
   - Copy the contents of `SUPABASE_SETUP_MINIMAL.sql` file from your project (recommended)
   - OR use `SUPABASE_SETUP_SIMPLE.sql` if you prefer the full version
   - Paste it into the SQL Editor
   - Click "Run" to execute the script

3. **Test the Table Creation**:
   - Run the `TEST_PROFILES_TABLE.sql` script to verify everything is working
   - This will show you if the table exists, its structure, and any RLS policies

4. **Alternative: Manual Table Creation**:
   If you prefer to create tables manually:
   - Go to "Table Editor" → "Create a new table"
   - Create a table named `profiles` with these columns:
     - `id` (UUID, Primary Key, Default: gen_random_uuid())
     - `user_id` (UUID, References auth.users(id))
     - `full_name` (Text)
     - `first_name` (Text)
     - `last_name` (Text)
     - `role` (Text, Default: 'USER')
     - `created_at` (Timestamp, Default: now())
     - `updated_at` (Timestamp, Default: now())
   - Enable Row Level Security (RLS)
   - Create appropriate RLS policies

## Step 5: Test the Application

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test Signup**:
   - Go to `http://localhost:3000/auth/signup`
   - Fill out the form and create an account
   - Check your Supabase dashboard → Authentication → Users to see the new user

3. **Test Signin**:
   - Go to `http://localhost:3000/auth/signin`
   - Sign in with your created account

## Step 6: Verify Data Storage

1. **Check Supabase Dashboard**:
   - Go to your Supabase project dashboard
   - Click "Authentication" → "Users"
   - You should see your registered user with all the metadata (first_name, last_name, role, etc.)

2. **Check User Metadata**:
   - Click on your user in the list
   - You should see the user metadata including:
     - `first_name`
     - `last_name`
     - `role`
     - `full_name`

## Troubleshooting

### Error: "Your project's URL and API key are required"
- Make sure you created the `.env.local` file
- Make sure the environment variables are correctly named
- Restart your development server after creating the file

### Error: "Invalid login credentials"
- Check if the user exists in Supabase Authentication → Users
- Make sure you're using the correct email/password

### Error: "Email not confirmed"
- Go to Supabase Authentication → Settings
- Temporarily disable "Enable email confirmations" for testing
- Or check your email for the confirmation link

### Users not appearing in Supabase
- Make sure you're using the correct Supabase project
- Check the browser console for any errors
- Verify the environment variables are loaded correctly

## Next Steps

Once authentication is working:

1. **Enable Google OAuth** (optional):
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials

2. **Set up Database Tables** (for additional user data):
   - Go to SQL Editor
   - Create tables for profiles, jobs, events, etc.

3. **Configure Row Level Security (RLS)**:
   - Enable RLS on your tables
   - Create policies for data access

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the Supabase dashboard logs
3. Verify your environment variables are correct
4. Make sure you're using the latest version of the Supabase client
