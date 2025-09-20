<!--
SYNC IMPACT REPORT - Constitution Amendment v2.1.0

VERSION CHANGE: 2.0.0 → 2.1.0 (MINOR version bump)
RATIONALE: Added mandatory technology stack requirements - expanded platform guidance without breaking existing principles

MODIFIED PRINCIPLES:
- No core principles changed

ADDED SECTIONS:
- Technology Stack Requirements in Platform Requirements:
  * Next.js frontend framework (mandatory)
  * shadcn/ui component library (mandatory) 
  * WebSocket real-time communication (mandatory)
  * Kinde authentication framework (mandatory)
- Enhanced Performance Standards (WebSocket <50ms message delivery)
- Enhanced Integration Requirements (WebSocket channels with Kinde authentication)

REMOVED SECTIONS:
- None

TEMPLATES REQUIRING UPDATES:
✅ plan-template.md - Previously updated with constitutional compliance gates
✅ tasks-template.md - Previously updated with compliance testing
⚠ spec-template.md - Needs review for tech stack alignment (Next.js, shadcn/ui, WebSocket, Kinde)
⚠ agent-file-template.md - Needs review for tech stack requirements
⚠ plan-template.md - May need tech stack validation in Technical Context section
⚠ tasks-template.md - May need tech stack setup tasks and validation

FOLLOW-UP TODOS:
- Update templates to include Next.js, shadcn/ui, WebSocket, and Kinde setup requirements
- Ensure spec-template.md captures tech stack constraints in requirements
- Validate task templates include proper tech stack initialization tasks
- Review any existing documentation for tech stack alignment
-->

# Dassh Project Constitution

## Core Principles

### I. Accessibility-First Design
Every feature MUST be accessible to users with disabilities from the outset. Accessibility is not an afterthought but a core design principle that drives implementation decisions. All user interfaces must comply with WCAG 2.1 AA standards, provide keyboard navigation, screen reader compatibility, and proper semantic markup.

### II. Responsive Excellence
The dashboard application MUST work seamlessly across all device types and screen sizes. Mobile-first design principles are mandatory: start with mobile constraints, then enhance for larger screens. Touch interactions, thumb-friendly tap targets, and appropriate content prioritization are required for all widgets and interfaces.

### III. Widget-Centric Architecture (NON-NEGOTIABLE)
Every dashboard component starts as a standalone, reusable widget. Widgets must be self-contained, independently testable, and expose standardized webhook interfaces for real-time updates. Each widget must have clear documentation, configuration options, and integration guidelines.

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

**Performance Standards**: Initial page load must complete within 3 seconds on 3G networks. Widget rendering must be smooth at 60fps. Real-time webhook updates must have <100ms latency for local network connections. WebSocket connections must maintain sub-50ms message delivery for dashboard updates.

**Integration Requirements**: Each widget must expose RESTful webhook endpoints following OpenAPI 3.0 specification. External systems must be able to update widget state through standardized JSON payloads. Widget-to-widget communication must use event-driven patterns. All real-time updates must flow through WebSocket channels with proper authentication via Kinde tokens.

## Development Standards
<!-- Quality gates and development workflow requirements -->

**Test-Driven Development**: All new widgets and features must follow TDD principles. Tests are written first, must fail initially, then implementation makes them pass. Widget contract tests, accessibility tests, and responsive design tests are mandatory.

**Code Quality Gates**: All code must pass ESLint/TSLint checks, accessibility audits (axe-core), responsive design validation across device breakpoints, and security scanning. Widget APIs must be documented with OpenAPI specifications.

**Review Process**: Feature development requires accessibility review, security review, and responsive design validation. All PRs must include test evidence for accessibility compliance and cross-device functionality.

## Governance

Constitution supersedes all other development practices and guidelines. Any deviation from these principles requires explicit justification, approval from project maintainers, and documentation of alternative approach. 

**Amendment Process**: Constitutional changes require consensus among maintainers, must include impact assessment on existing widgets and features, and must maintain backward compatibility for widget APIs unless superseded by security requirements.

**Compliance Verification**: All pull requests must verify compliance with accessibility standards, responsive design requirements, security guidelines, and widget architecture principles. Use project documentation and development guides for detailed implementation guidance.

**Version**: 2.1.0 | **Ratified**: 2025-09-19 | **Last Amended**: 2025-09-20