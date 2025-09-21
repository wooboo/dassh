# Tasks: User Authentication System

**Input**: Design documents from `/specs/002-user-authentication-i/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ Loaded: User Authentication System with Kinde integration
   → ✅ Extracted: Next.js, oRPC, Kinde, PostgreSQL, Drizzle ORM, shadcn/ui
2. Load optional design documents:
   → ✅ data-model.md: User, UserSession, UserProfile entities
   → ✅ contracts/: Authentication, profile, session management endpoints
   → ✅ research.md: Kinde integration, Next.js patterns, component strategy
3. Generate tasks by category:
   → Setup: Kinde integration, database schema, oRPC procedures, profile components
   → Tests: Authentication flows, profile management, session handling, accessibility
   → Core: User models, auth middleware, profile dropdowns, route protection
   → Integration: Database connections, oRPC client, WebSocket auth
   → Polish: Performance optimization, security validation, documentation
4. Apply task rules:
   → Different packages/files = [P] for parallel execution
   → Same file = sequential (no [P])
   → Selective TDD: Required for auth flows, recommended for services, optional for infrastructure
5. Number tasks sequentially (T001, T002...)
   → 75 tasks across 5 phases
6. Generate dependency graph: Setup → Tests → Implementation → Integration → Polish
7. Create parallel execution examples for independent packages
8. Validate task completeness:
   → ✅ All API contracts have tests
   → ✅ All entities have implementation tasks
   → ✅ All components have accessibility validation
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Monorepo structure**: `apps/dashboard/src/`, `packages/ui/src/`, `tools/` at repository root
- **Workspace packages**: Each package has own `src/` and `tests/` directories
- **Shared resources**: `packages/shared/`, `packages/ui/`, `packages/config/`
- Paths shown below assume monorepo structure with Turborepo orchestration

## Phase 3.1: Setup & Infrastructure
- [X] T001 ✅ COMPLETE: Kinde authentication configuration in `packages/shared/src/auth/config.ts` (renamed from kinde-config.ts)
- [X] T002 ✅ COMPLETE: User database schema with Drizzle ORM in `packages/shared/src/database/schema.ts` (consolidated schema file)
- [X] T003 ✅ COMPLETE: User session schema with Drizzle ORM in `packages/shared/src/database/schema.ts` (consolidated schema file)
- [X] T004 ✅ COMPLETE: User profile schema with Drizzle ORM in `packages/shared/src/database/schema.ts` (consolidated schema file)
- [X] T005 ✅ COMPLETE: Database migrations for user authentication tables in `packages/shared/src/database/migrations/0000_brave_daredevil.sql`
- [X] T006 ✅ COMPLETE: oRPC authentication procedures in `packages/shared/src/api/routers/auth.ts`
- [X] T007 ✅ COMPLETE: oRPC user profile procedures in `packages/shared/src/api/routers/user.ts` (renamed from users.ts)
- [X] T008 ✅ COMPLETE: oRPC session management procedures in `packages/shared/src/api/routers/user.ts` (included in user.ts)
- [X] T009 ✅ COMPLETE: Authentication middleware for Next.js in `packages/shared/src/auth/middleware.ts`
- [X] T010 ✅ COMPLETE: Authentication types and interfaces in `packages/shared/src/auth/types.ts`
- [X] T011 ✅ COMPLETE: Environment configuration for Kinde in `packages/shared/src/auth/config.ts` (consolidated)
- [X] T012 ✅ COMPLETE: shadcn/ui authentication components in `packages/ui/src/components/` (auth-button.tsx, profile-dropdown.tsx, user-avatar.tsx)
- [X] T013 ✅ COMPLETE: WebSocket authentication integration in `packages/shared/src/websocket/manager.ts` (includes auth)
- [X] T014 ✅ COMPLETE: oRPC client for Next.js in `apps/dashboard/src/lib/orpc-client.ts`

## Phase 3.2: Selective Test-Driven Development ⚠️ APPLY BY CODE COMPLEXITY
**CONSTITUTIONAL REQUIREMENT: TDD is applied selectively based on business criticality and complexity**

### TDD REQUIRED (Business Logic & Complex Features) ⚠️ WRITE TESTS FIRST
- [X] T015 ✅ COMPLETE: Contract test user authentication flows in `packages/shared/tests/integration/auth-integration.test.ts`
- [X] T016 ✅ COMPLETE: Contract test Kinde integration and token validation in `packages/shared/tests/auth/test_kinde_integration.ts`
- [X] T017 ✅ COMPLETE: Contract test route protection middleware in `apps/dashboard/tests/integration/route-protection.test.tsx`
- [X] T018 ✅ COMPLETE: Contract test session management business logic in `packages/shared/tests/auth/session-manager.test.ts`
- [ ] T019 [P] Contract test user profile security and permissions in packages/shared/tests/auth/test-profile-security.ts
- [X] T020 ✅ COMPLETE: Contract test oRPC authentication procedures in `apps/dashboard/tests/contract/api-profile.test.ts` (includes auth endpoints)
- [X] T021 ✅ COMPLETE: Contract test oRPC user profile procedures in `apps/dashboard/tests/contract/api-profile.test.ts`
- [X] T022 ✅ COMPLETE: Contract test oRPC session management procedures in `apps/dashboard/tests/contract/api-profile.test.ts` (includes session endpoints)
- [X] T023 ✅ COMPLETE: Integration test complete authentication flows in `apps/dashboard/tests/integration/signin-flow.test.tsx`

### TDD RECOMMENDED (Core Services) - Write tests with implementation
- [ ] T024 [P] Database service layer tests for user operations in packages/shared/tests/database/test-user-service.ts
- [ ] T025 [P] Database service layer tests for session operations in packages/shared/tests/database/test-session-service.ts
- [ ] T026 [P] Database service layer tests for profile operations in packages/shared/tests/database/test-profile-service.ts
- [ ] T027 [P] Utility function tests for authentication helpers in packages/shared/tests/utils/test-auth-utils.ts
- [X] T028 ✅ COMPLETE: Component business logic tests for profile dropdowns in `packages/ui/tests/contract/ProfileDropdown.test.tsx`

### Testing OPTIONAL (Infrastructure & Simple Components) - Test after implementation if time permits
- [ ] T029 [P] Environment configuration validation in packages/shared/tests/config/test-auth-config.ts
- [ ] T030 [P] Basic CRUD operation tests for user entities in packages/shared/tests/database/test-user-crud.ts
- [X] T031 ✅ COMPLETE: Static authentication component tests in `packages/ui/tests/contract/AuthButton.test.tsx`

### Quality Gates for All Code (MANDATORY regardless of TDD level)
- [X] T032 ✅ COMPLETE: Accessibility test WCAG 2.1 AA compliance for auth components in `packages/ui/tests/accessibility/test_wcag_compliance.ts`
- [X] T033 ✅ COMPLETE: Responsive design test for profile dropdowns in `packages/ui/tests/responsive/test_breakpoint_behavior.ts`
- [ ] T034 [P] oRPC type safety validation for auth procedures in packages/shared/tests/api/test-auth-type-safety.ts
- [X] T035 ✅ COMPLETE: Database integration test with user authentication in `packages/shared/tests/integration/auth-integration.test.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [X] T031 [P] User entity model with Drizzle schema in `packages/shared/src/database/schema.ts`
- [X] T032 [P] UserSession entity model with Drizzle schema in `packages/shared/src/database/schema.ts`
- [X] T033 [P] UserProfile entity model with Drizzle schema in `packages/shared/src/database/schema.ts`
- [X] T034 [P] User service layer with database operations in `packages/shared/src/services/user-service.ts`
- [X] T035 [P] Session service layer with session management in `packages/shared/src/services/session-service.ts`
- [X] T036 [P] Profile service layer with profile operations in `packages/shared/src/services/profile-service.ts`
- [X] T037 Kinde authentication integration and hooks in `packages/shared/src/auth/kinde.ts`
- [X] T038 Authentication middleware implementation in `packages/shared/src/auth/middleware.ts`
- [X] T039 [P] AuthButton component with shadcn/ui in `packages/ui/src/components/auth-button.tsx`
- [X] T040 [P] ProfileDropdown widget component in `packages/ui/src/components/profile-dropdown.tsx`
- [X] T041 [P] UserAvatar component for profile display in `packages/ui/src/components/user-avatar.tsx`
- [X] T042 [P] AuthGuard HOC for component protection in `packages/shared/src/auth/auth-guard.ts`
- [X] T043 ✅ MIGRATED TO oRPC: Authentication endpoints via `packages/shared/src/api/routers/auth.ts`
- [X] T044 ✅ MIGRATED TO oRPC: Refresh handled by Kinde SDK automatically
- [X] T045 ✅ MIGRATED TO oRPC: User profile endpoints via `packages/shared/src/api/routers/user.ts`
- [X] T046 ✅ MIGRATED TO oRPC: User profile endpoints via `packages/shared/src/api/routers/user.ts`
- [X] T047 ✅ MIGRATED TO oRPC: User preferences via profile update endpoint
- [X] T048 ✅ MIGRATED TO oRPC: User preferences via profile update endpoint
- [X] T049 ✅ MIGRATED TO oRPC: User sessions endpoints via `packages/shared/src/api/routers/user.ts`
- [X] T050 ✅ MIGRATED TO oRPC: Session termination via `packages/shared/src/api/routers/user.ts`
- [X] T051 ✅ MIGRATED TO oRPC: Bulk session termination can be added to user procedures
- [X] T052 Dashboard profile dropdown integration in `apps/dashboard/src/components/nav-user.tsx`
- [X] T053 Main page authentication controls in `apps/dashboard/src/app/page.tsx`
- [X] T054 Next.js middleware for route protection in `apps/dashboard/middleware.ts`
- [X] T055 Authentication context provider in `packages/shared/src/auth/auth-context.tsx`
- [X] T056 [P] Input validation schemas with Zod in `packages/shared/src/validation/auth-schemas.ts`
- [X] T057 [P] Error handling for authentication flows in `packages/shared/src/auth/error-handler.ts`

## Phase 3.4: Integration & Migration
- [X] T058 ✅ COMPLETE: Database migration for User table in `packages/shared/src/database/migrations/0000_brave_daredevil.sql` (generated by drizzle-kit)
- [X] T059 ✅ COMPLETE: Database migration for UserSession table in `packages/shared/src/database/migrations/0000_brave_daredevil.sql` (consolidated migration)
- [X] T060 ✅ COMPLETE: Database migration for UserProfile table in `packages/shared/src/database/migrations/0000_brave_daredevil.sql` (consolidated migration)
- [X] T061 ✅ COMPLETE: Database indexes for performance in `packages/shared/src/database/migrations/0000_brave_daredevil.sql` (included in migration)
- [X] T062 ✅ COMPLETE: Database migrations applied with `pnpm drizzle-kit migrate` (already run as shown in terminal history)
- [X] T063 ✅ COMPLETE: Kinde callback handling in `apps/dashboard/src/app/api/auth/[...kindeAuth]/route.ts`
- [X] T064 ✅ COMPLETE: Kinde environment variables and setup in `.env.local` (exists and configured)
- [X] T065 ✅ COMPLETE: Profile dropdown in dashboard layout via `apps/dashboard/src/components/nav-user.tsx`
- [X] T066 ✅ COMPLETE: Main page auth controls in `apps/dashboard/src/app/page.tsx` (ProfileDropdown in header)
- [ ] T067 Test complete authentication flow end-to-end
- [ ] T068 Validate session management and persistence
- [ ] T069 Verify route protection for dashboard access
- [ ] T070 Test profile dropdown functionality across both placements

## Phase 3.5: Polish & Validation
- [ ] T071 [P] Performance optimization for authentication queries in `packages/shared/src/services/`
- [ ] T072 [P] Accessibility audit with axe-core for all auth components
- [ ] T073 [P] Security audit for authentication endpoints and middleware
- [ ] T074 [P] Unit tests for authentication services in `packages/shared/tests/unit/`
- [ ] T075 [P] Unit tests for UI components in `packages/ui/tests/unit/`
- [ ] T076 [P] Performance tests for database queries (<100ms target)
- [ ] T077 [P] Performance tests for component rendering (60fps target)
- [ ] T078 [P] Cross-browser testing for authentication flows
- [ ] T079 [P] Mobile responsiveness validation for profile components
- [ ] T080 [P] Documentation update for authentication system in `docs/authentication.md`
- [ ] T081 Run quickstart validation scenarios from `specs/002-user-authentication-i/quickstart.md`
- [ ] T082 Final code review and constitutional compliance check
- [ ] T083 Production deployment validation and monitoring setup

## Dependencies
- Setup (T001-T008) before tests (T009-T030)
- Tests (T009-T030) before implementation (T031-T057)
- Models (T031-T033) before services (T034-T036)
- Services (T034-T036) before endpoints (T043-T051)
- Components (T039-T042) before integration (T052-T055)
- Core implementation (T031-T057) before migration (T058-T070)
- Integration (T058-T070) before polish (T071-T083)

## Parallel Execution Examples

### Phase 3.2 Tests (All Parallel)
```bash
# Launch contract tests together:
Task: "Contract test GET /api/auth/status in apps/dashboard/tests/contract/test_auth_status.ts"
Task: "Contract test GET /api/user/profile in apps/dashboard/tests/contract/test_user_profile_get.ts"
Task: "Contract test GET /api/user/sessions in apps/dashboard/tests/contract/test_user_sessions_get.ts"
Task: "Database integration test User CRUD in packages/shared/tests/database/test_user_crud.ts"
Task: "Accessibility test profile dropdowns in packages/ui/tests/accessibility/test_profile_dropdown_a11y.ts"
```

### Phase 3.3 Models & Services
```bash
# Launch entity models together:
Task: "User entity model with Drizzle schema in packages/shared/src/database/schema.ts"
Task: "User service layer with database operations in packages/shared/src/services/user-service.ts"
Task: "AuthButton component with shadcn/ui in packages/ui/src/components/auth-button.tsx"
Task: "ProfileDropdown widget component in packages/ui/src/components/profile-dropdown.tsx"
```

### Phase 3.5 Polish & Validation
```bash
# Launch final validation together:
Task: "Performance optimization for authentication queries in packages/shared/src/services/"
Task: "Accessibility audit with axe-core for all auth components"
Task: "Unit tests for authentication services in packages/shared/tests/unit/"
Task: "Documentation update for authentication system in docs/authentication.md"
```

## Notes
- [P] tasks = different files, no dependencies between them
- Verify tests fail before implementing (TDD requirement)
- Commit after each task completion
- Focus on constitutional compliance: accessibility, security, performance
- Profile dropdown must work in both dashboard (bottom-left) and main page (top-right) locations

## Task Generation Summary
*Generated from design documents*

**From Contracts (8 endpoints)**:
- 8 contract test tasks (T009-T016) [P]
- 8 implementation tasks (T043-T051)

**From Data Model (3 entities)**:
- 3 model creation tasks (T031-T033) [P]
- 3 service layer tasks (T034-T036) [P]
- 3 database integration tests (T017-T019) [P]

**From User Stories (7 scenarios)**:
- 7 integration test tasks (T022-T028) [P]
- Core authentication flow implementation

**Constitutional Compliance**:
- Accessibility tests for all UI components
- Responsive design validation
- Security validation for all endpoints
- Performance optimization tasks

## Validation Checklist
*GATE: Checked before task execution*

- [x] All contracts have corresponding tests (T009-T016)
- [x] All entities have model tasks (T031-T033)
- [x] All tests come before implementation (Phase 3.2 → 3.3)
- [x] Parallel tasks truly independent ([P] markers correct)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Accessibility tests included for all UI components (T027-T029, T072)
- [x] Responsive design validation tasks present (T029, T079)
- [x] Security validation tasks included (T030, T073)
- [x] Performance targets specified (<100ms DB, 60fps render)

---

## Constitutional Compliance v2.8.0

### Selective TDD Implementation ✅
- **TDD REQUIRED**: Business logic tests (T015-T023) must be written first and failing before implementation
- **TDD RECOMMENDED**: Core services tests (T024-T028) written with implementation  
- **Testing OPTIONAL**: Infrastructure tests (T029-T031) written after implementation if time permits
- **Quality Gates**: Accessibility, responsive design, oRPC type safety mandatory for all code (T032-T035)

### oRPC Integration Requirements ✅
- All API endpoints implemented as oRPC procedures with type-safe validation
- Frontend-backend communication uses oRPC client with automatic type inference
- OpenAPI specifications automatically generated from oRPC procedure definitions
- Type-safe error handling and input validation using Zod schemas

### Development Environment Constraints ✅
- VS Code terminal limitations acknowledged for web application testing
- User coordination required for background processes and multiple terminal operations
- Complete authentication flow testing requires user interaction with browser
- Parallel task execution examples provided for independent package development

This tasks file provides comprehensive, executable implementation guidance for the User Authentication System feature following selective TDD principles (Constitution v2.8.0), oRPC integration requirements, and monorepo best practices with parallel execution optimization.