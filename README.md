# FilmCollab - Professional Networking & Collaboration Platform

A comprehensive professional networking and collaboration platform designed specifically for the film and entertainment industry. Connect with industry professionals, discover opportunities, and collaborate on projects.

## 🎬 Features

### Core Functionality
- **Professional Networking**: Connect with actors, directors, producers, writers, editors, and crew members
- **Job Opportunities**: Browse and apply for film jobs, auditions, and crew calls
- **Event Management**: Discover and register for industry events, workshops, and classes
- **Project Collaboration**: Create and manage film projects with team collaboration tools
- **Community Engagement**: Share updates, achievements, and content with the community
- **Real-time Messaging**: Direct and group messaging with media sharing capabilities

### User Roles
- **Actors**: Find auditions, showcase portfolios, connect with casting directors
- **Directors**: Post casting calls, manage projects, collaborate with crew
- **Producers**: Source talent, manage productions, network with industry professionals
- **Writers**: Share scripts, find collaborators, pitch projects
- **Editors**: Showcase work, find editing opportunities, collaborate on post-production
- **Crew Members**: Find work opportunities, showcase skills, network with productions

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js with multiple providers
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io for messaging
- **File Storage**: AWS S3 or similar
- **Deployment**: Vercel

## 📱 Pages & Features

### 1. Landing Page
- Hero section with branding and call-to-action
- Feature highlights for different user types
- Testimonials and industry highlights
- Mobile responsive with dark/light themes

### 2. Authentication & Onboarding
- Multi-provider authentication (Email, Google, Social)
- Role-based profile setup wizard
- Portfolio upload and skills configuration

### 3. User Dashboard
- Personalized feed with opportunities and connections
- Navigation sidebar with active states
- Quick actions and notifications

### 4. Jobs & Opportunities
- Advanced filtering and search
- Apply/Show Interest functionality
- Responsive card layout

### 5. Events & Classes
- Event discovery and registration
- Workshop and class management
- Bookmarking system

### 6. Projects & Collaboration
- Project creation and team management
- Resource sharing and updates
- Group collaboration tools

### 7. Community & Posts
- Social feed with engagement features
- Media upload (images, videos, reels)
- Trending content and hashtags

### 8. Messaging System
- Real-time 1:1 and group messaging
- Media and file sharing
- Online status and read receipts

### 9. User Profiles
- Comprehensive portfolio display
- Skills, experience, and education tabs
- Connection and messaging options

### 10. Admin Panel
- User management and moderation
- Content moderation tools
- Analytics and reporting

### 11. Settings & Preferences
- Account and privacy settings
- Theme customization
- Notification preferences

## 🎨 Design System

- **Themes**: Dark and Light mode support
- **Components**: Shadcn/ui with custom theming
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 AA compliance
- **Animations**: Smooth transitions with Framer Motion

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- AWS S3 (or similar) for file storage

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd FilmCollab_NewVersion
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# File Storage
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="your-aws-region"
AWS_S3_BUCKET="your-s3-bucket"
```

5. Set up the database
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
FilmCollab_NewVersion/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── admin/             # Admin panel routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── lib/                  # Utility functions
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Database utilities
│   └── utils.ts         # General utilities
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style
- ESLint configuration for code quality
- Prettier for code formatting
- TypeScript for type safety
- Conventional commits for version control

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm run start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🗺️ Roadmap

### Phase 1 (MVP)
- [x] Basic authentication and user profiles
- [x] Job posting and application system
- [x] Basic messaging functionality
- [x] Event management

### Phase 2 (Enhanced Features)
- [ ] Advanced search and filtering
- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Advanced collaboration tools

### Phase 3 (Advanced Features)
- [ ] AI-powered job matching
- [ ] Video conferencing integration
- [ ] Advanced analytics
- [ ] API for third-party integrations
