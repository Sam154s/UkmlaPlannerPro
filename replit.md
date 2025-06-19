# UKMLA Planner Pro

## Overview

This is a medical learning platform designed for UKMLA (UK Medical Licensing Assessment) preparation. The application provides intelligent timetable generation using a spiral learning algorithm, subject progress tracking, and performance analytics for medical students.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom theming support
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **State Management**: React Query for server state, local React state for UI
- **Routing**: Wouter for lightweight client-side routing
- **Calendar**: FullCalendar for timetable visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Authentication**: Passport.js with local strategy and session management
- **API Design**: RESTful endpoints with proper error handling
- **Session Storage**: PostgreSQL-based session store

### Database Architecture
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### 1. Spiral Learning Algorithm
- **Location**: `client/src/algorithms/`
- **Purpose**: Generates optimized study timetables using spaced repetition principles
- **Features**:
  - Subject prioritization based on user preferences
  - Automatic review session scheduling
  - Performance-based difficulty adjustment
  - Calendar integration with user events

### 2. Authentication System
- **Server**: `server/auth.ts` with Passport.js
- **Client**: `client/src/hooks/use-auth.tsx` with React Query
- **Features**: Login, registration, session persistence, remember me functionality

### 3. Timetable Management
- **Calendar View**: FullCalendar integration with custom styling
- **Event Types**: Study sessions, review sessions, user events, holiday periods
- **Conflict Resolution**: Automatic scheduling around existing commitments

### 4. Subject Rating System
- **Data Source**: Excel-based UKMLA difficulty rankings
- **Processing**: Python scripts convert Excel data to TypeScript definitions
- **Features**: Difficulty, clinical importance, and exam relevance ratings

### 5. Performance Tracking
- **Heatmaps**: Visual representation of study progress
- **Analytics**: Session completion rates and subject mastery tracking
- **Adaptive Learning**: Algorithm adjusts based on performance data

## Data Flow

### 1. User Configuration
1. User selects study preferences (hours/week, subjects, year group)
2. System calculates study blocks using base block counts and year multipliers
3. Algorithm generates personalized timetable

### 2. Timetable Generation
1. Selector builds session stream based on subject quotas and preferences
2. Timeslotter places sessions on calendar avoiding conflicts
3. Calendar renders events with color coding and interactive features

### 3. Performance Feedback
1. User marks sessions as completed with difficulty ratings
2. System updates performance data in database
3. Algorithm adjusts future session priorities based on performance

### 4. Data Persistence
1. All user data stored in PostgreSQL via Drizzle ORM
2. Local storage used for offline functionality and caching
3. React Query manages server state synchronization

## External Dependencies

### Core Technologies
- **React 18**: Frontend framework with hooks and concurrent features
- **Vite**: Build tool with hot module replacement
- **Node.js 20**: Server runtime environment
- **PostgreSQL**: Primary database system
- **Drizzle ORM**: Type-safe database operations

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **FullCalendar**: Calendar and scheduling component
- **Lucide React**: Icon system

### Authentication and Security
- **Passport.js**: Authentication middleware
- **bcrypt/scrypt**: Password hashing
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Data Processing
- **Python**: Excel processing scripts
- **pandas**: Data manipulation
- **openpyxl**: Excel file reading

### AI Integration
- **OpenAI API**: Intelligent tutoring and chat assistance
- **Fallback System**: Graceful degradation when API unavailable

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Nix package management
- **Database**: Neon serverless PostgreSQL
- **File Watching**: Vite development server with HMR
- **Port Configuration**: Express on port 5000, Vite dev server proxy

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild compiles TypeScript to ESM modules
- **Static Serving**: Express serves built frontend files
- **Database**: Same Neon instance with production connection string

### Cloud Deployment
- **Target**: Google Cloud Run (configured in .replit)
- **Container**: Node.js 20 runtime
- **Environment Variables**: DATABASE_URL, OPENAI_API_KEY, SESSION_SECRET
- **Health Checks**: API endpoints for service monitoring

## Changelog

- June 19, 2025: Frontend refactored to production-ready state with environment-based configuration, React Query persistence, variable-length sessions, and comprehensive test suite
- June 19, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.