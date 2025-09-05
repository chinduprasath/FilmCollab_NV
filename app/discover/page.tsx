"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout";
import { 
  Search,
  Filter,
  UserPlus,
  MessageSquare,
  MoreHorizontal,
  MapPin,
  UserCheck,
  Building2,
  Camera,
  Mic,
  PenTool,
  Scissors,
  Music,
  Palette,
  Users,
  Briefcase,
  Star,
  Heart,
  Share2,
  Bookmark
} from "lucide-react";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const allUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Independent Filmmaker",
      avatar: "SJ",
      location: "Los Angeles, CA",
      skills: ["Directing", "Screenwriting", "Producing"],
      projects: 12,
      connections: 847,
      verified: true,
      online: true,
      rating: 4.8,
      bio: "Passionate independent filmmaker with 8+ years of experience in documentary and narrative filmmaking."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Cinematographer",
      avatar: "MC",
      location: "New York, NY",
      skills: ["Cinematography", "Lighting", "Camera Operation"],
      projects: 28,
      connections: 1234,
      verified: true,
      online: false,
      rating: 4.9,
      bio: "Award-winning cinematographer specializing in commercial and feature film projects."
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Production Designer",
      avatar: "ER",
      location: "Atlanta, GA",
      skills: ["Set Design", "Art Direction", "Props"],
      projects: 19,
      connections: 567,
      verified: true,
      online: true,
      rating: 4.7,
      bio: "Creative production designer with expertise in period dramas and contemporary settings."
    },
    {
      id: 4,
      name: "David Kim",
      role: "Sound Designer",
      avatar: "DK",
      location: "Vancouver, BC",
      skills: ["Sound Design", "Audio Mixing", "Foley"],
      projects: 34,
      connections: 892,
      verified: true,
      online: false,
      rating: 4.6,
      bio: "Experienced sound designer with credits on major studio productions and indie films."
    },
    {
      id: 5,
      name: "Lisa Park",
      role: "Film Editor",
      avatar: "LP",
      location: "Toronto, ON",
      skills: ["Video Editing", "Color Grading", "Post-Production"],
      projects: 22,
      connections: 445,
      verified: true,
      online: true,
      rating: 4.8,
      bio: "Skilled editor with a passion for storytelling through visual narrative."
    },
    {
      id: 6,
      name: "Alex Thompson",
      role: "Screenwriter",
      avatar: "AT",
      location: "Austin, TX",
      skills: ["Screenwriting", "Story Development", "Script Analysis"],
      projects: 15,
      connections: 678,
      verified: true,
      online: false,
      rating: 4.5,
      bio: "Award-winning screenwriter with multiple produced features and TV credits."
    },
    {
      id: 7,
      name: "Maria Garcia",
      role: "Costume Designer",
      avatar: "MG",
      location: "Miami, FL",
      skills: ["Costume Design", "Fashion", "Period Costumes"],
      projects: 31,
      connections: 789,
      verified: true,
      online: true,
      rating: 4.7,
      bio: "Creative costume designer with experience in film, TV, and theater productions."
    },
    {
      id: 8,
      name: "James Wilson",
      role: "Visual Effects Artist",
      avatar: "JW",
      location: "San Francisco, CA",
      skills: ["VFX", "Compositing", "3D Animation"],
      projects: 41,
      connections: 1123,
      verified: true,
      online: false,
      rating: 4.9,
      bio: "Senior VFX artist with expertise in both practical and digital effects."
    }
  ];

  const roles = [
    "all",
    "Director",
    "Cinematographer", 
    "Producer",
    "Writer",
    "Editor",
    "Sound Designer",
    "Production Designer",
    "Costume Designer",
    "VFX Artist"
  ];

  const locations = [
    "all",
    "Los Angeles, CA",
    "New York, NY", 
    "Atlanta, GA",
    "Vancouver, BC",
    "Toronto, ON",
    "Austin, TX",
    "Miami, FL",
    "San Francisco, CA"
  ];

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesLocation = selectedLocation === "all" || user.location === selectedLocation;
    
    return matchesSearch && matchesRole && matchesLocation;
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Discover People</h1>
            <p className="text-muted-foreground">
              Find and connect with film professionals from around the world
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, role, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-1 border border-border rounded-md text-sm bg-background"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === "all" ? "All Roles" : role}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Location:</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-1 border border-border rounded-md text-sm bg-background"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {allUsers.length} professionals
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Save Search
            </Button>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.avatar}
                      </div>
                      {user.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        {user.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{user.location}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {user.bio}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {user.skills.slice(0, 2).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {user.skills.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{user.skills.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{user.rating}</span>
                  </div>
                  <span>{user.projects} projects</span>
                  <span>{user.connections} connections</span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Connect
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {filteredUsers.length > 0 && (
          <div className="text-center">
            <Button variant="outline">
              Load More Professionals
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No professionals found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedRole("all");
              setSelectedLocation("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
