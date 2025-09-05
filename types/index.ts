// Database Types (from Prisma)
export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: UserRole;
  bio: string | null;
  location: string | null;
  website: string | null;
  phone: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  height: string | null;
  weight: string | null;
  hairColor: string | null;
  eyeColor: string | null;
  experience: string | null;
  education: string | null;
  skills: string[];
  languages: string[];
  availability: string | null;
  rate: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Profile = {
  id: string;
  userId: string;
  headline: string | null;
  summary: string | null;
  specialties: string[];
  awards: string[];
  certifications: string[];
  socialLinks: any;
  preferences: any;
  createdAt: Date;
  updatedAt: Date;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: JobType;
  category: JobCategory;
  isPaid: boolean;
  rate: string | null;
  duration: string | null;
  startDate: Date | null;
  endDate: Date | null;
  requirements: string[];
  benefits: string[];
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  type: EventType;
  category: EventCategory;
  startDate: Date;
  endDate: Date;
  location: string;
  venue: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  isOnline: boolean;
  onlineUrl: string | null;
  price: number | null;
  capacity: number | null;
  isActive: boolean;
  isFeatured: boolean;
  image: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  genre: string | null;
  status: ProjectStatus;
  budget: string | null;
  timeline: string | null;
  location: string | null;
  isPublic: boolean;
  image: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type Post = {
  id: string;
  content: string;
  images: string[];
  videos: string[];
  hashtags: string[];
  isPublic: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type Message = {
  id: string;
  content: string;
  images: string[];
  files: string[];
  isRead: boolean;
  createdAt: Date;
  senderId: string;
  recipientId: string;
};

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data: any;
  createdAt: Date;
  userId: string;
};

// Enums
export enum UserRole {
  ACTOR = "ACTOR",
  DIRECTOR = "DIRECTOR",
  PRODUCER = "PRODUCER",
  WRITER = "WRITER",
  EDITOR = "EDITOR",
  CREW = "CREW",
  ADMIN = "ADMIN",
}

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  FREELANCE = "FREELANCE",
  INTERNSHIP = "INTERNSHIP",
  VOLUNTEER = "VOLUNTEER",
}

export enum JobCategory {
  ACTING = "ACTING",
  DIRECTING = "DIRECTING",
  PRODUCTION = "PRODUCTION",
  WRITING = "WRITING",
  EDITING = "EDITING",
  CAMERA = "CAMERA",
  SOUND = "SOUND",
  LIGHTING = "LIGHTING",
  ART_DEPARTMENT = "ART_DEPARTMENT",
  COSTUME = "COSTUME",
  MAKEUP = "MAKEUP",
  STUNT = "STUNT",
  OTHER = "OTHER",
}

export enum ApplicationStatus {
  PENDING = "PENDING",
  REVIEWING = "REVIEWING",
  INTERVIEWING = "INTERVIEWING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export enum EventType {
  WORKSHOP = "WORKSHOP",
  CLASS = "CLASS",
  NETWORKING = "NETWORKING",
  PREMIERE = "PREMIERE",
  FESTIVAL = "FESTIVAL",
  CONFERENCE = "CONFERENCE",
  AUDITION = "AUDITION",
  CASTING_CALL = "CASTING_CALL",
  OTHER = "OTHER",
}

export enum EventCategory {
  ACTING = "ACTING",
  DIRECTING = "DIRECTING",
  PRODUCTION = "PRODUCTION",
  WRITING = "WRITING",
  EDITING = "EDITING",
  TECHNICAL = "TECHNICAL",
  BUSINESS = "BUSINESS",
  NETWORKING = "NETWORKING",
  OTHER = "OTHER",
}

export enum ProjectType {
  FEATURE_FILM = "FEATURE_FILM",
  SHORT_FILM = "SHORT_FILM",
  DOCUMENTARY = "DOCUMENTARY",
  COMMERCIAL = "COMMERCIAL",
  MUSIC_VIDEO = "MUSIC_VIDEO",
  WEB_SERIES = "WEB_SERIES",
  TV_SHOW = "TV_SHOW",
  THEATER = "THEATER",
  OTHER = "OTHER",
}

export enum ProjectStatus {
  CONCEPT = "CONCEPT",
  IN_DEVELOPMENT = "IN_DEVELOPMENT",
  PRE_PRODUCTION = "PRE_PRODUCTION",
  PRODUCTION = "PRODUCTION",
  POST_PRODUCTION = "POST_PRODUCTION",
  COMPLETED = "COMPLETED",
  RELEASED = "RELEASED",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
}

export enum ConnectionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  BLOCKED = "BLOCKED",
}

export enum NotificationType {
  JOB_APPLICATION = "JOB_APPLICATION",
  MESSAGE = "MESSAGE",
  CONNECTION_REQUEST = "CONNECTION_REQUEST",
  EVENT_REMINDER = "EVENT_REMINDER",
  PROJECT_UPDATE = "PROJECT_UPDATE",
  SYSTEM = "SYSTEM",
}

// API Types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// Form Types
export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
};

export type ProfileFormData = {
  name: string;
  bio: string;
  location: string;
  website: string;
  phone: string;
  skills: string[];
  languages: string[];
  availability: string;
  rate: string;
};

export type JobFormData = {
  title: string;
  description: string;
  company: string;
  location: string;
  type: JobType;
  category: JobCategory;
  isPaid: boolean;
  rate: string;
  duration: string;
  startDate: string;
  endDate: string;
  requirements: string[];
  benefits: string[];
};

export type EventFormData = {
  title: string;
  description: string;
  type: EventType;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isOnline: boolean;
  onlineUrl: string;
  price: number;
  capacity: number;
  tags: string[];
};

export type ProjectFormData = {
  title: string;
  description: string;
  type: ProjectType;
  genre: string;
  budget: string;
  timeline: string;
  location: string;
  isPublic: boolean;
  tags: string[];
};

export type PostFormData = {
  content: string;
  images: File[];
  videos: File[];
  hashtags: string[];
  isPublic: boolean;
};

// Component Props Types
export type ButtonProps = {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export type CardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
};

export type InputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export type SelectProps = {
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
};

export type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

// Navigation Types
export type NavigationItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  isActive?: boolean;
};

// Theme Types
export type Theme = "light" | "dark" | "system";

// Filter Types
export type JobFilters = {
  search?: string;
  category?: JobCategory;
  type?: JobType;
  location?: string;
  isPaid?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
};

export type EventFilters = {
  search?: string;
  type?: EventType;
  category?: EventCategory;
  location?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  isOnline?: boolean;
};

export type UserFilters = {
  search?: string;
  role?: UserRole;
  location?: string;
  skills?: string[];
};

// Search Types
export type SearchResult = {
  type: "user" | "job" | "event" | "project" | "post";
  id: string;
  title: string;
  description: string;
  image?: string;
  url: string;
  metadata?: Record<string, any>;
};

// Notification Types
export type NotificationData = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: any;
};

// Chat Types
export type ChatMessage = {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  images?: string[];
  files?: string[];
  isRead: boolean;
  createdAt: Date;
};

export type ChatRoom = {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: Date;
};

// File Upload Types
export type UploadedFile = {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
};

// Analytics Types
export type UserStats = {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  verifiedUsers: number;
  usersByRole: Record<UserRole, number>;
};

export type JobStats = {
  totalJobs: number;
  activeJobs: number;
  jobsThisMonth: number;
  applicationsThisMonth: number;
  jobsByCategory: Record<JobCategory, number>;
};

export type EventStats = {
  totalEvents: number;
  upcomingEvents: number;
  eventsThisMonth: number;
  registrationsThisMonth: number;
  eventsByType: Record<EventType, number>;
};

// Export all types
export type {
  User,
  Profile,
  Job,
  Event,
  Project,
  Post,
  Message,
  Notification,
  ApiResponse,
  PaginatedResponse,
  LoginFormData,
  RegisterFormData,
  ProfileFormData,
  JobFormData,
  EventFormData,
  ProjectFormData,
  PostFormData,
  ButtonProps,
  CardProps,
  InputProps,
  SelectProps,
  ModalProps,
  SidebarProps,
  NavigationItem,
  JobFilters,
  EventFilters,
  UserFilters,
  SearchResult,
  NotificationData,
  ChatMessage,
  ChatRoom,
  UploadedFile,
  UserStats,
  JobStats,
  EventStats,
};
