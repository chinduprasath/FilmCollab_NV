"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Database, Loader2 } from 'lucide-react';
import { useSupabase } from '@/components/providers/supabase-provider';

export function DatabaseStatus() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabase();

  const checkDatabase = async () => {
    setLoading(true);
    try {
      // Check if profiles table exists
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

             if (error) {
         if (error.code === '42P01') {
           setStatus({
             exists: false,
             accessible: false,
             error: 'Table does not exist',
             code: error.code,
             message: 'Profiles table is missing'
           });
         } else if (error.code === '42501') {
           setStatus({
             exists: true,
             accessible: false,
             error: 'Access denied by RLS',
             code: error.code,
             message: 'Table exists but access is blocked'
           });
         } else if (error.code === '42710') {
           setStatus({
             exists: true,
             accessible: true,
             error: 'Policy conflict (table accessible)',
             code: error.code,
             message: 'Table exists and working (policy conflict resolved)'
           });
         } else {
           setStatus({
             exists: true,
             accessible: false,
             error: error.message,
             code: error.code,
             message: 'Unknown error'
           });
         }
       } else {
        setStatus({
          exists: true,
          accessible: true,
          error: null,
          code: null,
          message: 'Database is working correctly'
        });
      }
    } catch (err: any) {
      setStatus({
        exists: false,
        accessible: false,
        error: err.message,
        code: 'UNKNOWN',
        message: 'Failed to check database'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!status) return <Database className="h-5 w-5" />;
    if (status.exists && status.accessible) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status.exists && !status.accessible) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (!status) return <Badge variant="secondary">Not Checked</Badge>;
    if (status.exists && status.accessible) return <Badge variant="default" className="bg-green-500">Working</Badge>;
    if (status.exists && !status.accessible) return <Badge variant="secondary" className="bg-yellow-500">Partial</Badge>;
    return <Badge variant="destructive">Broken</Badge>;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Database Status
        </CardTitle>
        <CardDescription>
          Check if your Supabase database is properly configured
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          {getStatusBadge()}
        </div>

        {status && (
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Message:</span> {status.message}
            </div>
            {status.error && (
              <div>
                <span className="font-medium">Error:</span> {status.error}
              </div>
            )}
            {status.code && (
              <div>
                <span className="font-medium">Code:</span> {status.code}
              </div>
            )}
          </div>
        )}

        <Button 
          onClick={checkDatabase} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Database Status'
          )}
        </Button>

        {status && !status.exists && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Fix Required:</strong> Run the SQL setup script in your Supabase dashboard.
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Use: <code>SUPABASE_SETUP_MINIMAL.sql</code>
            </p>
          </div>
        )}

        {status && status.code === '42710' && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              <strong>Policy Conflict Detected:</strong> Table exists but has duplicate policies.
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              <strong>Fix:</strong> Run <code>FIX_POLICY_CONFLICTS.sql</code> in your Supabase dashboard.
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              This will resolve the duplicate policy errors and allow normal operation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
