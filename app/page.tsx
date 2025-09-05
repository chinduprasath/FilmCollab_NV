import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Star, 
  Award,
  Play,
  ArrowRight,
  CheckCircle,
  Film,
  Camera,
  Mic,
  PenTool,
  Scissors,
  Settings
} from "lucide-react";
import { AppLayout } from "@/components/layout";


export default function LandingPage() {
  return (
    <AppLayout showSidebar={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900">


      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              <Film className="w-4 h-4 mr-2" />
              Professional Film Networking Platform
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-display">
              Connect. Collaborate.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Create.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              The premier networking and collaboration platform for film and entertainment professionals. 
              Find opportunities, build connections, and bring your projects to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                            <Link href="/auth/signup">
                 <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                   <Play className="w-5 h-5 mr-2" />
                   Get Started Free
                 </Button>
               </Link>
                               <Link href="/auth/signin">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Free to join
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                No hidden fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Industry verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Professionals</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5K+</div>
              <div className="text-muted-foreground">Projects</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2K+</div>
              <div className="text-muted-foreground">Jobs Posted</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Events</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Everything you need to succeed in film
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From networking to project collaboration, we provide all the tools 
              you need to advance your career in the entertainment industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover bg-card border-border hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-foreground">Professional Networking</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Connect with actors, directors, producers, and crew members. 
                  Build meaningful relationships that advance your career.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover bg-card border-border hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-foreground">Job Opportunities</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Discover auditions, crew calls, and production jobs. 
                  Apply directly and track your applications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover bg-card border-border hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-foreground">Events & Workshops</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Attend industry events, workshops, and networking sessions. 
                  Stay updated with the latest trends and techniques.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover bg-card border-border hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-foreground">Project Collaboration</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Create and manage film projects with your team. 
                  Share resources, communicate, and track progress.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover bg-card border-border hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-foreground">Portfolio Showcase</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Showcase your work with a professional portfolio. 
                  Highlight your skills and achievements to potential collaborators.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover bg-card border-border hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-foreground">Industry Recognition</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Get verified badges and build credibility. 
                  Stand out with industry endorsements and reviews.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* For Different Roles Section */}
      <section className="py-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Built for every role in the industry
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Whether you're an actor, director, producer, or crew member, 
              we have specialized features for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 card-hover bg-card border-border hover:border-primary/20">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">For Actors</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• Find auditions and casting calls</li>
                <li>• Showcase your portfolio and reels</li>
                <li>• Connect with casting directors</li>
                <li>• Track your applications</li>
              </ul>
            </Card>

            <Card className="text-center p-8 card-hover bg-card border-border hover:border-primary/20">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">For Directors</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• Post casting calls and crew positions</li>
                <li>• Manage your projects and teams</li>
                <li>• Find talented crew members</li>
                <li>• Collaborate on scripts and storyboards</li>
              </ul>
            </Card>

            <Card className="text-center p-8 card-hover bg-card border-border hover:border-primary/20">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">For Producers</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• Source talent and crew</li>
                <li>• Manage production schedules</li>
                <li>• Network with industry professionals</li>
                <li>• Track project budgets and timelines</li>
              </ul>
            </Card>

            <Card className="text-center p-8 card-hover bg-card border-border hover:border-primary/20">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <PenTool className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">For Writers</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• Share and pitch your scripts</li>
                <li>• Find writing opportunities</li>
                <li>• Collaborate with other writers</li>
                <li>• Get feedback on your work</li>
              </ul>
            </Card>

            <Card className="text-center p-8 card-hover bg-card border-border hover:border-primary/20">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scissors className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">For Editors</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• Showcase your editing work</li>
                <li>• Find post-production opportunities</li>
                <li>• Collaborate on editing projects</li>
                <li>• Network with directors and producers</li>
              </ul>
            </Card>

            <Card className="text-center p-8 card-hover bg-card border-border hover:border-primary/20">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">For Crew</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• Find crew positions and gigs</li>
                <li>• Showcase your technical skills</li>
                <li>• Build your professional network</li>
                <li>• Track your work history</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              What professionals are saying
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join thousands of industry professionals who trust FilmCollab
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">S</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">Actor</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "FilmCollab helped me land my first major role. The networking opportunities 
                and audition postings are incredible. Highly recommended!"
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">M</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Michael Chen</div>
                  <div className="text-sm text-muted-foreground">Director</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "As a director, finding the right talent and crew is crucial. FilmCollab 
                has streamlined this process and helped me build an amazing team."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 dark:text-green-400 font-bold">E</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Emma Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Producer</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "The project collaboration tools are game-changing. We've managed multiple 
                productions efficiently and found incredible talent through the platform."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to advance your career?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of film professionals who are already using FilmCollab 
            to connect, collaborate, and create amazing projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Free Account
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-foreground">FilmCollab</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                The premier networking and collaboration platform for the film and entertainment industry.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">LinkedIn</Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Instagram</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Jobs</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Events</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Projects</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Press</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 FilmCollab. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </AppLayout>
  );
}
