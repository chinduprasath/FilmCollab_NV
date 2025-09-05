"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  FolderOpen,
  Briefcase,
  Image as ImageIcon,
  Film,
  MessageSquare,
  UserCheck,
  BarChart3,
  Settings,
  Search,
  Download,
  ShieldCheck,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Flag,
  Calendar,
  TrendingUp,
  Activity,
  AlertTriangle,
  Bell,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

type AdminModule =
  | "overview"
  | "analytics"
  | "users"
  | "posts"
  | "projects"
  | "jobs"
  | "directory"
  | "messages"
  | "connections"
  | "reports"
  | "security";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "User" | "Admin";
  status: "Active" | "Suspended";
  joinedAt: string;
}

interface AdminPost {
  id: string;
  username: string;
  content: string;
  type: "Text" | "Image" | "Video";
  date: string;
  status: "Published" | "Pending" | "Flagged";
}

interface AdminProject {
  id: string;
  owner: string;
  title: string;
  description: string;
  date: string;
  status: "Active" | "Pending" | "Rejected";
}

interface AdminJob {
  id: string;
  company: string;
  title: string;
  location: string;
  date: string;
  status: "Active" | "Pending" | "Rejected";
}

const seedUsers: AdminUser[] = [
  { id: "1", username: "sarah", email: "sarah@example.com", role: "Admin", status: "Active", joinedAt: "2024-01-15" },
  { id: "2", username: "michael", email: "michael@example.com", role: "User", status: "Active", joinedAt: "2024-02-04" },
  { id: "3", username: "amelia", email: "amelia@example.com", role: "User", status: "Suspended", joinedAt: "2024-02-18" },
  { id: "4", username: "leo", email: "leo@example.com", role: "User", status: "Active", joinedAt: "2024-03-01" },
];

const seedPosts: AdminPost[] = [
  { id: "1", username: "michael", content: "Just finished an amazing film project!", type: "Text", date: "2024-03-15", status: "Published" },
  { id: "2", username: "leo", content: "Behind the scenes photo", type: "Image", date: "2024-03-14", status: "Pending" },
  { id: "3", username: "amelia", content: "Check out this video", type: "Video", date: "2024-03-13", status: "Flagged" },
];

const seedProjects: AdminProject[] = [
  { id: "1", owner: "michael", title: "Indie Film Production", description: "Looking for crew members", date: "2024-03-10", status: "Active" },
  { id: "2", owner: "leo", title: "Documentary Series", description: "Environmental awareness project", date: "2024-03-08", status: "Pending" },
];

const seedJobs: AdminJob[] = [
  { id: "1", company: "Film Studio A", title: "Cinematographer", location: "Los Angeles", date: "2024-03-12", status: "Active" },
  { id: "2", company: "Production Co", title: "Sound Engineer", location: "New York", date: "2024-03-11", status: "Pending" },
];

export default function AdminDashboardPage() {
  const [activeModule, setActiveModule] = useState<AdminModule>("overview");
  const [timeRange, setTimeRange] = useState<"today" | "7d" | "30d" | "custom">("30d");
  const [contentFilter, setContentFilter] = useState<"all" | "posts" | "projects" | "jobs" | "directory" | "messages" | "connections">("all");
  const [userQuery, setUserQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "User" | "Admin">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Suspended">("All");
  const [users, setUsers] = useState<AdminUser[]>(seedUsers);
  const [posts, setPosts] = useState<AdminPost[]>(seedPosts);
  const [projects, setProjects] = useState<AdminProject[]>(seedProjects);
  const [jobs, setJobs] = useState<AdminJob[]>(seedJobs);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) =>
        [u.username, u.email].some((f) => f.toLowerCase().includes(userQuery.toLowerCase()))
      )
      .filter((u) => (roleFilter === "All" ? true : u.role === roleFilter))
      .filter((u) => (statusFilter === "All" ? true : u.status === statusFilter));
  }, [users, userQuery, roleFilter, statusFilter]);

  const exportUsers = () => {
    const rows = [
      ["Username", "Email", "Role", "Status", "Joined"],
      ...filteredUsers.map((u) => [u.username, u.email, u.role, u.status, u.joinedAt]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    // Navigate to profile page or open profile modal
    console.log("Navigate to profile");
    // You can add toast notification here
    // toast.info("Profile page coming soon!");
  };

  const handleSettings = () => {
    setIsDropdownOpen(false);
    // Navigate to settings page or open settings modal
    console.log("Navigate to settings");
    // You can add toast notification here
    // toast.info("Settings page coming soon!");
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    // Implement logout logic here
    console.log("Logging out...");
    // You can add toast notification here
    // toast.info("Logging out...");
    // Redirect to landing page
    window.location.href = "/";
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const adminNav = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "analytics", label: "Analytics", icon: TrendingUp },
    { key: "users", label: "Users", icon: Users },
    { key: "posts", label: "Posts", icon: FileText },
    { key: "projects", label: "Projects", icon: FolderOpen },
    { key: "jobs", label: "Jobs", icon: Briefcase },
    { key: "directory", label: "Directory", icon: ImageIcon },
    { key: "messages", label: "Messages", icon: MessageSquare },
    { key: "connections", label: "Connections", icon: UserCheck },
    { key: "reports", label: "Reports", icon: Flag },
    { key: "security", label: "Security", icon: ShieldCheck },
  ] as { key: AdminModule; label: string; icon: any }[];

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 h-screen">
        {/* Admin Sidebar */}
        <Card className="rounded-none border-r h-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              Admin Panel
            </CardTitle>
            <CardDescription>Platform management & auditing</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <nav className="space-y-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveModule(item.key)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="flex flex-col h-full">
          {/* Topbar */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    3
                  </Badge>
                </Button>
                
                {/* User Info & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">Admin User</p>
                      <p className="text-xs text-muted-foreground">Administrator</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={toggleDropdown}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={handleProfile}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                        <button
                          onClick={handleSettings}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-accent text-red-600 hover:text-red-700 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Overview Dashboard */}
            {activeModule === "overview" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                  <p className="text-muted-foreground">Platform overview and key metrics</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatCard title="Total Users" value="1,284" icon={Users} trend="+12%" />
                  <StatCard title="Active Users" value="1,102" icon={Activity} trend="+8%" />
                  <StatCard title="Suspended Users" value="23" icon={AlertTriangle} trend="-2%" />
                  <StatCard title="Total Posts" value="8,932" icon={FileText} trend="+15%" />
                  <StatCard title="Active Projects" value="412" icon={FolderOpen} trend="+5%" />
                  <StatCard title="Job Listings" value="96" icon={Briefcase} trend="+3%" />
                  <StatCard title="Flagged Reports" value="17" icon={Flag} trend="+1%" />
                  <StatCard title="Uploads Today" value="245" icon={ImageIcon} trend="+20%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <ActivityItem action="User suspended" user="amelia" time="2 hours ago" />
                        <ActivityItem action="Post flagged" user="leo" time="4 hours ago" />
                        <ActivityItem action="Job approved" user="michael" time="6 hours ago" />
                        <ActivityItem action="New user registered" user="sarah" time="1 day ago" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-20 flex-col gap-2">
                          <Users className="w-5 h-5" />
                          <span className="text-sm">Manage Users</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2">
                          <Flag className="w-5 h-5" />
                          <span className="text-sm">Review Reports</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2">
                          <Settings className="w-5 h-5" />
                          <span className="text-sm">Settings</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2">
                          <ShieldCheck className="w-5 h-5" />
                          <span className="text-sm">Security</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

          {/* Analytics */}
          {activeModule === "analytics" && (
            <AnalyticsManagement />
          )}

          {/* Users Management */}
          {activeModule === "users" && (
            <UsersManagement 
              users={filteredUsers}
              userQuery={userQuery}
              setUserQuery={setUserQuery}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onExport={exportUsers}
              onSuspend={(id) => setUsers(prev => prev.map(u => u.id === id ? {...u, status: "Suspended"} : u))}
              onDelete={(id) => setUsers(prev => prev.filter(u => u.id !== id))}
            />
          )}

          {/* Posts Management */}
          {activeModule === "posts" && (
            <PostsManagement posts={posts} setPosts={setPosts} />
          )}

          {/* Projects Management */}
          {activeModule === "projects" && (
            <ProjectsManagement projects={projects} setProjects={setProjects} />
          )}

          {/* Jobs Management */}
          {activeModule === "jobs" && (
            <JobsManagement jobs={jobs} setJobs={setJobs} />
          )}

          {/* Directory Management */}
          {activeModule === "directory" && (
            <DirectoryManagement />
          )}

          {/* Messages Management */}
          {activeModule === "messages" && (
            <MessagesManagement />
          )}

          {/* Connections Management */}
          {activeModule === "connections" && (
            <ConnectionsManagement />
          )}

          {/* Reports Management */}
          {activeModule === "reports" && (
            <ReportsManagement />
          )}

          {/* Security & Auditing */}
          {activeModule === "security" && (
            <SecurityManagement />
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component functions will be defined in the next part...

// Analytics Management Component
function AnalyticsManagement() {
  // Mock numbers and series
  const metrics = [
    { title: "Total Users", value: "1,284", icon: Users },
    { title: "Daily Active Users", value: "1,102", icon: Activity },
    { title: "Monthly Active Users", value: "5,612", icon: Activity },
    { title: "Total Posts", value: "8,932", icon: FileText },
    { title: "Total Projects", value: "412", icon: FolderOpen },
    { title: "Total Jobs", value: "96", icon: Briefcase },
    { title: "Messages Sent", value: "124,508", icon: MessageSquare },
    { title: "Connections Made", value: "3,487", icon: UserCheck },
  ];

  const signups = [4, 6, 8, 6, 9, 12, 10, 14, 18, 16, 20, 24];
  const dau = [150, 180, 200, 220, 210, 240, 260];
  const mau = [1200, 1300, 1450, 1600, 1700, 1800, 1900];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Usage metrics and activity trends</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="border bg-background rounded-md px-3 py-2 text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Today</option>
            <option>Custom range</option>
          </select>
          <select className="border bg-background rounded-md px-3 py-2 text-sm">
            <option>All</option>
            <option>Posts</option>
            <option>Projects</option>
            <option>Jobs</option>
            <option>Directory</option>
            <option>Messages</option>
            <option>Connections</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{m.title}</CardDescription>
                <m.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">{m.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User sign-ups over time</CardTitle>
            <CardDescription>Line graph</CardDescription>
          </CardHeader>
          <CardContent>
            <MiniLineChart series={signups} height={160} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DAU vs MAU</CardTitle>
            <CardDescription>Bar chart</CardDescription>
          </CardHeader>
          <CardContent>
            <MiniBarChart seriesA={dau} seriesB={mau} height={160} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Page-specific analytics</CardTitle>
            <CardDescription>Content activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>Posts: 8,932 total · 312 trending · 41 flagged</li>
              <li>Projects: 412 active · 98 completed</li>
              <li>Jobs: 96 created · 1,245 applications</li>
              <li>Directory: 24,501 uploads (images, videos, docs, audio)</li>
              <li>Messages: 124,508 exchanged last 30 days</li>
              <li>Connections: 1,104 sent · 832 accepted · 92 declined</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent reports</CardTitle>
            <CardDescription>Latest reported content/users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3">ID</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">#REP-204</td>
                    <td className="px-4 py-3">User (abuse)</td>
                    <td className="px-4 py-3"><Badge variant="outline">Pending</Badge></td>
                    <td className="px-4 py-3">2024-03-16</td>
                  </tr>
                  <tr className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">#REP-203</td>
                    <td className="px-4 py-3">Post (spam)</td>
                    <td className="px-4 py-3"><Badge variant="secondary">Reviewed</Badge></td>
                    <td className="px-4 py-3">2024-03-15</td>
                  </tr>
                  <tr className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">#REP-202</td>
                    <td className="px-4 py-3">Message (harassment)</td>
                    <td className="px-4 py-3"><Badge variant="destructive">Action Taken</Badge></td>
                    <td className="px-4 py-3">2024-03-15</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Minimal charts using inline SVG for portability
function MiniLineChart({ series, height = 160 }: { series: number[]; height?: number }) {
  const width = 400;
  const max = Math.max(...series);
  const stepX = width / (series.length - 1);
  const points = series
    .map((v, i) => `${i * stepX},${height - (v / max) * (height - 10) - 5}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
      <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="2" points={points} />
    </svg>
  );
}

function MiniBarChart({ seriesA, seriesB, height = 160 }: { seriesA: number[]; seriesB: number[]; height?: number }) {
  const width = 400;
  const max = Math.max(...seriesA, ...seriesB);
  const barWidth = width / (seriesA.length * 2);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
      {seriesA.map((v, i) => {
        const h = (v / max) * (height - 10);
        const x = i * (barWidth * 2) + 10;
        return <rect key={`a-${i}`} x={x} y={height - h - 5} width={barWidth - 6} height={h} fill="hsl(var(--primary))" opacity={0.6} />;
      })}
      {seriesB.map((v, i) => {
        const h = (v / max) * (height - 10);
        const x = i * (barWidth * 2) + barWidth + 10;
        return <rect key={`b-${i}`} x={x} y={height - h - 5} width={barWidth - 6} height={h} fill="currentColor" className="text-muted-foreground" />;
      })}
    </svg>
  );
}
// Stat Card Component
function StatCard({ title, value, icon: Icon, trend }: { title: string; value: string; icon: any; trend: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <CardTitle className="text-2xl">{value}</CardTitle>
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp className="w-3 h-3 text-green-500" />
          <span className="text-green-500">{trend}</span>
        </div>
      </CardHeader>
    </Card>
  );
}

// Activity Item Component
function ActivityItem({ action, user, time }: { action: string; user: string; time: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-sm">{action} by <span className="font-medium">{user}</span></span>
      </div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
}

// Users Management Component
function UsersManagement({ 
  users, 
  userQuery, 
  setUserQuery, 
  roleFilter, 
  setRoleFilter, 
  statusFilter, 
  setStatusFilter, 
  onExport, 
  onSuspend, 
  onDelete 
}: {
  users: AdminUser[];
  userQuery: string;
  setUserQuery: (query: string) => void;
  roleFilter: "All" | "User" | "Admin";
  setRoleFilter: (filter: "All" | "User" | "Admin") => void;
  statusFilter: "All" | "Active" | "Suspended";
  setStatusFilter: (filter: "All" | "Active" | "Suspended") => void;
  onExport: () => void;
  onSuspend: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">Manage registered user accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Search, filter, and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search username or email" 
                value={userQuery} 
                onChange={(e) => setUserQuery(e.target.value)} 
                className="pl-10" 
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Role:</label>
              <select 
                className="border bg-background rounded-md px-3 py-2 text-sm" 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value as any)}
              >
                <option>All</option>
                <option>User</option>
                <option>Admin</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Status:</label>
              <select 
                className="border bg-background rounded-md px-3 py-2 text-sm" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option>All</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </div>
            <div className="ml-auto">
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
            </div>
          </div>

          <div className="overflow-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Username</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Joined</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === "Admin" ? "default" : "outline"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.status === "Active" ? "secondary" : "destructive"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{user.joinedAt}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                        {user.status !== "Suspended" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => onSuspend(user.id)}
                          >
                            <XCircle className="w-3 h-3 mr-1" /> Suspend
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => onDelete(user.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No users match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Posts Management Component
function PostsManagement({ posts, setPosts }: { posts: AdminPost[]; setPosts: (posts: AdminPost[]) => void }) {
  const approvePost = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status: "Published" } : p));
  };

  const flagPost = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status: "Flagged" } : p));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Posts Management</h1>
        <p className="text-muted-foreground">Moderate user posts and content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>Review and moderate user-generated content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Post ID</th>
                  <th className="text-left px-4 py-3">Username</th>
                  <th className="text-left px-4 py-3">Content</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">#{post.id}</td>
                    <td className="px-4 py-3 font-medium">{post.username}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{post.content}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{post.type}</Badge>
                    </td>
                    <td className="px-4 py-3">{post.date}</td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant={
                          post.status === "Published" ? "secondary" : 
                          post.status === "Pending" ? "outline" : "destructive"
                        }
                      >
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                        {post.status === "Pending" && (
                          <Button size="sm" variant="outline" onClick={() => approvePost(post.id)}>
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                          </Button>
                        )}
                        {post.status !== "Flagged" && (
                          <Button size="sm" variant="outline" onClick={() => flagPost(post.id)}>
                            <Flag className="w-3 h-3 mr-1" /> Flag
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => deletePost(post.id)}>
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Projects Management Component
function ProjectsManagement({ projects, setProjects }: { projects: AdminProject[]; setProjects: (projects: AdminProject[]) => void }) {
  const approveProject = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: "Active" } : p));
  };

  const rejectProject = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: "Rejected" } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <p className="text-muted-foreground">Approve or reject project listings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Review submitted project listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Project ID</th>
                  <th className="text-left px-4 py-3">Owner</th>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Description</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">#{project.id}</td>
                    <td className="px-4 py-3 font-medium">{project.owner}</td>
                    <td className="px-4 py-3 font-medium">{project.title}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{project.description}</td>
                    <td className="px-4 py-3">{project.date}</td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant={
                          project.status === "Active" ? "secondary" : 
                          project.status === "Pending" ? "outline" : "destructive"
                        }
                      >
                        {project.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                        {project.status === "Pending" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => approveProject(project.id)}>
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => rejectProject(project.id)}>
                              <XCircle className="w-3 h-3 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => deleteProject(project.id)}>
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Jobs Management Component
function JobsManagement({ jobs, setJobs }: { jobs: AdminJob[]; setJobs: (jobs: AdminJob[]) => void }) {
  const approveJob = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: "Active" } : j));
  };

  const rejectJob = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: "Rejected" } : j));
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Jobs Management</h1>
        <p className="text-muted-foreground">Approve or reject job listings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
          <CardDescription>Review submitted job listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Job ID</th>
                  <th className="text-left px-4 py-3">Company</th>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Location</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">#{job.id}</td>
                    <td className="px-4 py-3 font-medium">{job.company}</td>
                    <td className="px-4 py-3 font-medium">{job.title}</td>
                    <td className="px-4 py-3">{job.location}</td>
                    <td className="px-4 py-3">{job.date}</td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant={
                          job.status === "Active" ? "secondary" : 
                          job.status === "Pending" ? "outline" : "destructive"
                        }
                      >
                        {job.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                        {job.status === "Pending" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => approveJob(job.id)}>
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => rejectJob(job.id)}>
                              <XCircle className="w-3 h-3 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => deleteJob(job.id)}>
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Directory Management Component
function DirectoryManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Directory Management</h1>
        <p className="text-muted-foreground">Manage uploaded media and content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Content</CardTitle>
          <CardDescription>Review and manage user uploads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Owner</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Size</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">#1</td>
                  <td className="px-4 py-3 font-medium">michael</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">Image</Badge>
                  </td>
                  <td className="px-4 py-3">2.4 MB</td>
                  <td className="px-4 py-3">2024-03-15</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">#2</td>
                  <td className="px-4 py-3 font-medium">leo</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">Video</Badge>
                  </td>
                  <td className="px-4 py-3">15.7 MB</td>
                  <td className="px-4 py-3">2024-03-14</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Messages Management Component
function MessagesManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages Management</h1>
        <p className="text-muted-foreground">Monitor reported conversations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reported Conversations</CardTitle>
          <CardDescription>Review flagged messages and conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Conversation ID</th>
                  <th className="text-left px-4 py-3">Participants</th>
                  <th className="text-left px-4 py-3">Reports</th>
                  <th className="text-left px-4 py-3">Last Activity</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">#CONV-001</td>
                  <td className="px-4 py-3">michael, leo</td>
                  <td className="px-4 py-3">
                    <Badge variant="destructive">3 reports</Badge>
                  </td>
                  <td className="px-4 py-3">2 hours ago</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Connections Management Component
function ConnectionsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Connections Management</h1>
        <p className="text-muted-foreground">Review flagged connection requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Flagged Requests</CardTitle>
          <CardDescription>Review flagged pending connection requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Request ID</th>
                  <th className="text-left px-4 py-3">From</th>
                  <th className="text-left px-4 py-3">To</th>
                  <th className="text-left px-4 py-3">Reason</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">#REQ-001</td>
                  <td className="px-4 py-3 font-medium">michael</td>
                  <td className="px-4 py-3 font-medium">leo</td>
                  <td className="px-4 py-3">Spam</td>
                  <td className="px-4 py-3">2024-03-15</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" /> Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reports Management Component
function ReportsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports Management</h1>
        <p className="text-muted-foreground">Review flagged items that need attention</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Flagged Reports</CardTitle>
          <CardDescription>Review and take action on reported content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Report ID</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Target</th>
                  <th className="text-left px-4 py-3">Reporter</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">#REP-001</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">Post</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">Post #3</td>
                  <td className="px-4 py-3">leo</td>
                  <td className="px-4 py-3">2024-03-15</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Resolve
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Settings Management Component
function SettingsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage site-wide configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Configuration</CardTitle>
            <CardDescription>General platform settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Theme</label>
              <select className="w-full border rounded-md px-3 py-2 bg-background text-foreground text-sm">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default User Role</label>
              <select className="w-full border rounded-md px-3 py-2 bg-background text-foreground text-sm">
                <option>User</option>
                <option>Admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Permissions Template</label>
              <select className="w-full border rounded-md px-3 py-2 bg-background text-foreground text-sm">
                <option>Standard</option>
                <option>Moderators</option>
                <option>Restricted</option>
              </select>
            </div>
            <Button>Save Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Management</CardTitle>
            <CardDescription>Manage admin roles and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add New Admin</label>
              <div className="flex gap-2">
                <Input placeholder="Username or email" />
                <Button size="sm">Add</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Permissions</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">User Management</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Content Moderation</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">System Settings</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">Security & Auditing</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Security Management Component
function SecurityManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security & Auditing</h1>
        <p className="text-muted-foreground">Activity logs and login history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Log</CardTitle>
            <CardDescription>Admin and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ActivityItem action="User suspended" user="amelia" time="2 hours ago" />
              <ActivityItem action="Post flagged" user="leo" time="4 hours ago" />
              <ActivityItem action="Job approved" user="michael" time="6 hours ago" />
              <ActivityItem action="New user registered" user="sarah" time="1 day ago" />
              <ActivityItem action="Settings updated" user="admin" time="2 days ago" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Login History</CardTitle>
            <CardDescription>Recent login attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">sarah · 2 hours ago · 192.168.1.5</span>
                </div>
                <Badge variant="secondary">Success</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">michael · 4 hours ago · 192.168.1.7</span>
                </div>
                <Badge variant="secondary">Success</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">unknown · 6 hours ago · 192.168.1.9</span>
                </div>
                <Badge variant="destructive">Failed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Tools</CardTitle>
          <CardDescription>GDPR and compliance tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm">Data Export</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Trash2 className="w-5 h-5" />
              <span className="text-sm">Data Deletion</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Activity className="w-5 h-5" />
              <span className="text-sm">Audit Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
