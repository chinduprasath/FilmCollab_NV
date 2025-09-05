# FilmCollab Deployment Guide

This guide provides comprehensive instructions for deploying the FilmCollab application to various environments.

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+ installed
- Git access to the repository
- Database access (PostgreSQL)
- Environment variables configured

### 1. Local Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd FilmCollab_NewVersion

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your configuration

# Set up the database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### 2. Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🌍 Environment Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/filmcollab"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-s3-bucket-name"

# UploadThing (Alternative to S3)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Email (Optional - for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Redis (Optional - for caching and sessions)
REDIS_URL="redis://localhost:6379"

# Analytics (Optional)
GOOGLE_ANALYTICS_ID="your-ga-id"
```

### Environment-Specific Configurations

#### Development
```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost:5432/filmcollab_dev
```

#### Staging
```env
NODE_ENV=staging
NEXTAUTH_URL=https://staging.filmcollab.com
DATABASE_URL=postgresql://staging-db-url
```

#### Production
```env
NODE_ENV=production
NEXTAUTH_URL=https://filmcollab.com
DATABASE_URL=postgresql://production-db-url
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Use the official Node.js runtime as the base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/filmcollab
      - NEXTAUTH_SECRET=your-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=filmcollab
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  postgres_data:
```

### Docker Commands

```bash
# Build and run with Docker Compose
docker-compose up -d

# Build image
docker build -t filmcollab .

# Run container
docker run -p 3000:3000 --env-file .env.local filmcollab

# View logs
docker-compose logs -f app
```

## ☁️ Cloud Deployment

### Vercel Deployment

#### 1. Connect Repository
1. Go to [Vercel](https://vercel.com)
2. Import your Git repository
3. Configure build settings

#### 2. Environment Variables
Set the following environment variables in Vercel:

```env
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket
```

#### 3. Build Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

#### 4. Custom Domain
1. Add your custom domain in Vercel
2. Update DNS records
3. Configure SSL certificate

### AWS Deployment

#### 1. EC2 Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
```

#### 2. Application Deployment
```bash
# Clone repository
git clone <repository-url>
cd FilmCollab_NewVersion

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "filmcollab" -- start
pm2 startup
pm2 save
```

#### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

### Google Cloud Platform

#### 1. App Engine
Create `app.yaml`:

```yaml
runtime: nodejs18
env: standard

instance_class: F1

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10

env_variables:
  NODE_ENV: "production"
  DATABASE_URL: "your-database-url"
  NEXTAUTH_SECRET: "your-secret"
  NEXTAUTH_URL: "https://your-app-id.appspot.com"

handlers:
  - url: /.*
    script: auto
    secure: always
```

Deploy:
```bash
gcloud app deploy
```

#### 2. Cloud Run
```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/filmcollab

# Deploy to Cloud Run
gcloud run deploy filmcollab \
  --image gcr.io/PROJECT_ID/filmcollab \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=your-database-url
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Run linting
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:$NODE_VERSION
  services:
    - postgres:15
  variables:
    POSTGRES_DB: test
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    DATABASE_URL: postgresql://postgres:postgres@postgres:5432/test
  script:
    - npm ci
    - npm run test
    - npm run lint
    - npm run type-check
  only:
    - main
    - merge_requests

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/
    expire_in: 1 hour
  only:
    - main

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - curl -X POST $DEPLOY_WEBHOOK_URL
  only:
    - main
```

## 📊 Monitoring & Logging

### Application Monitoring

#### 1. Vercel Analytics
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### 2. Sentry Error Tracking
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

```javascript
// sentry.server.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

#### 3. Custom Logging
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },
};
```

### Database Monitoring

#### 1. Prisma Studio
```bash
npx prisma studio
```

#### 2. Database Health Checks
```typescript
// lib/db-health.ts
import { prisma } from './db';

export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', message: 'Database is connected' };
  } catch (error) {
    return { status: 'unhealthy', message: 'Database connection failed', error };
  }
}
```

### Performance Monitoring

#### 1. Core Web Vitals
```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

#### 2. Custom Performance Monitoring
```typescript
// lib/performance.ts
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
}
```

## 🔧 Maintenance

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name migration-name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Backup Strategy

#### 1. Database Backups
```bash
# PostgreSQL backup
pg_dump -h localhost -U username -d filmcollab > backup.sql

# Restore backup
psql -h localhost -U username -d filmcollab < backup.sql
```

#### 2. Automated Backups
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U username -d filmcollab > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### Health Checks

#### 1. Application Health Check
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db-health';

export async function GET() {
  const dbHealth = await checkDatabaseHealth();
  
  const isHealthy = dbHealth.status === 'healthy';
  
  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    database: dbHealth,
  }, {
    status: isHealthy ? 200 : 503,
  });
}
```

#### 2. Monitoring Script
```bash
#!/bin/bash
# health-check.sh
response=$(curl -s -o /dev/null -w "%{http_code}" https://your-domain.com/api/health)

if [ $response -eq 200 ]; then
    echo "Application is healthy"
    exit 0
else
    echo "Application is unhealthy"
    exit 1
fi
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check database connection
npx prisma db pull

# Reset database
npx prisma migrate reset

# Check database status
npx prisma studio
```

#### 2. Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 3. Environment Variables
```bash
# Check environment variables
node -e "console.log(process.env.NODE_ENV)"

# Validate environment
npm run validate-env
```

### Performance Issues

#### 1. Bundle Size Analysis
```bash
# Analyze bundle
npm run analyze

# Check bundle size
npm run build:analyze
```

#### 2. Database Query Optimization
```bash
# Enable query logging
DEBUG="prisma:query" npm run dev

# Check slow queries
npx prisma studio
```

## 📞 Support

### Getting Help
- Check the troubleshooting section
- Review application logs
- Contact the development team
- Create an issue in the repository

### Emergency Contacts
- **Development Team**: dev@filmcollab.com
- **DevOps Team**: ops@filmcollab.com
- **Database Admin**: db@filmcollab.com

---

**Last Updated**: January 2024  
**Version**: 1.0
