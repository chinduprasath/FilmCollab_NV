"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    role?: string;
  };
  created_at: string;
};

type TempAuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
};

const TempAuthContext = createContext<TempAuthContextType | undefined>(undefined);

export function TempAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('tempUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      user_metadata: userData,
      created_at: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('tempUser', JSON.stringify(newUser));
    
    return { user: newUser };
  };

  const signIn = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem('tempUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.email === email) {
        setUser(userData);
        return { user: userData };
      }
    }
    
    // Create a new user if none exists
    const newUser: User = {
      id: Date.now().toString(),
      email,
      user_metadata: {
        first_name: email.split('@')[0],
        full_name: email.split('@')[0],
        role: 'ACTOR',
      },
      created_at: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('tempUser', JSON.stringify(newUser));
    
    return { user: newUser };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('tempUser');
  };

  const resetPassword = async (email: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { message: 'Password reset email sent (demo mode)' };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <TempAuthContext.Provider value={value}>
      {children}
    </TempAuthContext.Provider>
  );
}

export function useTempAuth() {
  const context = useContext(TempAuthContext);
  if (context === undefined) {
    throw new Error('useTempAuth must be used within a TempAuthProvider');
  }
  return context;
}
