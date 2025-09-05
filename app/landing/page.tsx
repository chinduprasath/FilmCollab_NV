"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout";
import { 
  Film, 
  Users, 
  Calendar, 
  Briefcase, 
  Star, 
  ArrowRight, 
  Play,
  CheckCircle,
  Award,
  Globe,
  Zap,
  Shield,
  Heart,
  MessageSquare,
  TrendingUp,
  Users2,
  Building2,
  Camera,
  Mic,
  PenTool,
  Scissors,
  Music,
  Palette,
  MapPin,
  Clock,
  DollarSign
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("talents");

  const features = [
    {
      icon: Users,
      title: "Professional Networking",
      description: "Connect with industry professionals, build meaningful relationships, and expand your network in the film industry."
    },
    {
      icon: Briefcase,
      title: "Job Opportunities",
      description: "Discover casting calls, crew positions, and production opportunities from verified industry partners."
    },
    {
      icon: Calendar,
      title: "Events & Workshops",
      description: "Attend industry events, workshops, and masterclasses to enhance your skills and knowledge."
    },
    {
      icon: MessageSquare,
      title: "Real-time Communication",
      description: "Chat with collaborators, share updates, and coordinate projects seamlessly."
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "All profiles are verified to ensure you're connecting with legitimate industry professionals."
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Track your progress, showcase your work, and advance your career in the entertainment industry."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Independent Filmmaker",
      avatar: "SJ",
      content: "FilmCollab has been a game-changer for my career. I've connected with amazing cinematographers and found funding for my latest project.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Production Designer",
      avatar: "MC",
      content: "The platform makes it so easy to find talented crew members and collaborate on projects. Highly recommended!",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Actress",
      avatar: "ER",
      content: "I've landed several roles through FilmCollab's casting calls. The community is supportive and professional.",
      rating: 5
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Professionals" },
    { number: "10K+", label: "Projects Completed" },
    { number: "500+", label: "Industry Partners" },
    { number: "95%", label: "Success Rate" }
  ];

  const roles = [
    { icon: Users2, title: "Actors", count: "15K+" },
    { icon: Camera, title: "Directors", count: "8K+" },
    { icon: Building2, title: "Producers", count: "12K+" },
    { icon: PenTool, title: "Writers", count: "10K+" },
    { icon: Mic, title: "Cinematographers", count: "6K+" },
    { icon: Scissors, title: "Editors", count: "7K+" },
    { icon: Music, title: "Composers", count: "4K+" },
    { icon: Palette, title: "Designers", count: "5K+" }
  ];

  return (
    <AppLayout showSidebar={false}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              <Film className="w-4 h-4 mr-2" />
              Professional Film Industry Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Connect. Collaborate. Create.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The premier networking platform for film and entertainment professionals. 
              Find opportunities, build connections, and bring your creative vision to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How FilmCollab Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who are already using FilmCollab to advance their careers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Create Your Profile</h3>
              <p className="text-muted-foreground">
                Set up your professional profile with your portfolio, skills, and experience. 
                Showcase your work and let opportunities find you.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Connect & Network</h3>
              <p className="text-muted-foreground">
                Discover and connect with industry professionals. Join communities, 
                participate in discussions, and build meaningful relationships.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Collaborate & Grow</h3>
              <p className="text-muted-foreground">
                Find projects, apply for opportunities, and collaborate with talented 
                professionals. Take your career to the next level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and features designed specifically for the film industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Different Roles */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Every Role</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're in front of the camera or behind the scenes, FilmCollab has you covered
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveTab("talents")}
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === "talents" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                For Talents
              </button>
              <button
                onClick={() => setActiveTab("professionals")}
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === "professionals" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                For Professionals
              </button>
              <button
                onClick={() => setActiveTab("producers")}
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === "producers" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                For Producers
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {activeTab === "talents" && (
                <>
                  <h3 className="text-3xl font-bold mb-6">For Actors & Performers</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Access exclusive casting calls and auditions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Build your professional portfolio and reel</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Connect with casting directors and agents</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Attend workshops and training sessions</span>
                    </li>
                  </ul>
                </>
              )}

              {activeTab === "professionals" && (
                <>
                  <h3 className="text-3xl font-bold mb-6">For Crew & Technical Professionals</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Find crew positions and freelance opportunities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Showcase your technical skills and equipment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Network with directors and production companies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Access industry training and certifications</span>
                    </li>
                  </ul>
                </>
              )}

              {activeTab === "producers" && (
                <>
                  <h3 className="text-3xl font-bold mb-6">For Producers & Production Companies</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Find talented crew and cast members</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Post job opportunities and casting calls</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Manage projects and team collaboration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Access funding and distribution opportunities</span>
                    </li>
                  </ul>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {roles.map((role, index) => {
                const Icon = role.icon;
                return (
                  <Card key={index} className="text-center p-6">
                    <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <h4 className="font-semibold mb-1">{role.title}</h4>
                    <p className="text-sm text-muted-foreground">{role.count}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied professionals who have transformed their careers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{testimonial.content}</p>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join the fastest-growing community of film and entertainment professionals. 
            Start building your network today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
