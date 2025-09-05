"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Database } from 'lucide-react';

export function DatabaseHealth() {
  const [health, setHealth] = useState<{
    profiles: 'checking' | 'ok' | 'error';
    jobs: 'checking' | 'ok' | 'error';
    auth: 'checking' | 'ok' | 'error';
  }>({
    profiles: 'checking',
    jobs: 'checking',
    auth: 'checking'
  });

  const [details, setDetails] = useState<{
    profiles: string;
    jobs: string;
    auth: string;
  }>({
    profiles: '',
    jobs: '',
    auth: ''
  });

  const checkHealth = async () => {
    const supabase = createClient();
    
    // Check profiles table
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (error) {
        setHealth(prev => ({ ...prev, profiles: 'error' }));
        setDetails(prev => ({ ...prev, profiles: error.message }));
      } else {
        setHealth(prev => ({ ...prev, profiles: 'ok' }));
        setDetails(prev => ({ ...prev, profiles: 'Table accessible' }));
      }
    } catch (err) {
      setHealth(prev => ({ ...prev, profiles: 'error' }));
      setDetails(prev => ({ ...prev, profiles: 'Connection failed' }));
    }

    // Check jobs table
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('id')
        .limit(1);
      
      if (error) {
        setHealth(prev => ({ ...prev, jobs: 'error' }));
        setDetails(prev => ({ ...prev, jobs: error.message }));
      } else {
        setHealth(prev => ({ ...prev, jobs: 'ok' }));
        setDetails(prev => ({ ...prev, jobs: 'Table accessible' }));
      }
    } catch (err) {
      setHealth(prev => ({ ...prev, jobs: 'error' }));
      setDetails(prev => ({ ...prev, jobs: 'Connection failed' }));
    }

    // Check auth
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setHealth(prev => ({ ...prev, auth: 'ok' }));
      setDetails(prev => ({ ...prev, auth: session ? 'User authenticated' : 'No active session' }));
    } catch (err) {
      setHealth(prev => ({ ...prev, auth: 'error' }));
      setDetails(prev => ({ ...prev, auth: 'Auth service unavailable' }));
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok':
        return <Badge variant="default" className="bg-green-500">OK</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Checking</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Health Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(health.profiles)}
              <span className="text-sm font-medium">Profiles Table</span>
            </div>
            {getStatusBadge(health.profiles)}
          </div>
          <p className="text-xs text-muted-foreground ml-6">{details.profiles}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(health.jobs)}
              <span className="text-sm font-medium">Jobs Table</span>
            </div>
            {getStatusBadge(health.jobs)}
          </div>
          <p className="text-xs text-muted-foreground ml-6">{details.jobs}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(health.auth)}
              <span className="text-sm font-medium">Authentication</span>
            </div>
            {getStatusBadge(health.auth)}
          </div>
          <p className="text-xs text-muted-foreground ml-6">{details.auth}</p>
        </div>

        <Button onClick={checkHealth} variant="outline" size="sm" className="w-full">
          Refresh Check
        </Button>
      </CardContent>
    </Card>
  );
}
