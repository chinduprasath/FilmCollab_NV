"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout";
import { JobService, Job as JobType, CreateJobData } from "@/lib/job-service";
import { toast } from "react-hot-toast";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { 
  Search,
  Filter,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Briefcase,
  Heart,
  Share2,
  Star,
  DollarSign,
  Users,
  Globe,
  ArrowUpDown,
  Plus,
  Eye,
  Send,
  Workflow,
  Award,
  TrendingUp,
  Zap,
  Target,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  IndianRupee
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  experience: string;
  industry: string;
  salary: string;
  postedDate: string;
  description: string;
  skills: string[];
  benefits: string[];
  featured: boolean;
  urgent: boolean;
}

export default function JobsPage() {
  const { user, loading: authLoading } = useSupabase();
  const router = useRouter();
  
  // Use only the Supabase provider for now to avoid conflicts
  const currentUser = user;
  const currentLoading = authLoading;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showPostJob, setShowPostJob] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "created" | "saved">("all");
  const [myCreatedJobIds] = useState<number[]>([1, 3]);
  
  // New state for dynamic jobs and form
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [userJobs, setUserJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CreateJobData>({
    title: "",
    company: "",
    location: "",
    job_type: "",
    experience_level: "",
    industry: "",
    salary_range: "",
    skills: "",
    description: "",
    benefits: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch jobs on component mount and when user auth state changes
  useEffect(() => {
    // Load jobs immediately on mount, then again when auth state changes
    loadJobs();
  }, []);

  // Also load jobs when authentication state changes
  useEffect(() => {
    if (!currentLoading) {
      loadJobs();
    }
  }, [currentLoading, currentUser]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentLoading) {
        console.log('🔍 Authentication loading timeout - forcing load');
        loadJobs();
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [currentLoading]);



  // Load all jobs
  const loadJobs = async () => {
    try {
      setLoading(true);
      
      // Always try to load jobs, regardless of authentication state
      const fetchedJobs = await JobService.getJobs();
      setJobs(fetchedJobs || []);
      
      // Also load user jobs for the "Created Jobs" tab only if user is authenticated
      if (currentUser) {
        try {
          const fetchedUserJobs = await JobService.getUserJobs();
          setUserJobs(fetchedUserJobs || []);
        } catch (error) {
          console.error('Error loading user jobs:', error);
          // Don't show error for user jobs, just set empty array
          setUserJobs([]);
        }
      } else {
        setUserJobs([]);
      }
      
      // Ensure loading is set to false
      setLoading(false);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs');
      setLoading(false); // Ensure loading is false even on error
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof CreateJobData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmitJob = async () => {
    try {
      setSubmitting(true);
      
      // Check authentication using current user state
      if (!currentUser) {
        console.log('No valid user found');
        toast.error('Please sign in to post a job');
        router.push('/auth/signin');
        return;
      }

      console.log('User authenticated:', currentUser.email);
      
      // Validate required fields
      if (!formData.title || !formData.company || !formData.location || 
          !formData.job_type || !formData.experience_level || !formData.industry || !formData.description) {
        toast.error('Please fill in all required fields');
        return;
      }

      console.log('Submitting job data:', formData);
      const newJob = await JobService.createJob(formData);
      console.log('Job created successfully:', newJob);
      toast.success('Job posted successfully!');
      
      // Reset form and close modal
      setFormData({
        title: "",
        company: "",
        location: "",
        job_type: "",
        experience_level: "",
        industry: "",
        salary_range: "",
        skills: "",
        description: "",
        benefits: ""
      });
      setShowPostJob(false);
      
      // Reload jobs to show the new job
      await loadJobs();
    } catch (error: any) {
      console.error('Error posting job:', error);
      if (error.message === 'Unauthorized' || error.message === 'User not authenticated') {
        toast.error('Please sign in to post a job');
        router.push('/auth/signin');
      } else {
        toast.error(error.message || 'Failed to post job');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const allJobs: Job[] = [
    {
      id: 1,
      title: "Senior Cinematographer",
      company: "Netflix Studios",
      location: "Los Angeles, CA",
      jobType: "Full-time",
      experience: "Senior",
      industry: "Streaming",
      salary: "₹80L - ₹1.2Cr",
      postedDate: "2024-12-10",
      description: "We're looking for an experienced cinematographer to join our award-winning team. You'll work on high-profile series and films with cutting-edge technology.",
      skills: ["Cinematography", "Lighting", "Camera Operation", "Color Grading"],
      benefits: ["Health Insurance", "401k", "Flexible Hours", "Remote Options"],
      featured: true,
      urgent: false
    },
    {
      id: 2,
      title: "Film Editor",
      company: "Warner Bros. Pictures",
      location: "Burbank, CA",
      jobType: "Contract",
      experience: "Mid-level",
      industry: "Film",
      salary: "₹55L - ₹85L",
      postedDate: "2024-12-09",
      description: "Join our post-production team working on major motion pictures. Experience with Avid Media Composer and DaVinci Resolve required.",
      skills: ["Video Editing", "Avid Media Composer", "DaVinci Resolve", "Storytelling"],
      benefits: ["Health Insurance", "Paid Time Off", "Professional Development"],
      featured: false,
      urgent: true
    },
    {
      id: 3,
      title: "Production Designer",
      company: "Disney Animation",
      location: "Glendale, CA",
      jobType: "Full-time",
      experience: "Senior",
      industry: "Animation",
      salary: "₹70L - ₹1.05Cr",
      postedDate: "2024-12-08",
      description: "Create stunning visual worlds for our animated features. Lead design teams and collaborate with directors to bring stories to life.",
      skills: ["Set Design", "Art Direction", "3D Modeling", "Concept Art"],
      benefits: ["Health Insurance", "401k", "Disney Perks", "Creative Freedom"],
      featured: true,
      urgent: false
    },
    {
      id: 4,
      title: "Sound Designer",
      company: "Skywalker Sound",
      location: "San Francisco, CA",
      jobType: "Freelance",
      experience: "Entry-level",
      industry: "Post-Production",
      salary: "₹40L - ₹60L",
      postedDate: "2024-12-07",
      description: "Work with legendary sound designers on blockbuster films. Learn from the best in the industry.",
      skills: ["Sound Design", "Pro Tools", "Foley", "Audio Mixing"],
      benefits: ["Flexible Schedule", "Networking Opportunities", "Portfolio Building"],
      featured: false,
      urgent: false
    },
    {
      id: 5,
      title: "Screenwriter",
      company: "Amazon Studios",
      location: "Culver City, CA",
      jobType: "Contract",
      experience: "Mid-level",
      industry: "Streaming",
      salary: "₹60L - ₹95L",
      postedDate: "2024-12-06",
      description: "Write compelling scripts for our original series. Collaborate with showrunners and creative teams.",
      skills: ["Screenwriting", "Story Development", "Character Development", "Dialogue"],
      benefits: ["Health Insurance", "Creative Control", "Industry Recognition"],
      featured: false,
      urgent: false
    },
    {
      id: 6,
      title: "Visual Effects Supervisor",
      company: "Industrial Light & Magic",
      location: "San Francisco, CA",
      jobType: "Full-time",
      experience: "Senior",
      industry: "VFX",
      salary: "₹1Cr - ₹1.7Cr",
      postedDate: "2024-12-05",
      description: "Lead VFX teams on major studio productions. Work with cutting-edge technology and award-winning artists.",
      skills: ["VFX Supervision", "Nuke", "Maya", "Team Leadership"],
      benefits: ["Health Insurance", "401k", "Stock Options", "Professional Development"],
      featured: true,
      urgent: false
    },
    {
      id: 7,
      title: "Costume Designer",
      company: "HBO",
      location: "New York, NY",
      jobType: "Contract",
      experience: "Mid-level",
      industry: "Television",
      salary: "₹48L - ₹75L",
      postedDate: "2024-12-04",
      description: "Design costumes for our hit series. Work with actors and directors to create memorable characters.",
      skills: ["Costume Design", "Fashion", "Period Costumes", "Fabric Knowledge"],
      benefits: ["Health Insurance", "Creative Freedom", "Industry Exposure"],
      featured: false,
      urgent: false
    },
    {
      id: 8,
      title: "Camera Operator",
      company: "Paramount Pictures",
      location: "Hollywood, CA",
      jobType: "Freelance",
      experience: "Entry-level",
      industry: "Film",
      salary: "₹35L - ₹55L",
      postedDate: "2024-12-03",
      description: "Join our camera department on major studio productions. Learn from experienced cinematographers.",
      skills: ["Camera Operation", "Equipment Maintenance", "On-Set Experience", "Teamwork"],
      benefits: ["Flexible Schedule", "Learning Opportunities", "Union Benefits"],
      featured: false,
      urgent: true
    }
  ];

  const locations = [
    "all",
    "Los Angeles, CA",
    "New York, NY",
    "San Francisco, CA",
    "Burbank, CA",
    "Glendale, CA",
    "Culver City, CA",
    "Hollywood, CA"
  ];

  const jobTypes = [
    "all",
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship"
  ];

  const experienceLevels = [
    "all",
    "Entry-level",
    "Mid-level",
    "Senior",
    "Executive"
  ];

  const industries = [
    "all",
    "Film",
    "Television",
    "Streaming",
    "Animation",
    "VFX",
    "Post-Production",
    "Gaming"
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "salary-high", label: "Highest Salary" },
    { value: "salary-low", label: "Lowest Salary" },
    { value: "relevance", label: "Most Relevant" }
  ];

  const filteredJobs = (jobs || []).filter(job => {
    if (!job || !job.title || !job.company) return false;
    
    const matchesSearch = searchQuery === "" || 
                         job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (job.skills && job.skills.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = selectedLocation === "all" || job.location === selectedLocation;
    const matchesJobType = selectedJobType === "all" || job.job_type === selectedJobType;
    const matchesExperience = selectedExperience === "all" || job.experience_level === selectedExperience;
    const matchesIndustry = selectedIndustry === "all" || job.industry === selectedIndustry;
    
    return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesIndustry;
  }).sort((a, b) => {
    if (!a || !b) return 0;
    
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "salary-high":
        // Handle salary sorting if available
        if (a.salary_range && b.salary_range) {
          return 0; // For now, return 0 as salary format might be different
        }
        return 0;
      case "salary-low":
        // Handle salary sorting if available
        if (a.salary_range && b.salary_range) {
          return 0; // For now, return 0 as salary format might be different
        }
        return 0;
      case "relevance":
        return 0; // For now, return 0 as featured field might not be available
      default:
        return 0;
    }
  });

  const displayedJobs = (() => {
    if (activeTab === "all") return filteredJobs || [];
    if (activeTab === "saved") return (filteredJobs || []).filter(job => job && savedJobs.includes(job.id));
    if (activeTab === "created") return userJobs || [];
    return filteredJobs || [];
  })();


  const toggleSavedJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const getDaysAgo = (dateString: string) => {
    if (!dateString) return "Recently";
    try {
      const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
      if (days === 0) return "Today";
      if (days === 1) return "1 day ago";
      if (days < 0) return "Recently";
      return `${days} days ago`;
    } catch (error) {
      return "Recently";
    }
  };

  const clearFilters = () => {
    setSelectedLocation("all");
    setSelectedJobType("all");
    setSelectedExperience("all");
    setSelectedIndustry("all");
    setSortBy("newest");
  };

  const openJobDetails = (job: JobType) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
                 {/* Header */}
         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
           <div>
             <h1 className="text-3xl font-bold">Job Opportunities</h1>
             <p className="text-muted-foreground">
               Find your next role in the film and entertainment industry
             </p>
             {!currentLoading && !currentUser && (
               <p className="text-sm text-orange-600 mt-2">
                 Sign in to post jobs and access all features
               </p>
             )}
           </div>
           <div className="flex gap-3">
             <Button 
               variant="outline" 
               onClick={async () => {
                 // Check authentication using current user state
                 if (!currentUser) {
                   toast.error('Please sign in to post a job');
                   router.push('/auth/signin');
                   return;
                 }
                 setShowPostJob(true);
               }}
             >
               <Plus className="w-4 h-4 mr-2" />
               Post a Job
             </Button>
           </div>
         </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b">
          <button
            className={`px-3 py-2 text-sm border-b-2 -mb-px ${activeTab === "all" ? "border-primary" : "border-transparent text-muted-foreground"}`}
            onClick={() => setActiveTab("all")}
          >
            All Jobs
          </button>
                     <button
             className={`px-3 py-2 text-sm border-b-2 -mb-px ${activeTab === "created" ? "border-primary" : "border-transparent text-muted-foreground"}`}
             onClick={() => {
               if (!currentUser) {
                 toast.error('Please sign in to view your created jobs');
                 router.push('/auth/signin');
                 return;
               }
               setActiveTab("created");
             }}
             disabled={!currentUser}
           >
             Created Jobs
           </button>
                     <button
             className={`px-3 py-2 text-sm border-b-2 -mb-px ${activeTab === "saved" ? "border-primary" : "border-transparent text-muted-foreground"}`}
             onClick={() => {
               if (!currentUser) {
                 toast.error('Please sign in to view your saved jobs');
                 router.push('/auth/signin');
                 return;
               }
               setActiveTab("saved");
             }}
             disabled={!currentUser}
           >
             Saved Jobs
           </button>
        </div>

        {/* Search and Filter Row */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={!currentUser ? "Sign in to search jobs..." : "Search jobs, companies, or skills..."}
              value={searchQuery}
              onChange={(e) => {
                if (!currentUser) {
                  toast.error('Please sign in to search jobs');
                  router.push('/auth/signin');
                  return;
                }
                setSearchQuery(e.target.value);
              }}
              className="pl-10"
              disabled={!currentUser}
            />
          </div>
                     <Button
             variant="outline"
             onClick={() => {
               if (!currentUser) {
                 toast.error('Please sign in to use filters');
                 router.push('/auth/signin');
                 return;
               }
               setShowFilters(!showFilters);
             }}
             className="flex items-center gap-2"
             disabled={!currentUser}
           >
             <Filter className="w-4 h-4" />
             Filters
             {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
           </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                if (!currentUser) {
                  toast.error('Please sign in to sort jobs');
                  router.push('/auth/signin');
                  return;
                }
                setSortBy(e.target.value);
              }}
              className="px-3 py-1 border border-border rounded-md text-sm bg-background"
              disabled={!currentUser}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

                 {/* Results Count */}
         <div className="flex items-center justify-between">
           <p className="text-sm text-muted-foreground">
             {loading ? (
               "Loading jobs..."
             ) : currentLoading ? (
               "Checking authentication..."
             ) : (
               `Showing ${displayedJobs.length} of ${filteredJobs.length} jobs`
             )}
           </p>
         </div>

        <div className="flex gap-6">
          {/* Job Listings */}
          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : displayedJobs.length > 0 ? (
              displayedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg hover:text-primary cursor-pointer">
                          {job.title}
                        </CardTitle>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getDaysAgo(job.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {job.job_type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {job.experience_level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {job.industry}
                        </Badge>
                                                 {job.salary_range && job.salary_range.trim() && (
                           <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                             <IndianRupee className="w-4 h-4" />
                             <span>{job.salary_range}</span>
                           </div>
                         )}
                      </div>

                      <CardDescription className="text-sm line-clamp-2">
                        {job.description}
                      </CardDescription>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                                             <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => {
                           if (!currentUser) {
                             toast.error('Please sign in to save jobs');
                             router.push('/auth/signin');
                             return;
                           }
                           toggleSavedJob(job.id);
                         }}
                         className={`h-8 w-8 p-0 ${savedJobs.includes(job.id) ? 'text-red-500' : ''}`}
                         disabled={!currentUser}
                       >
                         <Heart className={`w-4 h-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                       </Button>
                                             <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-8 w-8 p-0"
                         onClick={() => {
                           if (!currentUser) {
                             toast.error('Please sign in to share jobs');
                             router.push('/auth/signin');
                             return;
                           }
                           // TODO: Implement job sharing functionality
                           toast('Job sharing feature coming soon!');
                         }}
                         disabled={!currentUser}
                       >
                         <Share2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                                         {/* Skills */}
                     {job.skills && job.skills.trim() && (
                       <div>
                         <h4 className="text-sm font-medium mb-1">Required Skills:</h4>
                         <div className="flex flex-wrap gap-1">
                           {job.skills.split(',').slice(0, 3).map((skill, index) => (
                             <Badge key={index} variant="outline" className="text-xs">
                               {skill.trim()}
                             </Badge>
                           ))}
                           {job.skills.split(',').length > 3 && (
                             <Badge variant="outline" className="text-xs">
                               +{job.skills.split(',').length - 3}
                             </Badge>
                           )}
                         </div>
                       </div>
                     )}

                                         {/* Action Buttons */}
                     <div className="flex gap-2 pt-2">
                       <Button 
                         size="sm" 
                         className="flex-1"
                         onClick={() => {
                           if (!currentUser) {
                             toast.error('Please sign in to apply for jobs');
                             router.push('/auth/signin');
                             return;
                           }
                           // TODO: Implement job application functionality
                           toast('Job application feature coming soon!');
                         }}
                         disabled={!currentUser}
                       >
                         <Send className="w-3 h-3 mr-1" />
                         Apply Now
                       </Button>
                                             <Button 
                         size="sm" 
                         variant="outline" 
                         onClick={() => openJobDetails(job)}
                       >
                         <Eye className="w-3 h-3 mr-1" />
                         View Details
                       </Button>
                                             <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => {
                           if (!currentUser) {
                             toast.error('Please sign in to access external links');
                             router.push('/auth/signin');
                             return;
                           }
                           // TODO: Implement external link functionality
                           toast('External link feature coming soon!');
                         }}
                         disabled={!currentUser}
                       >
                         <ExternalLink className="w-3 h-3" />
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
                         ) : (
               <div className="text-center py-12">
                 <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                 <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                 <p className="text-muted-foreground mb-4">
                   {jobs.length === 0 ? 
                     "No jobs have been posted yet. Be the first to post a job!" : 
                     "Try adjusting your search criteria or filters"
                   }
                 </p>
                 <div className="flex gap-2 justify-center">
                   {jobs.length === 0 ? (
                     <Button size="sm" onClick={() => {
                       if (!currentUser) {
                         toast.error('Please sign in to post jobs');
                         router.push('/auth/signin');
                         return;
                       }
                       setShowPostJob(true);
                     }}
                     disabled={!currentUser}
                     >
                       Post the First Job
                     </Button>
                   ) : (
                     <>
                       <Button size="sm" onClick={() => {
                         if (!currentUser) {
                           toast.error('Please sign in to use filters');
                           router.push('/auth/signin');
                           return;
                         }
                         setSearchQuery("");
                         clearFilters();
                       }}
                       disabled={!currentUser}
                       >
                         Clear All Filters
                       </Button>
                       {!currentUser && (
                         <Button size="sm" variant="outline" onClick={() => router.push('/auth/signin')}>
                           Sign In to Post Jobs
                         </Button>
                       )}
                     </>
                   )}
                 </div>
               </div>
             )}

                         {/* Load More */}
             {displayedJobs.length > 0 && (
               <div className="text-center">
                 <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => {
                     if (!currentUser) {
                       toast.error('Please sign in to load more jobs');
                       router.push('/auth/signin');
                       return;
                   }
                   // TODO: Implement load more functionality
                   toast('Load more feature coming soon!');
                 }}
                   disabled={!currentUser}
                 >
                   Load More Jobs
                 </Button>
               </div>
             )}


          </div>

                     {/* Right Side Filter Panel */}
           {showFilters && currentUser && (
            <div className="w-80 border-l border-border p-6 bg-muted/30">
                             <div className="flex items-center justify-between mb-4">
                 <h3 className="font-semibold">Filters</h3>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={() => {
                     if (!currentUser) {
                       toast.error('Please sign in to use filters');
                       router.push('/auth/signin');
                       return;
                     }
                     clearFilters();
                   }}
                   disabled={!currentUser}
                 >
                   Clear All
                 </Button>
               </div>

                             <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Location</label>
                   <select
                     value={selectedLocation}
                     onChange={(e) => {
                       if (!currentUser) {
                         toast.error('Please sign in to use filters');
                         router.push('/auth/signin');
                         return;
                       }
                       setSelectedLocation(e.target.value);
                     }}
                     className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                     disabled={!currentUser}
                   >
                     {locations.map((location) => (
                       <option key={location} value={location}>
                         {location === "all" ? "All Locations" : location}
                       </option>
                     ))}
                   </select>
                 </div>

                                 <div className="space-y-2">
                   <label className="text-sm font-medium">Job Type</label>
                   <select
                     value={selectedJobType}
                     onChange={(e) => {
                       if (!currentUser) {
                         toast.error('Please sign in to use filters');
                         router.push('/auth/signin');
                         return;
                       }
                       setSelectedJobType(e.target.value);
                     }}
                     className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                     disabled={!currentUser}
                   >
                     {jobTypes.map((type) => (
                       <option key={type} value={type}>
                         {type === "all" ? "All Types" : type}
                       </option>
                     ))}
                   </select>
                 </div>

                                 <div className="space-y-2">
                   <label className="text-sm font-medium">Experience Level</label>
                   <select
                     value={selectedExperience}
                     onChange={(e) => {
                       if (!currentUser) {
                         toast.error('Please sign in to use filters');
                         router.push('/auth/signin');
                         return;
                       }
                       setSelectedExperience(e.target.value);
                     }}
                     className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                     disabled={!currentUser}
                   >
                     {experienceLevels.map((level) => (
                       <option key={level} value={level}>
                         {level === "all" ? "All Levels" : level}
                       </option>
                     ))}
                   </select>
                 </div>

                                 <div className="space-y-2">
                   <label className="text-sm font-medium">Industry</label>
                   <select
                     value={selectedIndustry}
                     onChange={(e) => {
                       if (!currentUser) {
                         toast.error('Please sign in to use filters');
                         router.push('/auth/signin');
                         return;
                       }
                       setSelectedIndustry(e.target.value);
                     }}
                     className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                     disabled={!currentUser}
                   >
                     {industries.map((industry) => (
                       <option key={industry} value={industry}>
                         {industry === "all" ? "All Industries" : industry}
                       </option>
                     ))}
                   </select>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

             {/* Job Details Popup */}
       {showJobDetails && selectedJob && selectedJob.title && selectedJob.company && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowJobDetails(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{selectedJob.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedJob.location}</span>
                  </div>
                                          <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getDaysAgo(selectedJob.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{selectedJob.job_type}</Badge>
                        <Badge variant="outline">{selectedJob.experience_level}</Badge>
                        <Badge variant="outline">{selectedJob.industry}</Badge>
                                                 {selectedJob.salary_range && selectedJob.salary_range.trim() && (
                           <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                             <IndianRupee className="w-4 h-4" />
                             <span>{selectedJob.salary_range}</span>
                           </div>
                         )}
                      </div>

                <div>
                  <h3 className="font-semibold mb-2">Job Description</h3>
                  <p className="text-muted-foreground">{selectedJob.description}</p>
                </div>

                                 {selectedJob.skills && selectedJob.skills.trim() && (
                   <div>
                     <h3 className="font-semibold mb-2">Required Skills</h3>
                     <div className="flex flex-wrap gap-1">
                       {selectedJob.skills.split(',').map((skill, index) => (
                         <Badge key={index} variant="outline">
                           {skill.trim()}
                         </Badge>
                       ))}
                     </div>
                   </div>
                 )}

                 {selectedJob.benefits && selectedJob.benefits.trim() && (
                   <div>
                     <h3 className="font-semibold mb-2">Benefits</h3>
                     <div className="flex flex-wrap gap-1">
                       {selectedJob.benefits.split(',').map((benefit, index) => (
                         <Badge key={index} variant="secondary">
                           <CheckCircle className="w-3 h-3 mr-1" />
                           {benefit.trim()}
                         </Badge>
                       ))}
                     </div>
                   </div>
                 )}

                                 <div className="flex gap-2 pt-4">
                   <Button 
                     className="flex-1"
                     onClick={() => {
                       if (!currentUser) {
                         toast.error('Please sign in to apply for jobs');
                         router.push('/auth/signin');
                         return;
                       }
                       // TODO: Implement job application functionality
                       toast('Job application feature coming soon!');
                     }}
                     disabled={!currentUser}
                   >
                     <Send className="w-4 h-4 mr-2" />
                     Apply Now
                   </Button>
                                     <Button 
                     variant="outline"
                     onClick={() => {
                       if (!currentUser) {
                         toast.error('Please sign in to share jobs');
                         router.push('/auth/signin');
                         return;
                       }
                       // TODO: Implement job sharing functionality
                       toast('Job sharing feature coming soon!');
                     }}
                     disabled={!currentUser}
                   >
                     <Share2 className="w-4 h-4 mr-2" />
                     Share Job
                   </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

             {/* Post Job Popup */}
       {showPostJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Post a New Job</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPostJob(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title *</label>
                    <Input 
                      placeholder="e.g., Senior Cinematographer" 
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name *</label>
                    <Input 
                      placeholder="e.g., Netflix Studios" 
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location *</label>
                    <Input 
                      placeholder="e.g., Los Angeles, CA" 
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Type *</label>
                    <select 
                      className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                      value={formData.job_type}
                      onChange={(e) => handleInputChange('job_type', e.target.value)}
                    >
                      <option value="">Select Job Type</option>
                      {jobTypes.slice(1).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Experience Level *</label>
                    <select 
                      className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                      value={formData.experience_level}
                      onChange={(e) => handleInputChange('experience_level', e.target.value)}
                    >
                      <option value="">Select Experience Level</option>
                      {experienceLevels.slice(1).map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industry *</label>
                    <select 
                      className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                    >
                      <option value="">Select Industry</option>
                      {industries.slice(1).map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salary Range</label>
                    <Input 
                      placeholder="e.g., ₹80L - ₹1.2Cr" 
                      value={formData.salary_range}
                      onChange={(e) => handleInputChange('salary_range', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Skills Required</label>
                    <Input 
                      placeholder="e.g., Cinematography, Lighting, Camera Operation" 
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Description *</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background min-h-[100px]"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Benefits</label>
                  <Input 
                    placeholder="e.g., Health Insurance, 401k, Flexible Hours" 
                    value={formData.benefits}
                    onChange={(e) => handleInputChange('benefits', e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1" 
                    onClick={handleSubmitJob}
                    disabled={submitting}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {submitting ? 'Posting Job...' : 'Post Job'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowPostJob(false)}>
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
