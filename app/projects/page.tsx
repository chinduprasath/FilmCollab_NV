"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout";
import { 
  Search, Filter, MapPin, Calendar, Clock, Users, Heart, Share2, Plus, Eye, UserPlus, 
  ExternalLink, ChevronDown, ChevronUp, X, Film, Video, Music, Camera, Mic, Palette, 
  Scissors, Building2, Star, TrendingUp, CheckCircle, Play, Pause, Award, Target, Zap, Bookmark, Edit
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  industry: string;
  type: string;
  status: "Ongoing" | "Completed" | "Planning" | "Post-Production";
  location: string;
  createdDate: string;
  description: string;
  tagline: string;
  teamMembers: { id: number; name: string; role: string; avatar: string; }[];
  rolesRequired: { role: string; description: string; isOpen: boolean; }[];
  budget: string;
  duration: string;
  genre: string;
  featured: boolean;
  popular: boolean;
}

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [savedProjects, setSavedProjects] = useState<number[]>([]);
  const [joinedProjects, setJoinedProjects] = useState<number[]>([1]); // Sample joined project
  const [createdProjects, setCreatedProjects] = useState<number[]>([2]); // Sample created project
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const allProjects: Project[] = [
    {
      id: 1,
      title: "The Silent Echo",
      industry: "Film",
      type: "Feature Film",
      status: "Ongoing",
      location: "Los Angeles, CA",
      createdDate: "2024-12-10",
      description: "A psychological thriller about a detective who discovers that the victims of a serial killer are all connected to a mysterious radio frequency that only he can hear.",
      tagline: "Some voices should never be heard",
      teamMembers: [
        { id: 1, name: "Sarah Johnson", role: "Director", avatar: "SJ" },
        { id: 2, name: "Michael Chen", role: "Cinematographer", avatar: "MC" }
      ],
      rolesRequired: [
        { role: "Lead Actor", description: "Male, 35-45, intense dramatic presence", isOpen: true },
        { role: "Sound Designer", description: "Experience with psychological thrillers", isOpen: true }
      ],
      budget: "₹2.5Cr - ₹3.5Cr",
      duration: "120 minutes",
      genre: "Thriller",
      featured: true,
      popular: true
    },
    {
      id: 2,
      title: "Urban Dreams",
      industry: "Television",
      type: "Web Series",
      status: "Planning",
      location: "New York, NY",
      createdDate: "2024-12-08",
      description: "A coming-of-age story following four friends navigating life, love, and career aspirations in the bustling city of New York.",
      tagline: "Dreams don't sleep in the city that never sleeps",
      teamMembers: [
        { id: 4, name: "David Kim", role: "Showrunner", avatar: "DK" }
      ],
      rolesRequired: [
        { role: "Casting Director", description: "Experience with young adult casting", isOpen: true }
      ],
      budget: "₹1.8Cr - ₹2.5Cr",
      duration: "8 episodes",
      genre: "Drama",
      featured: false,
      popular: true
    }
  ];

  const industries = ["all", "Film", "Television", "Music", "Documentary", "Animation", "Theater"];
  const projectTypes = ["all", "Feature Film", "Short Film", "Web Series", "Music Video", "Documentary"];
  const statuses = ["all", "Planning", "Ongoing", "Post-Production", "Completed"];
  const locations = ["all", "Los Angeles, CA", "New York, NY", "Miami, FL", "San Francisco, CA"];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "featured", label: "Featured" }
  ];

  const getProjectsByTab = () => {
    switch (activeTab) {
      case "joined":
        return allProjects.filter(project => joinedProjects.includes(project.id));
      case "created":
        return allProjects.filter(project => createdProjects.includes(project.id));
      default:
        return allProjects;
    }
  };

  const filteredProjects = getProjectsByTab().filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === "all" || project.industry === selectedIndustry;
    const matchesType = selectedType === "all" || project.type === selectedType;
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
    const matchesLocation = selectedLocation === "all" || project.location === selectedLocation;
    
    return matchesSearch && matchesIndustry && matchesType && matchesStatus && matchesLocation;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest": return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      case "oldest": return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      case "popular": return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      case "featured": return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      default: return 0;
    }
  });

  const toggleSavedProject = (projectId: number) => {
    setSavedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const getDaysAgo = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing": return "bg-blue-500";
      case "Completed": return "bg-green-500";
      case "Planning": return "bg-yellow-500";
      case "Post-Production": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const clearFilters = () => {
    setSelectedIndustry("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedLocation("all");
    setSortBy("newest");
  };

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Discover and collaborate on film and entertainment projects
            </p>
          </div>
                     <div className="flex gap-3">
             <Button variant="outline" onClick={() => setShowCreateProject(true)}>
               <Plus className="w-4 h-4 mr-2" />
               Create Project
             </Button>
           </div>
        </div>

        {/* Search and Filter Row */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects, titles, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-border rounded-md text-sm bg-background"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "all"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            All Projects ({allProjects.length})
          </button>
          <button
            onClick={() => setActiveTab("joined")}
            className={`px-6 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "joined"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Joined ({joinedProjects.length})
          </button>
          <button
            onClick={() => setActiveTab("created")}
            className={`px-6 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "created"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Created ({createdProjects.length})
          </button>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {getProjectsByTab().length} projects
          </p>
        </div>

        <div className="flex gap-6">
          {/* Projects Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className={`hover:shadow-lg transition-shadow ${project.featured ? 'ring-2 ring-primary/20' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg hover:text-primary cursor-pointer line-clamp-1">
                            {project.title}
                          </CardTitle>
                          {project.featured && (
                            <Badge variant="default" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {project.popular && (
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Film className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{project.industry}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{project.type}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{project.location}</span>
                          </div>
                        </div>

                        <CardDescription className="text-sm line-clamp-2">
                          {project.tagline}
                        </CardDescription>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSavedProject(project.id)}
                          className={`h-8 w-8 p-0 ${savedProjects.includes(project.id) ? 'text-red-500' : ''}`}
                        >
                          <Heart className={`w-4 h-4 ${savedProjects.includes(project.id) ? 'fill-current' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.teamMembers.length} team members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getDaysAgo(project.createdDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Budget: {project.budget}</span>
                        <span className="text-muted-foreground">{project.duration}</span>
                      </div>

                                              <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1" onClick={() => openProjectDetails(project)}>
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          {activeTab === "all" && !joinedProjects.includes(project.id) && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setJoinedProjects(prev => [...prev, project.id])}
                            >
                              <UserPlus className="w-3 h-3" />
                            </Button>
                          )}
                          {activeTab === "joined" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setJoinedProjects(prev => prev.filter(id => id !== project.id))}
                            >
                              Leave Project
                            </Button>
                          )}
                          {activeTab === "created" && (
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">
                  Start by creating or joining one
                </p>
                <Button size="sm" onClick={() => {
                  setSearchQuery("");
                  clearFilters();
                }}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Right Side Filter Panel */}
          {showFilters && (
            <div className="w-80 border-l border-border p-6 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                  >
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry === "all" ? "All Industries" : industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                  >
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status === "all" ? "All Statuses" : status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
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
          )}
        </div>
      </div>

      {/* Project Details Popup */}
      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowProjectDetails(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedProject.industry}</Badge>
                      <Badge variant="outline">{selectedProject.type}</Badge>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedProject.status)}`}></div>
                      <Badge variant="outline">{selectedProject.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedProject.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Budget: {selectedProject.budget}</span>
                      <span>Duration: {selectedProject.duration}</span>
                      <span>Genre: {selectedProject.genre}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Tagline</h3>
                  <p className="text-lg italic text-muted-foreground">"{selectedProject.tagline}"</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedProject.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Team Members</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProject.teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Roles Required</h3>
                  <div className="space-y-3">
                    {selectedProject.rolesRequired.map((role, index) => (
                      <div key={index} className={`p-4 border rounded-lg ${role.isOpen ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-950/20'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{role.role}</h4>
                          <Badge variant={role.isOpen ? "default" : "secondary"}>
                            {role.isOpen ? "Open" : "Filled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                        {role.isOpen && (
                          <Button size="sm" className="mt-2">
                            <UserPlus className="w-3 h-3 mr-1" />
                            Apply for Role
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Project
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Popup */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Create New Project</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateProject(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Title *</label>
                    <Input placeholder="e.g., The Silent Echo" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industry *</label>
                    <select className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background">
                      <option>Select Industry</option>
                      {industries.slice(1).map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Type *</label>
                    <select className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background">
                      <option>Select Project Type</option>
                      {projectTypes.slice(1).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status *</label>
                    <select className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background">
                      <option>Select Status</option>
                      {statuses.slice(1).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location *</label>
                    <Input placeholder="e.g., Los Angeles, CA" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget Range</label>
                    <Input placeholder="e.g., ₹2.5Cr - ₹3.5Cr" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tagline *</label>
                  <Input placeholder="A compelling one-line description" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Description *</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background min-h-[100px]"
                    placeholder="Describe your project, its vision, and what you're looking for..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateProject(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
