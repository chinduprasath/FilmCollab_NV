"use client";

import { useEffect, useState } from 'react';
import { useSupabase } from '@/components/providers/supabase-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Shield, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AuthDebug() {
  const { user, userRole, loading, signOut } = useSupabase();
  const [currentPath, setCurrentPath] = useState('');
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out successfully');
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
      <CardHeader>
        <CardTitle className="text-blue-700 dark:text-blue-300">
          🐛 Auth Debug Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">Current Path:</span>
            <Badge variant="outline">{currentPath}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-medium">Loading:</span>
            <Badge variant={loading ? "destructive" : "default"}>
              {loading ? "Yes" : "No"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-medium">User Authenticated:</span>
            <Badge variant={user ? "default" : "secondary"}>
              {user ? "Yes" : "No"}
            </Badge>
          </div>
          
          {user && (
            <div className="flex items-center justify-between">
              <span className="font-medium">User Email:</span>
              <Badge variant="outline" className="text-xs">
                {user.email?.substring(0, 15)}...
              </Badge>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="font-medium">User Role:</span>
            <Badge variant={userRole === 'ADMIN' ? "destructive" : userRole === 'USER' ? "default" : "secondary"}>
              {userRole || "None"}
            </Badge>
          </div>
          
          {user && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Should Redirect To:</span>
              <Badge variant="outline">
                {userRole === 'ADMIN' ? '/admin-dashboard' : userRole === 'USER' ? '/dashboard' : 'None'}
              </Badge>
            </div>
          )}
        </div>

        {user && (
          <Button 
            onClick={handleSignOut} 
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out (Clear Session)
          </Button>
        )}

        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-700 dark:text-yellow-300">
          <strong>Note:</strong> If you see unexpected redirects, try signing out to clear any cached sessions.
        </div>
      </CardContent>
    </Card>
  );
}
