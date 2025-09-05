# FilmCollab Role-Based Authentication System

## Overview

This document describes the implementation of a comprehensive role-based authentication system for FilmCollab that prevents cross-access between admin and user dashboards.

## System Architecture

### 1. Role Types
- **USER**: Standard user accounts with access to `/dashboard`
- **ADMIN**: Administrative accounts with access to `/admin-dashboard`

### 2. Authentication Flow

#### User Signup (`/auth/signup`)
- Automatically assigns `USER` role
- Stores role in database `profiles` table
- Redirects to `/auth/signin` after successful signup

#### Admin Signup (`/admin-signup`)
- Automatically assigns `ADMIN` role
- Stores role in database `profiles` table
- Redirects to `/admin-dashboard` after successful signup

#### User Signin (`/auth/signin`)
- Validates credentials against Supabase
- Checks user role from database
- **ADMIN users**: Blocked with "Unauthorized access" error
- **USER users**: Redirected to `/dashboard`
- **No role**: Error message to contact support

#### Admin Signin (`/admin-signin`)
- Validates credentials against Supabase
- Checks user role from database
- **USER users**: Blocked with "Unauthorized access" error
- **ADMIN users**: Redirected to `/admin-dashboard`
- **No role**: Error message to contact support

## Implementation Details

### 1. Supabase Provider (`components/providers/supabase-provider.tsx`)

#### New Features
- `userRole` state to track current user's role
- `checkUserRole()` function to query database for user role
- Automatic role checking on authentication state changes
- Role validation during sign-in process

#### Key Functions
```typescript
const checkUserRole = async (userId: string): Promise<UserRole | null>
const signIn = async (email: string, password: string)
const signUp = async (email: string, password: string, userData: any)
```

### 2. Route Protection

#### Middleware (`middleware.ts`)
- Protects `/dashboard` (requires USER role)
- Protects `/admin-dashboard` (requires ADMIN role)
- Validates JWT tokens and user roles
- Redirects unauthorized users to appropriate signin pages

#### App Layout (`components/layout/app-layout.tsx`)
- Client-side role validation
- Automatic redirection based on user role
- Prevents admin users from accessing user dashboard
- Prevents user users from accessing admin dashboard

### 3. Database Schema

#### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('USER', 'ADMIN')) DEFAULT 'USER',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Features

### 1. Role Validation
- Database-level role checking on every authentication
- Prevents role spoofing or manipulation
- Automatic role assignment during signup

### 2. Route Protection
- Server-side middleware protection
- Client-side role validation
- Automatic redirection for unauthorized access

### 3. Error Handling
- Clear error messages for unauthorized access
- Graceful fallbacks for missing roles
- Comprehensive logging for debugging

## Usage Examples

### 1. Creating a User Account
```typescript
// User signs up at /auth/signup
const userData = {
  first_name: "John",
  last_name: "Doe",
  role: "USER", // Automatically assigned
  full_name: "John Doe"
};
```

### 2. Creating an Admin Account
```typescript
// Admin signs up at /admin-signup
const userData = {
  full_name: "Admin User",
  role: "ADMIN" // Automatically assigned
};
```

### 3. Role-Based Access Control
```typescript
// In components
const { user, userRole } = useSupabase();

if (userRole === 'ADMIN') {
  // Show admin-only content
} else if (userRole === 'USER') {
  // Show user-only content
}
```

## Testing

### 1. Role Verification Component
- `components/auth/role-verification.tsx`
- Displays current user's role and authentication status
- Useful for debugging and testing

### 2. Test Scenarios
- **User signup**: Should assign USER role and redirect to signin
- **Admin signup**: Should assign ADMIN role and redirect to admin dashboard
- **User signin**: Should block ADMIN users, allow USER users
- **Admin signin**: Should block USER users, allow ADMIN users
- **Dashboard access**: Should redirect based on role

## Error Messages

### 1. Unauthorized Access
- **Admin trying to access user signin**: "Unauthorized access. Admin users must use the admin signin page."
- **User trying to access admin signin**: "Unauthorized access. User accounts cannot access admin dashboard."

### 2. Role Issues
- **No role found**: "User role not found. Please contact support."
- **Invalid credentials**: "Invalid email or password"

## Future Enhancements

### 1. Additional Roles
- Support for custom roles (e.g., MODERATOR, EDITOR)
- Role hierarchy and permissions

### 2. Advanced Security
- Two-factor authentication
- Session management
- Audit logging

### 3. User Management
- Admin panel for user role management
- Bulk role updates
- Role-based permissions system

## Troubleshooting

### 1. Common Issues
- **Role not updating**: Check database connection and profiles table
- **Redirect loops**: Verify middleware configuration
- **Authentication errors**: Check Supabase configuration

### 2. Debug Tools
- Browser console logging
- Role verification component
- Network tab for API calls

## Conclusion

This role-based authentication system provides:
- **Security**: Prevents unauthorized access to dashboards
- **Scalability**: Easy to add new roles and permissions
- **User Experience**: Clear error messages and automatic redirections
- **Maintainability**: Clean, well-documented code structure

The system ensures that users can only access the appropriate dashboard based on their assigned role, maintaining security and providing a clear separation between user and administrative functions.
