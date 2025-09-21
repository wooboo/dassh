<!--
SYNC IMPACT REPORT - Constitution Amendment v2.8.0

VERSION CHANGE: 2.7.0 → 2.8.0 (MINOR version bump)
RATIONALE: Refined TDD requirements to focus on business logic and complex logic while reducing infrastructure testing overhead. Updated development workflow to acknowledge VS Code terminal limitations and need for user-driven testing of web applications.

MODIFIED PRINCIPLES:
- No core principles changed

MODIFIED SECTIONS:
- Test-Driven Development: Scoped TDD to business rules and complex logic rather than comprehensive infrastructure testing
- Development Standards: Added acknowledgment of VS Code terminal limitations and user-driven testing requirements
- Code Quality Gates: Adjusted testing requirements to focus on critical logic validation

ADDED SECTIONS:
- Development Environment Constraints: Acknowledged VS Code terminal limitations requiring user-driven application testing
- Selective TDD Application: Defined specific contexts where TDD is required vs recommended vs optional

REMOVED SECTIONS:
- None - refinement of existing sections

TEMPLATES REQUIRING UPDATES:
⚠ plan-template.md - Needs updated TDD approach focusing on business logic
⚠ tasks-template.md - Needs refined testing categorization (required vs recommended)
⚠ .github/copilot-instructions.md - Needs updated testing guidance for business logic focus

FOLLOW-UP TODOS:
- Update task templates to categorize TDD by complexity and business criticality
- Add guidance for user-driven testing workflows in VS Code environment
- Update development patterns to emphasize business logic validation over infrastructure testing
-->

# Dassh Project Constitution

## Core Principles

### I. Accessibility-First Design
Every feature MUST be accessible to users with disabilities from the outset. Accessibility is not an afterthought but a core design principle that drives implementation decisions. All user interfaces must comply with WCAG 2.1 AA standards, provide keyboard navigation, screen reader compatibility, and proper semantic markup.

### II. Responsive Excellence
The dashboard application MUST work seamlessly across all device types and screen sizes. Mobile-first design principles are mandatory: start with mobile constraints, then enhance for larger screens. Touch interactions, thumb-friendly tap targets, and appropriate content prioritization are required for all widgets and interfaces.

### III. Widget-Centric Architecture (NON-NEGOTIABLE)
Every dashboard component starts as a standalone, reusable widget. The platform MUST provide both prebuilt widgets for common use cases and a template-driven system for users to define custom widgets. All widgets must be self-contained, independently testable, and expose standardized webhook interfaces for real-time updates.

**Template-Driven Widget Creation**: Users MUST be able to define custom widgets through a template system with placeholder-based data mapping. Widget templates must support dynamic data binding from webhook payloads, allowing users to map external data to visual components without code changes. Template syntax must be intuitive, secure (no arbitrary code execution), and support common data transformations.

**Prebuilt Widget Library**: The platform MUST include a curated collection of common widgets (charts, metrics, alerts, status indicators) that serve as both functional components and reference implementations. Prebuilt widgets must demonstrate best practices for template design, webhook integration, and accessibility compliance.

**Webhook Data Mapping**: All widgets MUST support webhook-driven data updates through standardized JSON payload mapping. Users must be able to define how webhook data maps to widget properties using placeholder syntax (e.g., `{{data.temperature}}`, `{{status.level}}`). Data mapping must include validation, type conversion, and fallback values for robust real-time updates.

### IV. Security by Design
Security considerations are integrated into every layer of the application. All data transmission must be encrypted, webhook endpoints must include authentication and rate limiting, user input must be validated and sanitized, and the application must follow OWASP security guidelines. No security feature can be deferred to "later phases."

### V. Visual Design Excellence
The application must be visually appealing and maintain consistent design language across all components. User interface design decisions are driven by usability principles, aesthetic coherence, and brand consistency. Every widget and interface element must contribute to an overall polished, professional appearance.

## Platform Requirements
<!-- Web application platform standards and technical constraints -->

**Web Platform Standards**: The application is a web-based dashboard that must function in modern browsers (Chrome 100+, Firefox 100+, Safari 15+, Edge 100+). Progressive Web App (PWA) capabilities are required for improved mobile experience and offline functionality where applicable.

**Technology Stack Requirements**: 
- **Frontend Framework**: Next.js MUST be used for the frontend application, providing server-side rendering, routing, and optimization capabilities
- **Component Library**: shadcn/ui MUST be used for consistent, accessible UI components that align with design system requirements
- **API Communication**: oRPC MUST be used for type-safe communication between frontend and backend, providing end-to-end TypeScript type safety with OpenAPI standards compliance, auto-completion, runtime validation, and seamless Next.js App Router integration
- **Rapid Development**: v0 MAY be used for initial UI prototyping and component generation to accelerate development, but all generated code must be reviewed and refined to meet constitutional standards
- **Real-time Communication**: WebSocket connections MUST be implemented for real-time widget updates and dashboard synchronization
- **Authentication**: Kinde MUST be used as the authentication framework, providing secure user management, session handling, and integration with widget security requirements
- **Database**: PostgreSQL MUST be used as the primary database engine, providing ACID compliance, advanced data types, and scalable performance
- **ORM**: Drizzle ORM MUST be used for database access, providing type-safe queries, schema management, and migration capabilities
- **Package Manager**: pnpm MUST be used for package management, providing efficient dependency resolution, disk space optimization, and deterministic builds
- **Monorepo Management**: Turborepo MUST be used for monorepo orchestration, providing build caching, task scheduling, and workspace dependency management

**Performance Standards**: Initial page load must complete within 3 seconds on 3G networks. Widget rendering must be smooth at 60fps. Real-time webhook updates must have <100ms latency for local network connections. WebSocket connections must maintain sub-50ms message delivery for dashboard updates. Database queries must be optimized for sub-100ms response times with proper indexing and connection pooling.

**Data Persistence Requirements**: All persistent data MUST be stored in PostgreSQL with Drizzle ORM providing the data access layer. Database schemas must be version-controlled through Drizzle migrations. All database operations must use type-safe queries with proper error handling. Connection pooling and query optimization are mandatory for production deployments. Database transactions must maintain ACID properties for data integrity.

**Rapid Development Standards**: v0 MAY be used for initial UI component prototyping to accelerate development cycles. All v0-generated code MUST be reviewed for accessibility compliance, security standards, and performance optimization before integration. Generated components must be refactored to align with shadcn/ui standards and widget architecture requirements. AI-generated code must undergo the same quality gates as manually written code.

**Integration Requirements**: Each widget must expose RESTful webhook endpoints following OpenAPI 3.0 specification. Widget-to-backend communication MUST use oRPC procedures and handlers for type-safe API calls with shared TypeScript types and automatic OpenAPI generation. External systems must be able to update widget state through standardized JSON payloads using placeholder-based template mapping. Widget templates must support real-time data binding with validation and type safety. Widget-to-widget communication must use event-driven patterns. All real-time updates must flow through WebSocket channels with proper authentication via Kinde tokens. Backend API endpoints must be organized as oRPC routers with proper input validation using Zod schemas, error handling, and automatic type inference.

## Development Standards
<!-- Quality gates and development workflow requirements -->

**Development Environment Constraints**: The application is a web-based dashboard requiring user interaction for complete testing. VS Code terminal limitations require coordination between agent and user for application startup, testing, and multiple terminal operations. When development requires running the application, agents must request user assistance. Terminal operations requiring background processes (like `pnpm dev`) must be handled by the user or require additional terminal instances.

**Monorepo Architecture**: The project MUST be organized as a monorepo using Turborepo for workspace orchestration and pnpm for package management. Each package within the monorepo must have clear boundaries, defined dependencies, and independent testing capabilities. Shared libraries and utilities must be properly versioned and documented.

**Package Management Standards**: All packages must be managed through pnpm workspaces with proper dependency hoisting and version consistency. Build artifacts must be cached using Turborepo's distributed caching system. Cross-package dependencies must be explicitly declared and version-pinned for stability.

**API Development Standards**: All backend API endpoints MUST be implemented using oRPC procedures and handlers for type-safe communication between frontend and backend with automatic OpenAPI generation. oRPC procedures must include proper input validation using Zod schemas, error handling with typed errors, and authentication middleware integration. API types must be shared between frontend and backend through oRPC's automatic type inference and contract-first approach. All oRPC routers must be organized by feature domain with clear separation of concerns, supporting both RPC-style calls and RESTful HTTP methods.

**Database Development Standards**: All database schemas MUST be defined using Drizzle ORM schema definitions with TypeScript types. Database migrations must be version-controlled and tested before deployment. All database queries must use Drizzle's type-safe query builder. Database seeds and test data must be managed through dedicated migration files. Connection management must use environment-specific configuration with proper secret handling.

**Rapid Prototyping Standards**: When using v0 for UI development, generated components MUST be treated as initial prototypes requiring refinement. All v0 output must be manually reviewed for constitutional compliance before integration. Components must be refactored to use proper shadcn/ui patterns, accessibility features, and responsive design principles. Generated code must be optimized for performance and security before production deployment.

**Selective Test-Driven Development**: TDD is applied selectively based on code complexity and business criticality rather than universally across all development.

**TDD REQUIRED for**:
- **Business Logic**: User authentication flows, data validation rules, widget template processing, webhook data mapping, payment/billing logic, user permission systems
- **Complex Algorithms**: Data transformation pipelines, real-time aggregation logic, security encryption/decryption, performance-critical calculations
- **Integration Points**: External API integrations, database transaction logic, authentication middleware, webhook processing endpoints

**TDD RECOMMENDED for**:
- **Core Services**: Database service layers, API route handlers, utility functions with multiple use cases
- **Widget Components**: Custom widget business logic, data binding validation, template rendering logic

**TDD OPTIONAL for**:
- **Infrastructure Setup**: Environment configuration, build scripts, development tooling, basic CRUD operations
- **Simple UI Components**: Static components, basic form layouts, styling implementations
- **Configuration Files**: TypeScript configs, ESLint rules, package.json setup

All TDD implementations must include widget contract tests, accessibility validation, oRPC type safety verification, and database integration validation. Tests must be executable independently and provide clear failure messages for debugging.

**Code Quality Gates**: All code must pass ESLint/TSLint checks, accessibility audits (axe-core), responsive design validation across device breakpoints, oRPC type safety validation, and security scanning. Widget APIs and template schemas must be documented with OpenAPI specifications automatically generated by oRPC. oRPC router schemas must be validated for proper input/output types, error handling, and OpenAPI compliance. Database schemas must be validated for proper relationships, constraints, and indexing. Widget templates must be validated for security (no code injection), performance (efficient data mapping), and usability (clear placeholder syntax). AI-generated code from v0 must pass the same quality gates as manually written code with additional review for optimization and standards compliance. Monorepo builds must maintain sub-second change detection and efficient rebuilds.

**Review Process**: Feature development requires accessibility review, security review, responsive design validation, widget template validation, oRPC API design review, database schema review, and AI-generated code review. All PRs must include test evidence for accessibility compliance, cross-device functionality, template security, oRPC type safety, and database integrity. Database changes must include migration scripts and rollback procedures. v0-generated components must be documented with refinement notes and constitutional compliance verification. Widget templates must be reviewed for placeholder syntax clarity, data mapping accuracy, and webhook integration safety. oRPC procedures must be reviewed for type safety, error handling completeness, OpenAPI specification quality, and authentication integration. Monorepo changes must validate cross-package impact and maintain workspace integrity.

## Governance

Constitution supersedes all other development practices and guidelines. Any deviation from these principles requires explicit justification, approval from project maintainers, and documentation of alternative approach. 

**Amendment Process**: Constitutional changes require consensus among maintainers, must include impact assessment on existing widgets and features, and must maintain backward compatibility for widget APIs, template schemas, oRPC procedure interfaces, and database schemas unless superseded by security requirements.

**Compliance Verification**: All pull requests must verify compliance with accessibility standards, responsive design requirements, security guidelines, widget architecture principles, template system standards, oRPC type safety requirements, database development standards, and rapid prototyping quality standards. Database changes must pass migration validation and schema integrity checks. AI-generated components must pass constitutional compliance review and refinement verification. Widget templates must pass security validation, placeholder syntax verification, and webhook integration testing. oRPC procedures must pass type safety validation, error handling verification, OpenAPI schema validation, and authentication integration testing. Use project documentation and development guides for detailed implementation guidance.

**Version**: 2.8.0 | **Ratified**: 2025-09-19 | **Last Amended**: 2025-09-21