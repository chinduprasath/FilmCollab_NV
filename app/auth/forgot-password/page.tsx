"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Film, Mail, AlertCircle, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { AppLayout } from "@/components/layout";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setIsLoading(true);
    setEmailError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "USER_NOT_FOUND") {
          setEmailError("No account found with this email address");
          toast.error("No account found with this email address");
        } else {
          toast.error(data.message || "Failed to send reset email");
        }
        return;
      }

      setIsSubmitted(true);
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError("");
    }
  };

  if (isSubmitted) {
    return (
      <AppLayout showSidebar={false}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">FilmCollab</h1>
            </div>
          </div>

          {/* Success Card */}
          <Card className="border-border shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-foreground">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                We've sent a password reset link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
                
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email?{" "}
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      Try again
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
  }

  return (
    <AppLayout showSidebar={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">FilmCollab</h1>
          </div>
          <p className="text-muted-foreground">
            Reset your password
          </p>
        </div>

        {/* Forgot Password Card */}
        <Card className="border-border shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={`pl-10 ${emailError ? "border-destructive" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-destructive flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {emailError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            {/* Back to Sign In */}
            <div className="text-center">
              <Link
                href="/auth/signin"
                className="text-sm text-primary hover:underline font-medium flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            Need help?{" "}
            <Link href="/support" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
        </div>
      </div>
    </AppLayout>
  );
}
