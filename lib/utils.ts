import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, formatStr: string = "MMM dd, yyyy") {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatStr);
}

export function formatRelativeTime(date: Date | string) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return "Today";
  }
  
  if (isYesterday(dateObj)) {
    return "Yesterday";
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    ACTOR: "Actor",
    DIRECTOR: "Director",
    PRODUCER: "Producer",
    WRITER: "Writer",
    EDITOR: "Editor",
    CREW: "Crew Member",
    ADMIN: "Administrator",
  };
  
  return roleMap[role] || role;
}

export function getJobTypeDisplayName(type: string): string {
  const typeMap: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    FREELANCE: "Freelance",
    INTERNSHIP: "Internship",
    VOLUNTEER: "Volunteer",
  };
  
  return typeMap[type] || type;
}

export function getJobCategoryDisplayName(category: string): string {
  const categoryMap: Record<string, string> = {
    ACTING: "Acting",
    DIRECTING: "Directing",
    PRODUCTION: "Production",
    WRITING: "Writing",
    EDITING: "Editing",
    CAMERA: "Camera",
    SOUND: "Sound",
    LIGHTING: "Lighting",
    ART_DEPARTMENT: "Art Department",
    COSTUME: "Costume",
    MAKEUP: "Makeup",
    STUNT: "Stunt",
    OTHER: "Other",
  };
  
  return categoryMap[category] || category;
}

export function getEventTypeDisplayName(type: string): string {
  const typeMap: Record<string, string> = {
    WORKSHOP: "Workshop",
    CLASS: "Class",
    NETWORKING: "Networking",
    PREMIERE: "Premiere",
    FESTIVAL: "Festival",
    CONFERENCE: "Conference",
    AUDITION: "Audition",
    CASTING_CALL: "Casting Call",
    OTHER: "Other",
  };
  
  return typeMap[type] || type;
}

export function getProjectTypeDisplayName(type: string): string {
  const typeMap: Record<string, string> = {
    FEATURE_FILM: "Feature Film",
    SHORT_FILM: "Short Film",
    DOCUMENTARY: "Documentary",
    COMMERCIAL: "Commercial",
    MUSIC_VIDEO: "Music Video",
    WEB_SERIES: "Web Series",
    TV_SHOW: "TV Show",
    THEATER: "Theater",
    OTHER: "Other",
  };
  
  return typeMap[type] || type;
}

export function getProjectStatusDisplayName(status: string): string {
  const statusMap: Record<string, string> = {
    CONCEPT: "Concept",
    IN_DEVELOPMENT: "In Development",
    PRE_PRODUCTION: "Pre-Production",
    PRODUCTION: "Production",
    POST_PRODUCTION: "Post-Production",
    COMPLETED: "Completed",
    RELEASED: "Released",
    ON_HOLD: "On Hold",
    CANCELLED: "Cancelled",
  };
  
  return statusMap[status] || status;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    REVIEWING: "bg-blue-100 text-blue-800",
    INTERVIEWING: "bg-purple-100 text-purple-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    WITHDRAWN: "bg-gray-100 text-gray-800",
    REGISTERED: "bg-green-100 text-green-800",
    ATTENDED: "bg-blue-100 text-blue-800",
    NO_SHOW: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };
  
  return colorMap[status] || "bg-gray-100 text-gray-800";
}

export function getRoleColor(role: string): string {
  const colorMap: Record<string, string> = {
    ACTOR: "bg-purple-100 text-purple-800",
    DIRECTOR: "bg-blue-100 text-blue-800",
    PRODUCER: "bg-green-100 text-green-800",
    WRITER: "bg-yellow-100 text-yellow-800",
    EDITOR: "bg-red-100 text-red-800",
    CREW: "bg-indigo-100 text-indigo-800",
    ADMIN: "bg-gray-100 text-gray-800",
  };
  
  return colorMap[role] || "bg-gray-100 text-gray-800";
}

export function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    ACTING: "bg-purple-100 text-purple-800",
    DIRECTING: "bg-blue-100 text-blue-800",
    PRODUCTION: "bg-green-100 text-green-800",
    WRITING: "bg-yellow-100 text-yellow-800",
    EDITING: "bg-red-100 text-red-800",
    CAMERA: "bg-indigo-100 text-indigo-800",
    SOUND: "bg-pink-100 text-pink-800",
    LIGHTING: "bg-orange-100 text-orange-800",
    ART_DEPARTMENT: "bg-teal-100 text-teal-800",
    COSTUME: "bg-rose-100 text-rose-800",
    MAKEUP: "bg-fuchsia-100 text-fuchsia-800",
    STUNT: "bg-amber-100 text-amber-800",
    OTHER: "bg-gray-100 text-gray-800",
  };
  
  return colorMap[category] || "bg-gray-100 text-gray-800";
}

export function parseSearchParams(searchParams: URLSearchParams) {
  const params: Record<string, string | string[]> = {};
  
  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  }
  
  return params;
}

export function buildSearchParams(params: Record<string, any>): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand("copy");
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

export function downloadFile(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getRandomColor(): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  return fn().catch((error) => {
    if (retries > 0) {
      return sleep(delay).then(() => retry(fn, retries - 1, delay));
    }
    throw error;
  });
}
