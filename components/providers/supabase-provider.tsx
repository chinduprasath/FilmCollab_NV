"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

type UserRole = 'USER' | 'ADMIN';

type SupabaseContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: UserRole | null;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  checkUserRole: (userId: string) => Promise<UserRole | null>;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const supabase = createClient();

  // Function to check if profiles table exists and is accessible
  const checkProfilesTableStatus = async () => {
    try {
      // First, try to check if table exists by attempting a simple query
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (error) {
        if (error.code === '42P01') { // Table doesn't exist
          console.error('❌ PROFILES TABLE MISSING!');
          console.error('Please run the SQL setup script in your Supabase dashboard.');
          console.error('Use: SUPABASE_SETUP_MINIMAL.sql');
          return { exists: false, accessible: false, error: 'Table does not exist' };
        } else if (error.code === '42501') { // Permission denied
          console.error('❌ PROFILES TABLE ACCESS DENIED!');
          console.error('RLS policies are blocking access.');
          return { exists: true, accessible: false, error: 'Access denied by RLS' };
        } else if (error.code === '42710') { // Policy already exists
          console.log('⚠️ POLICY CONFLICT DETECTED - table exists but policy conflict');
          // This means the table exists but there are policy conflicts
          // We'll treat this as accessible since the table exists
          return { exists: true, accessible: true, error: 'Policy conflict (table accessible)' };
        } else {
          console.error('❌ PROFILES TABLE ERROR:', error);
          return { exists: true, accessible: false, error: error.message };
        }
      }
      
      console.log('✅ PROFILES TABLE OK - accessible and working');
      return { exists: true, accessible: true, error: null };
    } catch (error) {
      console.error('❌ ERROR CHECKING PROFILES TABLE:', error);
      return { exists: false, accessible: false, error: 'Unknown error' };
    }
  };

  const checkUserRole = useCallback(async (userId: string): Promise<UserRole | null> => {
    try {
      console.log('Checking user role for:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        
        // Check if table exists
        if (error.code === '42P01') {
          console.log('Profiles table does not exist');
          return null;
        }
        
        // Check if no rows found
        if (error.code === 'PGRST116') {
          console.log('No profile found for user');
          return null;
        }
        
        return null;
      }
      
      console.log('Role found:', data?.role);
      return data?.role as UserRole || null;
    } catch (error) {
      console.error('Error checking user role:', error);
      return null;
    }
  }, [supabase]);

  useEffect(() => {
    // Check database status on initialization
    const checkDatabase = async () => {
      console.log('🔍 Checking database status...');
      const status = await checkProfilesTableStatus();
      
      if (!status.exists) {
        console.error('🚨 CRITICAL: Database not set up properly!');
        console.error('Please run SUPABASE_SETUP_MINIMAL.sql in your Supabase dashboard.');
      } else if (!status.accessible) {
        console.error('🚨 WARNING: Database exists but not accessible!');
        console.error('Check RLS policies and permissions.');
      }
    };

    checkDatabase();

    // Get initial session
    const getSession = async () => {
      console.log('🔍 Getting initial session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📧 Session found:', session ? `User: ${session.user?.email}` : 'No session');
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 User found, checking role...');
        const role = await checkUserRole(session.user.id);
        console.log('🎭 User role:', role);
        setUserRole(role);
      }
      
      setLoading(false);
      console.log('✅ Session check completed');
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session ? `User: ${session.user?.email}` : 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 Auth change: User found, checking role...');
          const role = await checkUserRole(session.user.id);
          console.log('🎭 Auth change: User role:', role);
          setUserRole(role);
        } else {
          console.log('👤 Auth change: No user, clearing role');
          setUserRole(null);
        }
        
        setLoading(false);
        console.log('✅ Auth state change completed');
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth, checkUserRole]);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('Starting signup process...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) throw error;
      
      // Create profile record after successful signup
      if (data.user) {
        console.log('User created successfully, creating profile...', data.user.id);
        
        try {
          // Reduced wait time - just 500ms
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // First, check if profiles table exists
          const { error: tableCheckError } = await supabase
            .from('profiles')
            .select('id')
            .limit(1);
          
          if (tableCheckError && tableCheckError.code === '42P01') {
            console.error('Profiles table does not exist! Please run the SQL setup script.');
            throw new Error('Database setup incomplete. Please contact support.');
          }
          
          // Create profile with minimal data first
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: data.user.id,
              full_name: userData.full_name || 'User',
              role: userData.role || 'USER',
            });
          
          if (profileError) {
            console.error('Profile creation error:', profileError);
            
            // Handle different error types
            if (profileError.code === '42501') {
              console.error('RLS policy is blocking profile creation');
              throw new Error('Profile creation blocked by security policy');
            } else if (profileError.code === '42710') {
              console.error('Policy conflict detected - table exists but policy issue');
              // Try to create profile again after a brief delay
              await new Promise(resolve => setTimeout(resolve, 1000));
              const { error: retryError } = await supabase
                .from('profiles')
                .insert({
                  user_id: data.user.id,
                  full_name: userData.full_name || 'User',
                  role: userData.role || 'USER',
                });
              
              if (retryError) {
                console.error('Profile creation retry failed:', retryError);
                throw new Error(`Profile creation failed after retry: ${retryError.message}`);
              } else {
                console.log('Profile created successfully on retry for user:', data.user.id);
              }
            } else {
              throw new Error(`Profile creation failed: ${profileError.message}`);
            }
          } else {
            console.log('Profile created successfully for user:', data.user.id);
          }
        } catch (profileError) {
          console.error('Profile creation failed:', profileError);
          // Don't fail the entire signup, but log the error
          if (profileError.message.includes('Database setup incomplete')) {
            throw profileError; // Re-throw critical errors
          }
        }
      }
      
      // IMPORTANT: Sign out the user after signup to prevent automatic login
      if (data.user) {
        await supabase.auth.signOut();
      }
      
      console.log('Signup completed successfully');
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check user role after successful sign in
      if (data.user) {
        console.log('User signed in successfully, checking role...', data.user.id);
        
        try {
          const role = await checkUserRole(data.user.id);
          
          if (role) {
            console.log('User role found:', role);
            setUserRole(role);
          } else {
            console.log('No role found, creating default profile...');
            // Create a default profile if none exists
            try {
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  user_id: data.user.id,
                  full_name: data.user.user_metadata?.full_name || 'User',
                  role: 'USER',
                });
              
              if (profileError) {
                console.error('Failed to create default profile:', profileError);
              } else {
                console.log('Default profile created');
                setUserRole('USER');
              }
            } catch (profileErr) {
              console.error('Error creating default profile:', profileErr);
            }
          }
        } catch (roleError) {
          console.error('Error checking user role during signin:', roleError);
          // Set default role to prevent issues
          setUserRole('USER');
        }
      }
      
      return data;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUserRole(null);
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) throw error;
    return data;
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    signUp,
    signIn,
    signOut,
    resetPassword,
    checkUserRole,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
