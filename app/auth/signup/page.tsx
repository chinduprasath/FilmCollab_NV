"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Film, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, User, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSupabase } from "@/components/providers/supabase-provider";
import { AppLayout } from "@/components/layout";
import { DatabaseStatus } from "@/components/debug/database-status";

const roles = [
  { value: "ACTOR", label: "Actor" },
  { value: "DIRECTOR", label: "Director" },
  { value: "PRODUCER", label: "Producer" },
  { value: "WRITER", label: "Writer" },
  { value: "CINEMATOGRAPHER", label: "Cinematographer" },
  { value: "PRODUCTION_COMPANY", label: "Production Company" },
  { value: "EDITOR", label: "Editor" },
  { value: "SOUND_DESIGNER", label: "Sound Designer" },
  { value: "PRODUCTION_DESIGNER", label: "Production Designer" },
  { value: "COSTUME_DESIGNER", label: "Costume Designer" },
  { value: "MAKEUP_ARTIST", label: "Makeup Artist" },
  { value: "STUNT_COORDINATOR", label: "Stunt Coordinator" },
  { value: "VISUAL_EFFECTS_ARTIST", label: "Visual Effects Artist" },
  { value: "MUSIC_COMPOSER", label: "Music Composer" },
  { value: "ART_DIRECTOR", label: "Art Director" },
  { value: "LOCATION_MANAGER", label: "Location Manager" },
];

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, user, userRole } = useSupabase();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Only redirect if user is already authenticated with a role
  // This prevents redirect loops during signup
  useEffect(() => {
    if (user && userRole) {
      if (userRole === 'ADMIN') {
        router.push("/admin-dashboard");
      } else if (userRole === 'USER') {
        router.push("/dashboard");
      }
    }
  }, [user, userRole, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
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
    console.log('Starting signup process...');

    try {
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: "USER", // Automatically assign USER role
        full_name: `${formData.firstName} ${formData.lastName}`,
      };

      console.log('Calling signUp with data:', userData);
      
      // Add timeout to prevent infinite loading - reduced to 10 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Signup timeout - please try again')), 10000)
      );
      
      const result = await Promise.race([
        signUp(formData.email, formData.password, userData),
        timeoutPromise
      ]);
      
      if (result.user) {
        toast.success("Account created successfully! Please check your email to verify your account.");
        console.log("Signup successful, user:", result.user.id);
        // Redirect to signin page immediately after successful signup
        router.push("/auth/signin");
      } else {
        throw new Error("Failed to create account");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      
      if (error.message.includes("timeout")) {
        toast.error("Signup is taking too long. Please try again.");
      } else if (error.message.includes("Database setup incomplete")) {
        toast.error("Database setup issue. Please contact support.");
        setErrors({ email: "Database setup incomplete. Contact support." });
      } else if (error.message.includes("Profile creation blocked")) {
        toast.error("Profile creation blocked. Please contact support.");
        setErrors({ email: "Profile creation blocked. Contact support." });
      } else if (error.message.includes("already registered")) {
        toast.error("An account with this email already exists");
        setErrors({ email: "An account with this email already exists" });
      } else if (error.message.includes("password")) {
        toast.error("Password is too weak");
        setErrors({ password: "Password is too weak" });
      } else if (error.message.includes("Profile creation failed")) {
        toast.error("Account created but profile setup failed. Please contact support.");
        setErrors({ email: "Profile setup failed. Contact support." });
      } else {
        toast.error(error.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      console.log('Signup process completed');
    }
  };

  const handleGoogleSignUp = () => {
    toast.success("Google sign-up coming soon!");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <AppLayout showSidebar={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Header */}
          <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">FilmCollab</h1>
          </div>
          <p className="text-muted-foreground">Create your professional account</p>
        </div>

        {/* Database Status Check */}
        <DatabaseStatus />

        {/* Sign Up Card */}
        <Card className="shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">
              Join the premier networking platform for film professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Professional Role</Label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className={`w-full flex items-center justify-between px-3 py-2 border rounded-md bg-background text-left ${
                      errors.role ? "border-destructive" : "border-input"
                    } ${formData.role ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    <span>{formData.role ? roles.find(r => r.value === formData.role)?.label : "Select your role"}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showRoleDropdown ? "rotate-180" : ""}`} />
                  </button>
                  
                  {showRoleDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                      {roles.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => {
                            handleInputChange("role", role.value);
                            setShowRoleDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {role.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.role && (
                  <p className="text-sm text-destructive flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.terms}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleSignUp}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </AppLayout>
  );
}
