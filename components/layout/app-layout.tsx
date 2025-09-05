"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, User, Settings, CreditCard } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, loading, userRole } = useSupabase();
  const router = useRouter();

  // Store sidebar state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserDropdown) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleToggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  // For pages that don't need sidebar (like landing page and auth pages), just render children immediately
  if (!showSidebar) {
    console.log('🏠 AppLayout: No sidebar needed, rendering children directly');
    return <>{children}</>;
  }

  // Show loading state while checking authentication (only for pages with sidebar)
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

  // If no user and showSidebar is true, redirect to user signin
  if (!user && showSidebar) {
    console.log('🚪 AppLayout: No user found, redirecting to /auth/signin');
    router.push("/auth/signin");
    return null;
  }

  // Role-based redirection
  if (user && userRole && showSidebar) {
    const currentPath = window.location.pathname;
    console.log(`🎭 AppLayout: Role-based check - User: ${user.email}, Role: ${userRole}, Path: ${currentPath}`);
    
    if (userRole === 'ADMIN' && currentPath === '/dashboard') {
      console.log('🔄 AppLayout: Admin user on user dashboard, redirecting to /admin-dashboard');
      router.push("/admin-dashboard");
      return null;
    } else if (userRole === 'USER' && currentPath === '/admin-dashboard') {
      console.log('🔄 AppLayout: User on admin dashboard, redirecting to /dashboard');
      router.push("/dashboard");
      return null;
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggle={handleToggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">
              FilmCollab
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 relative"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Menu */}
            {user && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 h-8 px-2"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {user.user_metadata?.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {user.user_metadata?.first_name || user.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>

                {/* User Dropdown */}
                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start px-3 py-2 h-auto"
                        onClick={() => {
                          router.push("/profile");
                          setShowUserDropdown(false);
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start px-3 py-2 h-auto"
                        onClick={() => {
                          router.push("/settings");
                          setShowUserDropdown(false);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start px-3 py-2 h-auto"
                        onClick={() => {
                          router.push("/billing");
                          setShowUserDropdown(false);
                        }}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Billing
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
