"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSupabase } from "@/components/providers/supabase-provider";
import { AppLayout } from "@/components/layout";
import { createClient } from "@/lib/supabase";

export default function AdminSignInPage() {
  const router = useRouter();
  const { signIn, user, userRole } = useSupabase();
  const supabase = createClient();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);



  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

         setLoading(true);

     // Add timeout protection to prevent infinite loading
     const timeoutId = setTimeout(() => {
       console.log('Signin timeout - resetting loading state');
       setLoading(false);
       toast.error("Sign in is taking too long. Please try again.");
     }, 15000); // 15 second timeout

     try {
       // Attempt to sign in
       console.log('Attempting admin sign in...');
       console.log('Email:', formData.email);
       
       const result = await signIn(formData.email, formData.password);
       
       console.log('SignIn result:', result);
       console.log('Result type:', typeof result);
       console.log('Result keys:', Object.keys(result || {}));
       
       if (result.error) throw result.error;
       
              if (result.user) {
         console.log('Admin user authenticated successfully, user ID:', result.user.id);
         
         try {
           console.log('Checking admin role from database...');
           // Directly check the user's role from the database
           const { data: profileData, error: profileError } = await supabase
             .from('profiles')
             .select('role')
             .eq('user_id', result.user.id)
             .single();
           
           if (profileError) {
             console.error('Error fetching user role:', profileError);
             toast.error("Error checking user role. Please try again.");
             setLoading(false);
             return;
           }
           
           const userRoleFromDB = profileData?.role;
           console.log('User role from database:', userRoleFromDB);
           
           // Check if user has admin role
           if (userRoleFromDB === 'ADMIN') {
             toast.success("Welcome back, Administrator!");
             console.log('Redirecting to admin dashboard...');
             
             // Force navigation with multiple fallbacks
             setTimeout(() => {
               try {
                 // Method 1: Try Next.js router
                 router.push("/admin-dashboard");
                 console.log('Router redirect initiated');
               } catch (routerError) {
                 console.error('Router redirect failed, trying window.location:', routerError);
                 try {
                   // Method 2: Try window.location
                   window.location.href = "/admin-dashboard";
                 } catch (locationError) {
                   console.error('Window location failed, trying window.open:', locationError);
                   // Method 3: Try window.open as last resort
                   window.open("/admin-dashboard", "_self");
                 }
               }
             }, 500);
           } else if (userRoleFromDB === 'USER') {
             toast.error("Unauthorized access. User accounts cannot access admin dashboard.");
             setErrors({ password: "Unauthorized access. User accounts cannot access admin dashboard." });
             
             // Sign out the user immediately
             await supabase.auth.signOut();
             setLoading(false);
             return;
           } else {
             toast.error("User role not found. Please contact support.");
             setErrors({ password: "User role not found. Please contact support." });
             setLoading(false);
           }
         } catch (roleCheckError) {
           console.error('Error during role check:', roleCheckError);
           toast.error("Error checking user role. Please try again.");
           setLoading(false);
           return;
         }
       } else {
         // No user in result
         console.error('No user found in signin result');
         toast.error("Authentication failed. Please try again.");
         setLoading(false);
       }
         } catch (error: any) {
       console.error("Admin signin error:", error);
       
       if (error.message.includes("Invalid login credentials")) {
         toast.error("Invalid email or password");
         setErrors({ password: "Invalid email or password" });
       } else if (error.message.includes("Email not confirmed")) {
         toast.error("Please check your email and verify your account");
         setErrors({ email: "Please verify your email address" });
       } else if (error.message.includes("Cannot read properties of undefined")) {
         toast.error("Authentication error. Please try again.");
         setErrors({ password: "Authentication error. Please try again." });
       } else {
         toast.error(error.message || "An error occurred. Please try again.");
       }
          } finally {
       clearTimeout(timeoutId);
       setLoading(false);
     }
  };

  return (
    <AppLayout showSidebar={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">FilmCollab Admin</h1>
            </div>
            <p className="text-gray-300">Administrative Access Portal</p>
          </div>

          {/* Admin Sign In Card */}
          <Card className="shadow-2xl backdrop-blur-sm bg-slate-800/90 border-slate-700">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-white">Admin Sign In</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Access administrative controls and system management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@filmcollab.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 ${errors.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 ${errors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                                 {/* Submit Button */}
                 <Button
                   type="submit"
                   className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                   disabled={loading}
                 >
                   {loading ? (
                     <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       Authenticating...
                     </>
                   ) : (
                     "Sign In"
                   )}
                 </Button>

                 {/* Emergency Reset Button */}
                 {loading && (
                   <Button
                     type="button"
                     variant="outline"
                     onClick={() => {
                       setLoading(false);
                       setErrors({});
                       toast.info("Loading state reset. Please try signing in again.");
                     }}
                     className="w-full mt-2 border-red-300 text-red-600 hover:bg-red-50"
                   >
                     Reset Loading State
                   </Button>
                 )}

                {/* Forgot Password Button */}
                <div className="text-center">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-gray-400 hover:text-white font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>

              <div className="mt-6 text-center space-y-3">
                <div>
                  <Link href="/admin-signup" className="text-gray-400 hover:text-white font-medium">
                    Need an admin account? Create one
                  </Link>
                </div>
                
                                 <div>
                   <Link href="/auth/signin" className="text-gray-400 hover:text-white flex items-center justify-center">
                     <ArrowLeft className="w-4 h-4 mr-2" />
                     Back to User Login
                   </Link>
                 </div>
                
                <div>
                  <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm">
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
