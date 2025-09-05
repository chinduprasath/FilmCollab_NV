"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Film,
  Home,
  Users,
  Calendar,
  Briefcase,
  FolderOpen,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Search,
  Heart,
  Share2,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
        description: "Overview and analytics",
      },
    ],
  },
  {
    title: "Opportunities",
    items: [
      {
        title: "Jobs",
        href: "/jobs",
        icon: Briefcase,
        description: "Find job opportunities",
      },
      {
        title: "Industry Hub",
        href: "/industry-hub",
        icon: Calendar,
        description: "Industry news, events, and courses",
      },
      {
        title: "Projects",
        href: "/projects",
        icon: FolderOpen,
        description: "Collaborative projects",
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        title: "Posts",
        href: "/posts",
        icon: Share2,
        description: "Share and discover content",
      },
      {
        title: "Directory",
        href: "/directory",
        icon: Users,
        description: "Browse all users",
      },
    ],
  },
  {
    title: "Networking",
    items: [
      {
        title: "Community",
        href: "/community",
        icon: Users,
        description: "Connect with professionals",
      },
      {
        title: "Discover",
        href: "/discover",
        icon: Search,
        description: "Find and connect with users",
      },
      {
        title: "Messages",
        href: "/messages",
        icon: MessageSquare,
        description: "Chat and communications",
      },
      {
        title: "Connections",
        href: "/connections",
        icon: Heart,
        description: "Your network",
      },
    ],
  },
];



export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const ThemeToggle = () => {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme("light")}
          className={cn(
            "h-8 w-8 p-0",
            theme === "light" && "bg-accent text-accent-foreground"
          )}
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme("dark")}
          className={cn(
            "h-8 w-8 p-0",
            theme === "dark" && "bg-accent text-accent-foreground"
          )}
        >
          <Moon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme("system")}
          className={cn(
            "h-8 w-8 p-0",
            theme === "system" && "bg-accent text-accent-foreground"
          )}
        >
          <Monitor className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">FilmCollab</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6 px-3">
          {navigationItems.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate">{item.title}</span>
                      )}
                      
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && hoveredItem === item.href && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg border border-border z-50 whitespace-nowrap">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-xs text-muted-foreground">Theme</span>
          )}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
