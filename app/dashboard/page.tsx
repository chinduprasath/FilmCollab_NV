"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Briefcase, TrendingUp, LogOut } from "lucide-react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { AppLayout } from "@/components/layout";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useSupabase();

  useEffect(() => {
    // Only redirect if we're sure there's no user and not loading
    if (!loading && !user) {
      console.log('Dashboard: No user found, redirecting to signin');
      // Add a small delay to prevent immediate redirect
      setTimeout(() => {
        router.push("/auth/signin");
      }, 100);
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  const userData = user.user_metadata || {};
  const fullName = userData.full_name || userData.first_name || user.email?.split('@')[0] || 'User';

  return (
    <AppLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {fullName}! 👋
            </h2>
            <p className="text-muted-foreground">
              Here's what's happening in your professional network today.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-lg backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connections</p>
                <p className="text-2xl font-bold text-foreground">24</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Job Applications</p>
                <p className="text-2xl font-bold text-foreground">7</p>
              </div>
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold text-foreground">156</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-lg backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts for your workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button className="w-full" variant="outline">
                Browse Jobs
              </Button>
              <Button className="w-full" variant="outline">
                Find Events
              </Button>
              <Button className="w-full" variant="outline">
                Update Profile
              </Button>
              <Button className="w-full" variant="outline">
                Network
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Your latest interactions and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Profile viewed by Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Applied to "Lead Actor" position</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Connected with Mike Chen</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Info */}
      <Card className="shadow-lg backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Manage your professional information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Basic Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {fullName}</p>
                <p><span className="text-muted-foreground">Email:</span> {user.email}</p>
                <p><span className="text-muted-foreground">Role:</span> {userData.role || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Account Status</h4>
              <div className="space-y-2">
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Active
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Quick Links</h4>
              <div className="space-y-2">
                <Button variant="link" className="p-0 h-auto text-sm">
                  Edit Profile
                </Button>
                <br />
                <Button variant="link" className="p-0 h-auto text-sm">
                  Privacy Settings
                </Button>
                <br />
                <Button variant="link" className="p-0 h-auto text-sm">
                  Notification Preferences
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
