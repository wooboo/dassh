<!--
SYNC IMPACT REPORT - Constitution Amendment v2.5.0

VERSION CHANGE: 2.4.0 → 2.5.0 (MINOR version bump)
RATIONALE: Added rapid development capabilities with v0 for UI prototyping - expanded development workflow without breaking existing principles

MODIFIED PRINCIPLES:
- No core principles changed

ADDED SECTIONS:
- Rapid Development Tools in Platform Requirements:
  * v0 (permitted for initial UI prototyping and component generation)
  * AI-assisted development workflow integration
  * Prototyping to production transition requirements
- Enhanced Development Standards (rapid prototyping workflow standards)
- UI Development Standards (v0 integration and quality assurance)

REMOVED SECTIONS:
- None

TEMPLATES REQUIRING UPDATES:
✅ plan-template.md - Updated technical context with v0 prototyping and compliance requirements
✅ tasks-template.md - Added v0 setup, component generation, and validation tasks
✅ spec-template.md - Added rapid development considerations section
✅ PowerShell script - Already supports workspace structure

FOLLOW-UP TODOS:
- None - all template synchronization complete
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

**Integration Requirements**: Each widget must expose RESTful webhook endpoints following OpenAPI 3.0 specification. External systems must be able to update widget state through standardized JSON payloads using placeholder-based template mapping. Widget templates must support real-time data binding with validation and type safety. Widget-to-widget communication must use event-driven patterns. All real-time updates must flow through WebSocket channels with proper authentication via Kinde tokens.

## Development Standards
<!-- Quality gates and development workflow requirements -->

**Monorepo Architecture**: The project MUST be organized as a monorepo using Turborepo for workspace orchestration and pnpm for package management. Each package within the monorepo must have clear boundaries, defined dependencies, and independent testing capabilities. Shared libraries and utilities must be properly versioned and documented.

**Package Management Standards**: All packages must be managed through pnpm workspaces with proper dependency hoisting and version consistency. Build artifacts must be cached using Turborepo's distributed caching system. Cross-package dependencies must be explicitly declared and version-pinned for stability.

**Database Development Standards**: All database schemas MUST be defined using Drizzle ORM schema definitions with TypeScript types. Database migrations must be version-controlled and tested before deployment. All database queries must use Drizzle's type-safe query builder. Database seeds and test data must be managed through dedicated migration files. Connection management must use environment-specific configuration with proper secret handling.

**Rapid Prototyping Standards**: When using v0 for UI development, generated components MUST be treated as initial prototypes requiring refinement. All v0 output must be manually reviewed for constitutional compliance before integration. Components must be refactored to use proper shadcn/ui patterns, accessibility features, and responsive design principles. Generated code must be optimized for performance and security before production deployment.

**Test-Driven Development**: All new widgets and features must follow TDD principles. Tests are written first, must fail initially, then implementation makes them pass. Widget contract tests, accessibility tests, responsive design tests, template validation tests, and database integration tests are mandatory. Database tests must use isolated test databases with proper cleanup. Widget templates must include test scenarios for webhook data mapping and placeholder resolution. Tests must be runnable at both package and workspace levels.

**Code Quality Gates**: All code must pass ESLint/TSLint checks, accessibility audits (axe-core), responsive design validation across device breakpoints, and security scanning. Widget APIs and template schemas must be documented with OpenAPI specifications. Database schemas must be validated for proper relationships, constraints, and indexing. Widget templates must be validated for security (no code injection), performance (efficient data mapping), and usability (clear placeholder syntax). AI-generated code from v0 must pass the same quality gates as manually written code with additional review for optimization and standards compliance. Monorepo builds must maintain sub-second change detection and efficient rebuilds.

**Review Process**: Feature development requires accessibility review, security review, responsive design validation, widget template validation, database schema review, and AI-generated code review. All PRs must include test evidence for accessibility compliance, cross-device functionality, template security, and database integrity. Database changes must include migration scripts and rollback procedures. v0-generated components must be documented with refinement notes and constitutional compliance verification. Widget templates must be reviewed for placeholder syntax clarity, data mapping accuracy, and webhook integration safety. Monorepo changes must validate cross-package impact and maintain workspace integrity.

## Governance

Constitution supersedes all other development practices and guidelines. Any deviation from these principles requires explicit justification, approval from project maintainers, and documentation of alternative approach. 

**Amendment Process**: Constitutional changes require consensus among maintainers, must include impact assessment on existing widgets and features, and must maintain backward compatibility for widget APIs, template schemas, and database schemas unless superseded by security requirements.

**Compliance Verification**: All pull requests must verify compliance with accessibility standards, responsive design requirements, security guidelines, widget architecture principles, template system standards, database development standards, and rapid prototyping quality standards. Database changes must pass migration validation and schema integrity checks. AI-generated components must pass constitutional compliance review and refinement verification. Widget templates must pass security validation, placeholder syntax verification, and webhook integration testing. Use project documentation and development guides for detailed implementation guidance.

**Version**: 2.5.0 | **Ratified**: 2025-09-19 | **Last Amended**: 2025-09-20