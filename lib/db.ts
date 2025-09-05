import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export { prisma };

// Database connection utilities
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log("✅ Database disconnected successfully");
  } catch (error) {
    console.error("❌ Database disconnection failed:", error);
    throw error;
  }
}

// Health check utility
export async function checkDBHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "healthy", message: "Database is connected and responsive" };
  } catch (error) {
    return { status: "unhealthy", message: "Database connection failed", error };
  }
}

// Transaction utilities
export async function withTransaction<T>(
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(fn);
}

// Pagination utilities
export function getPaginationParams(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  const take = limit;
  
  return { skip, take };
}

export function getPaginationInfo(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  };
}

// Search utilities
export function buildSearchQuery(search: string, fields: string[]) {
  if (!search) return {};
  
  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: search,
        mode: "insensitive" as const,
      },
    })),
  };
}

// Filter utilities
export function buildWhereClause(filters: Record<string, any>) {
  const where: Record<string, any> = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        where[key] = { in: value };
      } else if (typeof value === "object") {
        where[key] = value;
      } else {
        where[key] = value;
      }
    }
  });
  
  return where;
}

// Date range utilities
export function buildDateRangeFilter(
  startDate?: string | Date,
  endDate?: string | Date,
  field: string = "createdAt"
) {
  const filter: Record<string, any> = {};
  
  if (startDate) {
    filter[field] = {
      ...filter[field],
      gte: new Date(startDate),
    };
  }
  
  if (endDate) {
    filter[field] = {
      ...filter[field],
      lte: new Date(endDate),
    };
  }
  
  return Object.keys(filter).length > 0 ? filter : {};
}

// Soft delete utilities
export function includeSoftDeleted(includeDeleted: boolean = false) {
  return includeDeleted ? {} : { deletedAt: null };
}

// Common database operations
export const db = {
  // User operations
  users: {
    findById: (id: string) => prisma.user.findUnique({ where: { id } }),
    findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
    create: (data: any) => prisma.user.create({ data }),
    update: (id: string, data: any) => prisma.user.update({ where: { id }, data }),
    delete: (id: string) => prisma.user.delete({ where: { id } }),
    findMany: (params?: any) => prisma.user.findMany(params),
    count: (params?: any) => prisma.user.count(params),
  },
  
  // Job operations
  jobs: {
    findById: (id: string) => prisma.job.findUnique({ where: { id } }),
    create: (data: any) => prisma.job.create({ data }),
    update: (id: string, data: any) => prisma.job.update({ where: { id }, data }),
    delete: (id: string) => prisma.job.delete({ where: { id } }),
    findMany: (params?: any) => prisma.job.findMany(params),
    count: (params?: any) => prisma.job.count(params),
    findActive: () => prisma.job.findMany({ where: { isActive: true } }),
    findFeatured: () => prisma.job.findMany({ where: { isFeatured: true } }),
  },
  
  // Event operations
  events: {
    findById: (id: string) => prisma.event.findUnique({ where: { id } }),
    create: (data: any) => prisma.event.create({ data }),
    update: (id: string, data: any) => prisma.event.update({ where: { id }, data }),
    delete: (id: string) => prisma.event.delete({ where: { id } }),
    findMany: (params?: any) => prisma.event.findMany(params),
    count: (params?: any) => prisma.event.count(params),
    findUpcoming: () => prisma.event.findMany({
      where: {
        startDate: { gte: new Date() },
        isActive: true,
      },
      orderBy: { startDate: "asc" },
    }),
  },
  
  // Project operations
  projects: {
    findById: (id: string) => prisma.project.findUnique({ where: { id } }),
    create: (data: any) => prisma.project.create({ data }),
    update: (id: string, data: any) => prisma.project.update({ where: { id }, data }),
    delete: (id: string) => prisma.project.delete({ where: { id } }),
    findMany: (params?: any) => prisma.project.findMany(params),
    count: (params?: any) => prisma.project.count(params),
    findPublic: () => prisma.project.findMany({ where: { isPublic: true } }),
  },
  
  // Post operations
  posts: {
    findById: (id: string) => prisma.post.findUnique({ where: { id } }),
    create: (data: any) => prisma.post.create({ data }),
    update: (id: string, data: any) => prisma.post.update({ where: { id }, data }),
    delete: (id: string) => prisma.post.delete({ where: { id } }),
    findMany: (params?: any) => prisma.post.findMany(params),
    count: (params?: any) => prisma.post.count(params),
    findPublic: () => prisma.post.findMany({ where: { isPublic: true } }),
  },
  
  // Message operations
  messages: {
    findById: (id: string) => prisma.message.findUnique({ where: { id } }),
    create: (data: any) => prisma.message.create({ data }),
    findConversation: (userId1: string, userId2: string) =>
      prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId1, recipientId: userId2 },
            { senderId: userId2, recipientId: userId1 },
          ],
        },
        orderBy: { createdAt: "asc" },
      }),
  },
  
  // Notification operations
  notifications: {
    findById: (id: string) => prisma.notification.findUnique({ where: { id } }),
    create: (data: any) => prisma.notification.create({ data }),
    markAsRead: (id: string) =>
      prisma.notification.update({ where: { id }, data: { isRead: true } }),
    findUnread: (userId: string) =>
      prisma.notification.findMany({
        where: { userId, isRead: false },
        orderBy: { createdAt: "desc" },
      }),
  },
  
  // Connection operations
  connections: {
    findById: (id: string) => prisma.connection.findUnique({ where: { id } }),
    create: (data: any) => prisma.connection.create({ data }),
    update: (id: string, data: any) =>
      prisma.connection.update({ where: { id }, data }),
    findPending: (userId: string) =>
      prisma.connection.findMany({
        where: { recipientId: userId, status: "PENDING" },
      }),
    findAccepted: (userId: string) =>
      prisma.connection.findMany({
        where: {
          OR: [
            { requesterId: userId, status: "ACCEPTED" },
            { recipientId: userId, status: "ACCEPTED" },
          ],
        },
      }),
  },
};
