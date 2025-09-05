"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export function AuthTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testAuth = async () => {
    setTesting(true);
    setResults(null);
    
    try {
      const supabase = createClient();
      
      // Test 1: Check current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Test 2: Check profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      // Test 3: Check jobs table
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .limit(1);
      
      const testResults = {
        session: {
          exists: !!session,
          user: session?.user?.email || 'No user',
          error: sessionError?.message || 'No error'
        },
        profiles: {
          accessible: !profilesError,
          count: profiles?.length || 0,
          error: profilesError?.message || 'No error'
        },
        jobs: {
          accessible: !jobsError,
          count: jobs?.length || 0,
          error: jobsError?.message || 'No error'
        }
      };
      
      setResults(testResults);
      toast.success('Auth test completed');
    } catch (error) {
      console.error('Auth test error:', error);
      toast.error('Auth test failed');
      setResults({ error: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testAuth} 
          disabled={testing}
          className="w-full"
        >
          {testing ? 'Testing...' : 'Run Auth Test'}
        </Button>
        
        {results && (
          <div className="space-y-2 text-sm">
            <div className="font-medium">Test Results:</div>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
