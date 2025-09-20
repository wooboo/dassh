# The Base - Quick Start Guide

**Generated**: 2025-09-20  
**Project**: The Base Foundation Setup  
**Version**: 1.0.0

## Overview
This guide provides step-by-step instructions for setting up "The Base" - a foundational project structure with Next.js, shadcn/ui integration, and monorepo architecture following constitutional requirements.

## Prerequisites

### System Requirements
```bash
# Node.js version (required)
node --version  # Must be 22.0.0 or higher (LTS)

# Package manager
pnpm --version  # Must be 8.0.0 or higher

# Git version control
git --version   # Must be 2.30.0 or higher
```

### Constitutional Dependencies
- **Monorepo Architecture**: pnpm + Turborepo
- **Frontend Framework**: Next.js (mandatory)
- **Component Library**: shadcn/ui (mandatory)
- **Database ORM**: Drizzle ORM (mandatory)
- **Authentication**: Kinde (mandatory)
- **Testing**: Jest + Playwright + axe-core

## Quick Setup

### 1. Repository Initialization
```bash
# Clone or create repository
git clone <repository-url> the-base
cd the-base

# Install pnpm globally if not installed
npm install -g pnpm

# Install dependencies
pnpm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Required environment variables
KINDE_CLIENT_ID="your_kinde_client_id"
KINDE_CLIENT_SECRET="your_kinde_client_secret"
KINDE_ISSUER_URL="your_kinde_domain"
KINDE_SITE_URL="http://localhost:3000"
KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/dashboard"

DATABASE_URL="postgresql://username:password@localhost:5432/the_base"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
# Start PostgreSQL (using Docker)
docker run --name the-base-db \
  -e POSTGRES_DB=the_base \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Generate database schema
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed initial data (optional)
pnpm db:seed
```

### 4. Development Server
```bash
# Start development environment
pnpm dev

# This starts:
# - Next.js app on http://localhost:3000
# - API routes on http://localhost:3000/api
# - Database connection verification
```

## Project Structure

### Monorepo Layout
```
the-base/
├── apps/
│   └── web/                 # Next.js application
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # React components
│       │   └── lib/         # Utilities
│       ├── public/          # Static assets
│       └── package.json
├── packages/
│   ├── ui/                  # shadcn/ui components
│   ├── database/            # Drizzle schema & migrations
│   ├── auth/                # Kinde authentication
│   └── eslint-config/       # Shared ESLint config
├── tools/
│   └── tsconfig/            # Shared TypeScript configs
├── pnpm-workspace.yaml      # Workspace configuration
├── turbo.json              # Turborepo configuration
└── package.json            # Root package.json
```

### Key Files
- **Constitutional Governance**: `.specify/memory/constitution.md`
- **Package Management**: `pnpm-workspace.yaml`
- **Build System**: `turbo.json`
- **TypeScript Config**: `tools/tsconfig/base.json`
- **Database Schema**: `packages/database/src/schema/`

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Install new dependencies (from workspace root)
pnpm add <package-name> --filter=web

# Add development dependency
pnpm add -D <package-name> --filter=ui

# Build all packages
pnpm build

# Run tests
pnpm test
```

### 2. Component Development
```bash
# Generate new shadcn/ui component
pnpm ui:add button

# Create custom component
# Location: packages/ui/src/components/custom-component.tsx

# Export component
# Add to: packages/ui/src/index.ts

# Use in app
# Import: import { CustomComponent } from "@repo/ui"
```

### 3. Database Operations
```bash
# Create new migration
pnpm db:generate --name="add_user_preferences"

# Apply migrations
pnpm db:migrate

# Reset database (development only)
pnpm db:reset

# Open database studio
pnpm db:studio
```

### 4. Testing
```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:unit        # Jest unit tests
pnpm test:e2e         # Playwright e2e tests
pnpm test:a11y        # Accessibility tests

# Run tests in watch mode
pnpm test:watch

# Generate test coverage
pnpm test:coverage
```

## Essential Commands

### Workspace Management
```bash
# Install dependencies for all packages
pnpm install

# Clean all build artifacts
pnpm clean

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Format all files
pnpm format
```

### Development
```bash
# Start development server
pnpm dev

# Start specific app
pnpm dev --filter=web

# Build for production
pnpm build

# Start production server
pnpm start
```

### Package Management
```bash
# Add dependency to specific package
pnpm add <package> --filter=<workspace>

# Remove dependency
pnpm remove <package> --filter=<workspace>

# Update all dependencies
pnpm update

# Check for outdated packages
pnpm outdated
```

## Verification Checklist

### ✅ Setup Validation
- [ ] Node.js 18+ installed
- [ ] pnpm 8+ installed
- [ ] Repository cloned/created
- [ ] Dependencies installed (`pnpm install`)
- [ ] Environment variables configured
- [ ] Database running and connected

### ✅ Application Validation
- [ ] Development server starts (`pnpm dev`)
- [ ] Next.js app loads at http://localhost:3000
- [ ] Authentication redirects work (Kinde)
- [ ] Database queries execute successfully
- [ ] shadcn/ui components render properly

### ✅ Development Environment
- [ ] TypeScript compilation works
- [ ] ESLint runs without errors
- [ ] Prettier formatting applies
- [ ] Jest tests pass
- [ ] Playwright e2e tests pass
- [ ] Accessibility tests pass

### ✅ Constitutional Compliance
- [ ] Monorepo structure follows requirements
- [ ] All mandatory technologies integrated
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Performance thresholds achieved
- [ ] Security best practices implemented

## Common Issues & Solutions

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 <process-id>

# Or use different port
PORT=3001 pnpm dev
```

### Database Connection Issues
```bash
# Check database status
docker ps | grep the-base-db

# Restart database
docker restart the-base-db

# Verify connection
pnpm db:studio
```

### Build Errors
```bash
# Clear build cache
pnpm clean

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild packages
pnpm build
```

### TypeScript Errors
```bash
# Check TypeScript configuration
pnpm tsc --noEmit

# Update types
pnpm add -D @types/node typescript

# Clear TypeScript cache
rm -rf .next tsconfig.tsbuildinfo
```

## Next Steps

### 1. Customize Configuration
- Update `apps/web/src/app/layout.tsx` with your app metadata
- Modify `packages/ui/tailwind.config.js` for design system
- Configure `packages/database/src/schema/` for your data model

### 2. Add Features
- Implement authentication flows in `apps/web/src/app/(auth)/`
- Create dashboard components in `packages/ui/src/components/`
- Add API routes in `apps/web/src/app/api/`

### 3. Deploy
- Configure deployment in `apps/web/next.config.js`
- Set production environment variables
- Run `pnpm build` and deploy static files

## Support & Resources

### Documentation
- [Constitutional Requirements](.specify/memory/constitution.md)
- [Feature Specification](specs/001-the-base-with/spec.md)
- [Implementation Plan](specs/001-the-base-with/plan.md)

### Technology Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Drizzle ORM Guide](https://orm.drizzle.team)
- [Kinde Authentication](https://kinde.com/docs)

### Community
- Create issues for bugs or feature requests
- Follow constitutional amendment process for major changes
- Use semantic versioning for releases

---

**Generated by**: Constitutional AI Assistant  
**Last Updated**: 2025-09-20  
**Version**: 1.0.0