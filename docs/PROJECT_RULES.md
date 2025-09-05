# FilmCollab Project Rules & Guidelines

This document outlines the rules, standards, and guidelines that all team members must follow when contributing to the FilmCollab project.

## 🎯 Project Overview

**FilmCollab** is a professional networking and collaboration platform for the film and entertainment industry. Our mission is to connect industry professionals, facilitate collaboration, and advance careers in the entertainment sector.

## 📋 Core Principles

### 1. User-First Design
- Every feature must serve the user's needs
- Prioritize user experience over technical complexity
- Maintain accessibility standards (WCAG 2.1 AA)
- Ensure mobile-first responsive design

### 2. Quality Over Speed
- Write clean, maintainable code
- Implement comprehensive testing
- Follow established patterns and conventions
- Document all significant changes

### 3. Security First
- Never compromise security for convenience
- Validate all user inputs
- Implement proper authentication and authorization
- Follow OWASP security guidelines

### 4. Performance Matters
- Optimize for Core Web Vitals
- Implement proper caching strategies
- Minimize bundle sizes
- Monitor and optimize database queries

## 🛠️ Development Standards

### Code Quality Rules

#### 1. TypeScript Standards
- **MANDATORY**: Use TypeScript for all new code
- **MANDATORY**: Enable strict mode in tsconfig.json
- **MANDATORY**: Define proper types for all functions and variables
- **FORBIDDEN**: Use `any` type - use `unknown` instead
- **REQUIRED**: Use interfaces for object shapes
- **REQUIRED**: Use enums for constants

```typescript
// ✅ GOOD
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ❌ BAD
const user: any = { id: 1, name: "John" };
```

#### 2. React Component Rules
- **MANDATORY**: Use functional components with hooks
- **MANDATORY**: Use TypeScript for component props
- **MANDATORY**: Follow PascalCase naming convention
- **REQUIRED**: Keep components under 200 lines
- **REQUIRED**: Use proper prop validation
- **FORBIDDEN**: Use class components (except for error boundaries)

```typescript
// ✅ GOOD
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ children, variant = 'primary', onClick, disabled }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// ❌ BAD
export default function button(props) {
  return <button>{props.children}</button>;
}
```

#### 3. File Naming Conventions
- **MANDATORY**: Use kebab-case for file names
- **MANDATORY**: Use PascalCase for component names
- **MANDATORY**: Use camelCase for functions and variables
- **MANDATORY**: Use UPPER_SNAKE_CASE for constants

```
✅ GOOD
- user-profile.tsx
- job-application-form.tsx
- useAuth.ts
- API_ENDPOINTS.ts

❌ BAD
- UserProfile.tsx
- job_application_form.tsx
- useauth.ts
- apiEndpoints.ts
```

#### 4. Import/Export Rules
- **MANDATORY**: Use named exports for components
- **MANDATORY**: Use default exports for pages
- **MANDATORY**: Group imports: React, third-party, local
- **MANDATORY**: Use absolute imports with `@/` prefix

```typescript
// ✅ GOOD
import React from 'react';
import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

// ❌ BAD
import { Button } from '../../../components/ui/button';
import { motion } from 'framer-motion';
import React from 'react';
```

### Styling Standards

#### 1. Tailwind CSS Rules
- **MANDATORY**: Use Tailwind CSS for all styling
- **MANDATORY**: Follow the design system
- **REQUIRED**: Use CSS variables for theming
- **REQUIRED**: Keep styles consistent across components
- **FORBIDDEN**: Use inline styles
- **FORBIDDEN**: Create custom CSS unless absolutely necessary

```typescript
// ✅ GOOD
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">

// ❌ BAD
<div style={{ display: 'flex', padding: '16px', backgroundColor: 'white' }}>
```

#### 2. Responsive Design Rules
- **MANDATORY**: Mobile-first design approach
- **MANDATORY**: Test on multiple screen sizes
- **REQUIRED**: Use Tailwind responsive prefixes
- **REQUIRED**: Ensure touch targets are at least 44px

```typescript
// ✅ GOOD
<div className="w-full md:w-1/2 lg:w-1/3 p-4">
<button className="w-12 h-12 md:w-16 md:h-16">

// ❌ BAD
<div className="w-1/3 p-4">
<button className="w-8 h-8">
```

### Database Standards

#### 1. Prisma Schema Rules
- **MANDATORY**: Use descriptive field names
- **MANDATORY**: Add proper indexes for performance
- **MANDATORY**: Use appropriate data types
- **REQUIRED**: Add comments for complex fields
- **REQUIRED**: Use enums for status fields

```prisma
// ✅ GOOD
model Job {
  id          String      @id @default(cuid())
  title       String
  description String      @db.Text
  isActive    Boolean     @default(true)
  status      JobStatus   @default(PENDING)
  
  @@index([status, isActive])
  @@index([createdAt])
}

enum JobStatus {
  PENDING
  ACTIVE
  CLOSED
  CANCELLED
}

// ❌ BAD
model Job {
  id    String @id
  title String
  desc  String
  active Boolean
  s     String
}
```

#### 2. Query Optimization Rules
- **MANDATORY**: Use proper indexes
- **MANDATORY**: Limit query results with pagination
- **REQUIRED**: Use select to fetch only needed fields
- **REQUIRED**: Avoid N+1 queries
- **FORBIDDEN**: Use raw SQL unless absolutely necessary

```typescript
// ✅ GOOD
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
  },
  where: {
    isActive: true,
    role: 'ACTOR',
  },
  take: 10,
  skip: 0,
  orderBy: {
    createdAt: 'desc',
  },
});

// ❌ BAD
const users = await prisma.user.findMany();
```

## 🔒 Security Rules

### 1. Authentication & Authorization
- **MANDATORY**: Use NextAuth.js for authentication
- **MANDATORY**: Implement role-based access control
- **MANDATORY**: Validate user permissions on all protected routes
- **REQUIRED**: Use secure session management
- **FORBIDDEN**: Store sensitive data in localStorage

```typescript
// ✅ GOOD
export async function requireAuth(handler: Function) {
  return async (req: any, res: any) => {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    return handler(req, res, session.user);
  };
}

// ❌ BAD
const user = localStorage.getItem('user');
```

### 2. Input Validation
- **MANDATORY**: Validate all user inputs
- **MANDATORY**: Use Zod schemas for validation
- **REQUIRED**: Sanitize data before storage
- **FORBIDDEN**: Trust user input

```typescript
// ✅ GOOD
import { z } from 'zod';

const createJobSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  rate: z.string().optional(),
});

// ❌ BAD
const { title, description } = req.body;
```

### 3. Data Protection
- **MANDATORY**: Use environment variables for secrets
- **MANDATORY**: Encrypt sensitive data
- **REQUIRED**: Implement proper error handling
- **FORBIDDEN**: Log sensitive information

```typescript
// ✅ GOOD
const apiKey = process.env.API_KEY;
console.log('User action completed');

// ❌ BAD
const apiKey = 'hardcoded-secret';
console.log('User password:', password);
```

## 📊 Performance Rules

### 1. Frontend Performance
- **MANDATORY**: Optimize Core Web Vitals
- **MANDATORY**: Use Next.js Image component
- **REQUIRED**: Implement code splitting
- **REQUIRED**: Minimize bundle sizes
- **FORBIDDEN**: Blocking operations in render

```typescript
// ✅ GOOD
import dynamic from 'next/dynamic';
import Image from 'next/image';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});

// ❌ BAD
import HeavyComponent from './HeavyComponent';
```

### 2. API Performance
- **MANDATORY**: Implement proper pagination
- **MANDATORY**: Use database indexes
- **REQUIRED**: Implement caching strategies
- **REQUIRED**: Optimize database queries
- **FORBIDDEN**: Return unlimited data

```typescript
// ✅ GOOD
const { page = 1, limit = 10 } = req.query;
const skip = (page - 1) * limit;

const jobs = await prisma.job.findMany({
  take: limit,
  skip: skip,
  orderBy: { createdAt: 'desc' },
});

// ❌ BAD
const jobs = await prisma.job.findMany();
```

## 🧪 Testing Rules

### 1. Test Coverage Requirements
- **MANDATORY**: 80% minimum code coverage
- **MANDATORY**: Test all API endpoints
- **REQUIRED**: Test critical user flows
- **REQUIRED**: Test error scenarios
- **FORBIDDEN**: Skip tests for "simple" code

### 2. Testing Standards
- **MANDATORY**: Use Jest and React Testing Library
- **MANDATORY**: Write descriptive test names
- **REQUIRED**: Follow AAA pattern (Arrange, Act, Assert)
- **REQUIRED**: Mock external dependencies

```typescript
// ✅ GOOD
describe('Job Application', () => {
  it('should allow user to apply for a job', async () => {
    // Arrange
    const job = createMockJob();
    const user = createMockUser();
    
    // Act
    const result = await applyForJob(job.id, user.id);
    
    // Assert
    expect(result.status).toBe('PENDING');
    expect(result.jobId).toBe(job.id);
  });
});

// ❌ BAD
it('should work', () => {
  expect(true).toBe(true);
});
```

## 📝 Documentation Rules

### 1. Code Documentation
- **MANDATORY**: Document complex functions
- **MANDATORY**: Add JSDoc comments for public APIs
- **REQUIRED**: Update README for new features
- **REQUIRED**: Document breaking changes
- **FORBIDDEN**: Leave TODO comments in production code

```typescript
// ✅ GOOD
/**
 * Creates a new job posting
 * @param jobData - The job data to create
 * @param userId - The ID of the user creating the job
 * @returns The created job object
 * @throws {Error} If user is not authorized to create jobs
 */
export async function createJob(jobData: CreateJobData, userId: string): Promise<Job> {
  // Implementation
}

// ❌ BAD
// TODO: Add validation
export async function createJob(data, user) {
  // Implementation
}
```

### 2. API Documentation
- **MANDATORY**: Document all API endpoints
- **MANDATORY**: Include request/response examples
- **REQUIRED**: Document error responses
- **REQUIRED**: Keep documentation up to date

## 🤝 Collaboration Rules

### 1. Git Workflow
- **MANDATORY**: Use feature branches
- **MANDATORY**: Write descriptive commit messages
- **MANDATORY**: Create pull requests for all changes
- **REQUIRED**: Request code reviews
- **FORBIDDEN**: Push directly to main branch

```bash
# ✅ GOOD
git checkout -b feature/add-job-application
git commit -m "feat: add job application functionality

- Add job application form component
- Implement application submission API
- Add email notifications for applications
- Update job listing to show application status"

# ❌ BAD
git commit -m "fix stuff"
```

### 2. Code Review Standards
- **MANDATORY**: Review all pull requests
- **MANDATORY**: Check for security issues
- **REQUIRED**: Verify test coverage
- **REQUIRED**: Ensure documentation is updated
- **FORBIDDEN**: Approve without thorough review

### 3. Communication Rules
- **MANDATORY**: Use clear, professional language
- **MANDATORY**: Provide context for changes
- **REQUIRED**: Respond to feedback promptly
- **REQUIRED**: Ask questions when unclear
- **FORBIDDEN**: Make assumptions about requirements

## 🚀 Deployment Rules

### 1. Environment Management
- **MANDATORY**: Use environment variables
- **MANDATORY**: Never commit secrets to version control
- **REQUIRED**: Test in staging before production
- **REQUIRED**: Monitor application health
- **FORBIDDEN**: Deploy untested code

### 2. Release Process
- **MANDATORY**: Use semantic versioning
- **MANDATORY**: Create release notes
- **REQUIRED**: Test in staging environment
- **REQUIRED**: Monitor post-deployment
- **FORBIDDEN**: Deploy on Fridays (unless critical)

## 📋 Quality Assurance

### 1. Code Quality Checks
- **MANDATORY**: Pass all linting rules
- **MANDATORY**: Pass TypeScript compilation
- **MANDATORY**: Pass all tests
- **REQUIRED**: Meet performance benchmarks
- **REQUIRED**: Pass accessibility audits

### 2. Review Checklist
Before submitting a pull request, ensure:

- [ ] Code follows all style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance is acceptable
- [ ] Accessibility requirements met
- [ ] Mobile responsiveness verified
- [ ] Error handling implemented
- [ ] Logging added where appropriate

## 🚨 Violation Consequences

### 1. Minor Violations
- Warning and education
- Request for immediate fix
- Additional review required

### 2. Major Violations
- Pull request blocked
- Mandatory code review
- Required training/education

### 3. Critical Violations
- Immediate code removal
- Security audit required
- Team discussion and action plan

## 📞 Support & Questions

### Getting Help
- Check existing documentation first
- Ask questions in team chat
- Create issues for bugs/problems
- Request code reviews early

### Escalation Process
1. Try to resolve independently
2. Ask team members for help
3. Escalate to team lead
4. Schedule team discussion if needed

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Tools
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### Best Practices
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google Web Fundamentals](https://developers.google.com/web/fundamentals)

---

**Remember**: These rules exist to ensure we build a high-quality, secure, and maintainable application that serves our users effectively. When in doubt, prioritize user experience, security, and code quality.

**Last Updated**: January 2024  
**Version**: 1.0
