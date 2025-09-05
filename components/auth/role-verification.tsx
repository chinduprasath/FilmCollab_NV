"use client";

import { useSupabase } from "@/components/providers/supabase-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, User, AlertCircle } from "lucide-react";

export function RoleVerification() {
  const { user, userRole, loading } = useSupabase();

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Verifying role...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Not Authenticated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please sign in to continue.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {userRole === 'ADMIN' ? (
            <Shield className="h-5 w-5 text-red-500" />
          ) : (
            <User className="h-5 w-5 text-blue-500" />
          )}
          Role Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">User ID:</span>
          <span className="text-sm text-muted-foreground font-mono">
            {user.id.substring(0, 8)}...
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Email:</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Role:</span>
          <Badge variant={userRole === 'ADMIN' ? 'destructive' : 'default'}>
            {userRole || 'Unknown'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Authenticated
          </Badge>
        </div>
        
        {userRole === 'ADMIN' && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Admin Access:</strong> You have administrative privileges and can access the admin dashboard.
            </p>
          </div>
        )}
        
        {userRole === 'USER' && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>User Access:</strong> You have standard user privileges and can access the user dashboard.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
