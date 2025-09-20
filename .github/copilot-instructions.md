# GitHub Copilot Instructions

## Project Context
**Project**: Dassh - Dashboard Application with Widget-Centric Architecture  
**Type**: Monorepo web application  
**Primary Framework**: Next.js with TypeScript  
**Component Library**: shadcn/ui  
**Database**: PostgreSQL with Drizzle ORM  
**Package Manager**: pnpm with Turborepo  
**Authentication**: Kinde authentication service  

## Current Development Context

### Active Feature: User Authentication System (002-user-authentication-i)
**Implementation Status**: Planning phase completed, ready for development

**Key Components**:
- **Kinde Integration**: @kinde-oss/kinde-auth-nextjs for authentication flows
- **Profile Dropdowns**: Dual placement (dashboard bottom-left, main page top-right)
- **Route Protection**: Next.js middleware for dashboard and protected routes
- **User Management**: PostgreSQL schema with Drizzle ORM for extended user data
- **Session Tracking**: Database-driven session management with security monitoring

**Authentication Architecture**:
- **Sign-in/Sign-up**: Kinde hosted authentication pages with callback handling
- **Profile Components**: Shared widgets using shadcn/ui dropdowns and buttons
- **State Management**: React Context with Kinde useKindeAuth hook
- **Database Schema**: Users, UserSessions, UserProfiles tables with proper relationships
- **API Endpoints**: RESTful profile management and session handling endpoints

## Constitutional Requirements (CRITICAL)

### Technology Stack (NON-NEGOTIABLE)
- **Frontend**: Next.js (App Router preferred)
- **Components**: shadcn/ui components only
- **API Communication**: oRPC for type-safe backend communication with OpenAPI compliance
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Kinde service integration
- **Package Manager**: pnpm (never npm or yarn)
- **Monorepo**: Turborepo orchestration
- **Styling**: Tailwind CSS via shadcn/ui

### Widget-Centric Architecture (MANDATORY)
- Every UI component must be designed as a reusable widget
- Widgets must support webhook data integration
- Independent testing and standalone functionality required
- Template-driven widget creation with placeholder mapping
- Security: No arbitrary code execution in widget templates

### Accessibility Standards (REQUIRED)
- WCAG 2.1 AA compliance for all components
- Keyboard navigation support
- Screen reader compatibility
- Semantic HTML markup
- Focus management and ARIA labels

### Performance Requirements
- Page load: <3s on 3G networks
- Database queries: <100ms response time
- WebSocket latency: <50ms for real-time updates
- Component rendering: 60fps smooth interactions

## Development Patterns

### Authentication Implementation
```typescript
// Use Kinde hooks for auth state
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

// Database operations with Drizzle
import { db } from "@/lib/database";
import { users, userProfiles } from "@/lib/database/schema";

// Component patterns
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
```

### oRPC API Development Pattern
```typescript
// Server-side oRPC procedures with OpenAPI support
import { z } from "zod";
import { os } from "@orpc/server";

const userProcedures = {
  getUser: os
    .route({ method: 'GET', path: '/users/{id}' })
    .input(z.object({ id: z.string() }))
    .output(z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string()
    }))
    .handler(async ({ input, context }) => {
      return await context.db.query.users.findFirst({
        where: eq(users.id, input.id)
      });
    }),
  
  createUser: os
    .route({ method: 'POST', path: '/users' })
    .input(z.object({ 
      name: z.string().min(1),
      email: z.string().email()
    }))
    .output(z.object({
      id: z.string(),
      email: z.string(),
      name: z.string()
    }))
    .handler(async ({ input, context }) => {
      return await context.db.insert(users).values(input);
    })
};

// Client-side oRPC usage with full type safety
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

const client = createORPCClient(new RPCLink({
  url: '/api/rpc'
}));

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    client.getUser({ id: userId }).then(setUser);
  }, [userId]);
  
  // Full type safety and autocomplete available
}
```

### Route Protection Pattern
```typescript
// middleware.ts - Protect dashboard routes
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth({
  // Protected routes configuration
});

export const config = {
  matcher: ["/dashboard/:path*"]
};
```

### Database Schema Pattern
```typescript
// Use Drizzle schema definitions
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  kindeId: varchar('kinde_id').notNull().unique(),
  // Additional fields following data-model.md
});
```

## Code Quality Standards

### Testing Requirements
- Unit tests for all authentication components
- Integration tests for complete auth flows
- Accessibility tests using axe-core
- Database integration tests with isolated test data

### Error Handling
- Graceful authentication error recovery
- User-friendly error messages
- Proper loading states during auth flows
- Network error retry mechanisms

### Security Practices
- No sensitive data in client-side storage
- Secure token handling via Kinde
- Input validation for all user data
- Rate limiting for authentication endpoints

## File Organization

### Monorepo Structure
```
apps/
├── dashboard/          # Main dashboard application
│   ├── src/components/ # Dashboard-specific components
│   └── middleware.ts   # Auth protection middleware

packages/
├── shared/
│   ├── auth/          # Kinde integration utilities
│   ├── api/           # oRPC routers and procedures
│   ├── database/      # User schema and queries
│   └── validation/    # Auth form validation
├── ui/                # Shared shadcn/ui components
└── widgets/           # Reusable widget library
```

### Component Naming
- `AuthButton` - Sign-in/sign-up button component
- `ProfileDropdown` - User profile dropdown widget
- `AuthGuard` - Route/component protection HOC
- `UserAvatar` - User profile picture component

## Recent Changes
- **2025-01-27**: Constitution updated to v2.7.0 - Added oRPC requirement for type-safe API communication
- **2025-09-20**: User authentication system planning completed
- **Feature Spec**: Created comprehensive authentication requirements (FR-001 to FR-013)
- **Data Model**: Designed PostgreSQL schema with Users, UserSessions, UserProfiles
- **API Contracts**: Defined RESTful endpoints for profile and session management
- **Architecture**: Established dual profile dropdown placement and Kinde integration

## Implementation Priorities
1. **Database Schema**: Create and migrate user authentication tables
2. **Kinde Setup**: Configure authentication service with proper callbacks
3. **Middleware**: Implement route protection for dashboard access
4. **Profile Widgets**: Build shared dropdown components for both placements
5. **Integration Testing**: Validate complete authentication flows

## Debugging Tips
- **Kinde Issues**: Check environment variables and callback URLs
- **Database Errors**: Verify Drizzle schema and migration status
- **Component Issues**: Ensure shadcn/ui components are properly imported
- **Performance**: Use React DevTools and network monitoring for optimization

---
**Last Updated**: January 27, 2025  
**Constitution Version**: 2.7.0  
**Active Branch**: 002-user-authentication-i