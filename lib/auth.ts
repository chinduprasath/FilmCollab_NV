import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { UserRole } from "@/types";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: UserRole.ACTOR, // Default role for Google sign-in
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Handle Google sign-in
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create new user with Google profile
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              image: user.image!,
              role: UserRole.ACTOR, // Default role
              isVerified: true, // Google users are pre-verified
            },
          });
        }
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Session utilities
export function getSessionUser(session: any) {
  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    role: session.user.role,
  };
}

// Role-based access control
export function hasRole(user: any, requiredRoles: UserRole | UserRole[]): boolean {
  if (!user?.role) {
    return false;
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(user.role);
}

export function isAdmin(user: any): boolean {
  return hasRole(user, UserRole.ADMIN);
}

export function isProducer(user: any): boolean {
  return hasRole(user, [UserRole.PRODUCER, UserRole.ADMIN]);
}

export function isDirector(user: any): boolean {
  return hasRole(user, [UserRole.DIRECTOR, UserRole.PRODUCER, UserRole.ADMIN]);
}

// Permission utilities
export function canCreateJob(user: any): boolean {
  return hasRole(user, [UserRole.PRODUCER, UserRole.DIRECTOR, UserRole.ADMIN]);
}

export function canCreateEvent(user: any): boolean {
  return hasRole(user, [UserRole.PRODUCER, UserRole.DIRECTOR, UserRole.ADMIN]);
}

export function canCreateProject(user: any): boolean {
  return hasRole(user, [UserRole.PRODUCER, UserRole.DIRECTOR, UserRole.WRITER, UserRole.ADMIN]);
}

export function canModerateContent(user: any): boolean {
  return hasRole(user, [UserRole.ADMIN, UserRole.PRODUCER]);
}

export function canViewAdminPanel(user: any): boolean {
  return hasRole(user, UserRole.ADMIN);
}

// Authentication middleware helpers
export function requireAuth(handler: Function) {
  return async (req: any, res: any) => {
    const session = await getSession(req);
    
    if (!session?.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    return handler(req, res, session.user);
  };
}

export function requireRole(requiredRoles: UserRole | UserRole[]) {
  return (handler: Function) => {
    return async (req: any, res: any) => {
      const session = await getSession(req);
      
      if (!session?.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      if (!hasRole(session.user, requiredRoles)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }
      
      return handler(req, res, session.user);
    };
  };
}

// User creation utilities
export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}) {
  const hashedPassword = await hashPassword(userData.password);
  
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role,
    },
  });
  
  return user;
}

export async function updateUserProfile(
  userId: string,
  profileData: {
    name?: string;
    bio?: string;
    location?: string;
    website?: string;
    phone?: string;
    skills?: string[];
    languages?: string[];
    availability?: string;
    rate?: string;
  }
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: profileData,
  });
  
  return user;
}

// Password reset utilities
export async function createPasswordResetToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    throw new Error("User not found");
  }
  
  // Generate reset token (you might want to use a more secure method)
  const resetToken = Math.random().toString(36).substring(2, 15);
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
  
  // Store reset token in user record (you might want to create a separate table)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      // Add reset token fields to your schema if needed
    },
  });
  
  return { resetToken, resetTokenExpiry };
}

export async function resetPassword(email: string, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword);
  
  const user = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
  
  return user;
}

// Email verification utilities
export async function createEmailVerificationToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    throw new Error("User not found");
  }
  
  // Generate verification token
  const verificationToken = Math.random().toString(36).substring(2, 15);
  const verificationTokenExpiry = new Date(Date.now() + 86400000); // 24 hours
  
  // Store verification token (you might want to create a separate table)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      // Add verification token fields to your schema if needed
    },
  });
  
  return { verificationToken, verificationTokenExpiry };
}

export async function verifyEmail(email: string) {
  const user = await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });
  
  return user;
}

// Helper function to get session (you'll need to implement this based on your setup)
async function getSession(req: any) {
  // This is a placeholder - implement based on your session management
  return null;
}
