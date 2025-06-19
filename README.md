# UKMLA Planner Pro

A medical learning platform designed for UKMLA (UK Medical Licensing Assessment) preparation with intelligent timetable generation using spiral learning algorithms.

## Features

- **Intelligent Timetable Generation**: Variable-length sessions (60-120 min) with weighted topic allocation
- **AI-Powered Study Assistant**: OpenAI integration for event creation and study planning
- **React Query Integration**: Offline-first caching with localStorage persistence
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Subject Progress Tracking**: Visual heatmaps and performance analytics
- **Flexible Study Days**: User-configurable study schedule

## Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd ukmla-planner-pro
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```
   VITE_API_URL=http://localhost:5000
   VITE_OPENAI_ENABLED=true
   VITE_SENTRY_DSN=your-sentry-dsn
   ```

3. **Database Setup**
   ```bash
   npm run db:push
   ```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Build

Create a production build:
```bash
npm run build
```

## Testing

Run the test suite:
```bash
npm test
```

Run linting:
```bash
npm run lint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_OPENAI_ENABLED` | Enable AI features | `false` |
| `VITE_SENTRY_DSN` | Error tracking DSN | - |

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + PostgreSQL
- **State Management**: React Query with persistence
- **UI Components**: Radix UI + Tailwind CSS
- **Calendar**: FullCalendar integration
- **AI Integration**: OpenAI GPT-4o for intelligent assistance

## API Integration

The frontend is designed to work with or without a backend:

- **With Backend**: Full persistence and AI features
- **Without Backend**: Local algorithm fallback with localStorage

## Deployment

The application is optimized for deployment on cloud platforms:

1. **Environment Variables**: Configure all required secrets
2. **Build Process**: Automated via CI/CD
3. **Health Checks**: Built-in API monitoring
4. **Error Tracking**: Sentry integration ready

## Demo

[30-second demo video placeholder]

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run tests: `npm test`
4. Run linting: `npm run lint`
5. Submit a pull request

## License

MIT License - see LICENSE file for details