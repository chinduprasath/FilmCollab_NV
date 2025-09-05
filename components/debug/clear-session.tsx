"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/supabase-provider';
import { toast } from 'react-hot-toast';

export function ClearSession() {
  const { signOut } = useSupabase();
  const router = useRouter();

  const clearAllSessions = async () => {
    try {
      // Sign out from Supabase
      await signOut();
      
      // Clear local storage
      localStorage.clear();
      
      // Clear session storage
      sessionStorage.clear();
      
      // Clear cookies (basic approach)
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      toast.success('All sessions cleared successfully!');
      
      // Force page reload to clear any cached state
      window.location.href = '/';
    } catch (error) {
      console.error('Error clearing sessions:', error);
      toast.error('Error clearing sessions. Please refresh the page manually.');
    }
  };

  const forceReload = () => {
    window.location.reload();
  };

  return (
    <Card className="w-full max-w-md bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
      <CardHeader>
        <CardTitle className="text-red-700 dark:text-red-300">
          🧹 Clear All Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-red-600 dark:text-red-400">
          If you're experiencing unexpected redirects, clear all cached sessions and data.
        </p>
        
        <div className="space-y-2">
          <Button 
            onClick={clearAllSessions} 
            variant="destructive"
            size="sm"
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Sessions & Data
          </Button>
          
          <Button 
            onClick={forceReload} 
            variant="outline"
            size="sm"
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Force Page Reload
          </Button>
        </div>

        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-700 dark:text-yellow-300">
          <strong>Warning:</strong> This will sign you out and clear all cached data.
        </div>
      </CardContent>
    </Card>
  );
}
