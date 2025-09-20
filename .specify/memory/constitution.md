<!--
SYNC IMPACT REPORT - Constitution Amendment v2.3.0

VERSION CHANGE: 2.2.0 → 2.3.0 (MINOR version bump)
RATIONALE: Expanded Widget-Centric Architecture with template-driven widget system and webhook data mapping - significant new capability without breaking existing principles

MODIFIED PRINCIPLES:
- Widget-Centric Architecture (Principle III) → Enhanced with template-driven widget creation and webhook data mapping requirements

ADDED SECTIONS:
- Widget Template System (mandatory template-driven widget creation)
- Webhook Data Mapping Standards (placeholder-based data binding)
- Prebuilt Widget Library (curated widget collection with extensibility)

REMOVED SECTIONS:
- None

TEMPLATES REQUIRING UPDATES:
✅ plan-template.md - Updated widget architecture requirements for template system
✅ tasks-template.md - Added widget template creation and validation tasks  
✅ spec-template.md - Added widget template requirements section
✅ PowerShell script - Updated for pnpm commands and workspace structure

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
- **Real-time Communication**: WebSocket connections MUST be implemented for real-time widget updates and dashboard synchronization
- **Authentication**: Kinde MUST be used as the authentication framework, providing secure user management, session handling, and integration with widget security requirements
- **Package Manager**: pnpm MUST be used for package management, providing efficient dependency resolution, disk space optimization, and deterministic builds
- **Monorepo Management**: Turborepo MUST be used for monorepo orchestration, providing build caching, task scheduling, and workspace dependency management

**Performance Standards**: Initial page load must complete within 3 seconds on 3G networks. Widget rendering must be smooth at 60fps. Real-time webhook updates must have <100ms latency for local network connections. WebSocket connections must maintain sub-50ms message delivery for dashboard updates.

**Integration Requirements**: Each widget must expose RESTful webhook endpoints following OpenAPI 3.0 specification. External systems must be able to update widget state through standardized JSON payloads using placeholder-based template mapping. Widget templates must support real-time data binding with validation and type safety. Widget-to-widget communication must use event-driven patterns. All real-time updates must flow through WebSocket channels with proper authentication via Kinde tokens.

## Development Standards
<!-- Quality gates and development workflow requirements -->

**Monorepo Architecture**: The project MUST be organized as a monorepo using Turborepo for workspace orchestration and pnpm for package management. Each package within the monorepo must have clear boundaries, defined dependencies, and independent testing capabilities. Shared libraries and utilities must be properly versioned and documented.

**Package Management Standards**: All packages must be managed through pnpm workspaces with proper dependency hoisting and version consistency. Build artifacts must be cached using Turborepo's distributed caching system. Cross-package dependencies must be explicitly declared and version-pinned for stability.

**Test-Driven Development**: All new widgets and features must follow TDD principles. Tests are written first, must fail initially, then implementation makes them pass. Widget contract tests, accessibility tests, responsive design tests, and template validation tests are mandatory. Widget templates must include test scenarios for webhook data mapping and placeholder resolution. Tests must be runnable at both package and workspace levels.

**Code Quality Gates**: All code must pass ESLint/TSLint checks, accessibility audits (axe-core), responsive design validation across device breakpoints, and security scanning. Widget APIs and template schemas must be documented with OpenAPI specifications. Widget templates must be validated for security (no code injection), performance (efficient data mapping), and usability (clear placeholder syntax). Monorepo builds must maintain sub-second change detection and efficient rebuilds.

**Review Process**: Feature development requires accessibility review, security review, responsive design validation, and widget template validation. All PRs must include test evidence for accessibility compliance, cross-device functionality, and template security. Widget templates must be reviewed for placeholder syntax clarity, data mapping accuracy, and webhook integration safety. Monorepo changes must validate cross-package impact and maintain workspace integrity.

## Governance

Constitution supersedes all other development practices and guidelines. Any deviation from these principles requires explicit justification, approval from project maintainers, and documentation of alternative approach. 

**Amendment Process**: Constitutional changes require consensus among maintainers, must include impact assessment on existing widgets and features, and must maintain backward compatibility for widget APIs and template schemas unless superseded by security requirements.

**Compliance Verification**: All pull requests must verify compliance with accessibility standards, responsive design requirements, security guidelines, widget architecture principles, and template system standards. Widget templates must pass security validation, placeholder syntax verification, and webhook integration testing. Use project documentation and development guides for detailed implementation guidance.

**Version**: 2.3.0 | **Ratified**: 2025-09-19 | **Last Amended**: 2025-09-20