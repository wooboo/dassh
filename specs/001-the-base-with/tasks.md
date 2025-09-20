# Tasks: Project Base Setup

**Input**: Design documents from `/specs/001-the-base-with/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ Implementation plan loaded with Next.js 15+, Node.js 22+ LTS, TypeScript 5.9+
   → Extract: Monorepo structure, constitutional tech stack, widget architecture
2. Load optional design documents:
   → ✅ data-model.md: Extract entities → Workspace Package, Configuration Entity, Development Workflow
   → ✅ contracts/: 3 files → setup-validation, build-system, component-integration tests
   → ✅ research.md: Extract decisions → Constitutional tech stack, widget foundation
3. Generate tasks by category:
   → Setup: monorepo init, Next.js 15+, shadcn/ui, Turborepo, constitutional compliance
   → Tests: 3 contract tests, integration tests, constitutional validation
   → Core: workspace packages, configuration entities, widget base classes
   → Integration: database, authentication, WebSocket, build system
   → Polish: performance testing, documentation, accessibility validation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → ✅ All 3 contracts have tests
   → ✅ All 3 entities have models
   → ✅ All constitutional requirements covered
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

## Phase 3.1: Setup
- [x] T001 Initialize monorepo with pnpm workspace configuration and Turborepo setup at repository root
- [x] T002 Create workspace structure: apps/, packages/, tools/ directories with proper .gitignore
- [x] T003 [P] Configure Turborepo build pipeline and caching in turbo.json with constitutional compliance
- [x] T004 [P] Setup shared TypeScript configuration in tools/tsconfig/base.json for TypeScript 5.9+
- [x] T005 [P] Configure ESLint with accessibility rules in tools/config/eslint/ for WCAG 2.1 AA compliance
- [x] T006 [P] Setup Prettier and Tailwind CSS configuration in tools/config/ for design system consistency
- [x] T007 [P] Create shared UI package structure in packages/ui/ with shadcn/ui foundation
- [x] T008 [P] Initialize shared utilities package in packages/shared/ for common functionality
- [x] T009 [P] Setup widgets package structure in packages/widgets/ with base widget classes
- [x] T010 [P] Configure shared config package in packages/config/ for workspace-wide settings
- [x] T011 Setup Next.js 15+ dashboard app in apps/dashboard/ with App Router and TypeScript
- [ ] T012 [P] Configure Kinde authentication setup in packages/shared/src/auth/
- [ ] T013 [P] Setup PostgreSQL with Drizzle ORM in packages/shared/src/database/
- [ ] T014 [P] Configure WebSocket infrastructure in packages/shared/src/websocket/
- [ ] T015 [P] Setup v0 workspace configuration for rapid UI prototyping with constitutional compliance

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T016 [P] Contract test: Development environment setup validation in apps/dashboard/tests/contract/test_setup_validation.ts
- [ ] T017 [P] Contract test: Turborepo build system validation in tests/integration/test_build_system.ts
- [ ] T018 [P] Contract test: shadcn/ui component integration in packages/ui/tests/contract/test_component_integration.ts
- [ ] T019 [P] Integration test: Workspace package dependency validation in packages/shared/tests/integration/test_workspace_packages.ts
- [ ] T020 [P] Integration test: Configuration entity management in packages/config/tests/integration/test_configuration_entities.ts
- [ ] T021 [P] Integration test: Development workflow automation in tools/tests/integration/test_development_workflow.ts
- [ ] T022 [P] Constitutional compliance test: Accessibility validation in packages/ui/tests/accessibility/test_wcag_compliance.ts
- [ ] T023 [P] Constitutional compliance test: Responsive design validation in packages/ui/tests/responsive/test_breakpoint_behavior.ts
- [ ] T024 [P] Constitutional compliance test: Widget architecture validation in packages/widgets/tests/contract/test_widget_architecture.ts
- [ ] T025 [P] Database integration test: PostgreSQL connection and migrations in packages/shared/tests/database/test_database_integration.ts
- [ ] T026 [P] Authentication integration test: Kinde auth flow in packages/shared/tests/auth/test_kinde_integration.ts
- [ ] T027 [P] WebSocket integration test: Real-time communication in packages/shared/tests/websocket/test_websocket_integration.ts
- [ ] T028 [P] Performance test: Build pipeline benchmarks in tests/performance/test_build_performance.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T029 [P] Implement Workspace Package entity with dependency management in packages/shared/src/models/workspace_package.ts
- [ ] T030 [P] Implement Configuration Entity with validation in packages/shared/src/models/configuration_entity.ts
- [ ] T031 [P] Implement Development Workflow entity with automation in packages/shared/src/models/development_workflow.ts
- [ ] T032 [P] Create database schema with Drizzle ORM in packages/shared/src/database/schema.ts
- [ ] T033 [P] Implement database service layer in packages/shared/src/services/database_service.ts
- [ ] T034 [P] Setup Kinde authentication service in packages/shared/src/services/auth_service.ts
- [ ] T035 [P] Implement WebSocket service for real-time updates in packages/shared/src/services/websocket_service.ts
- [ ] T036 [P] Create base widget class with webhook interface in packages/widgets/src/base/widget_base.tsx
- [ ] T037 [P] Implement widget template system in packages/widgets/src/templates/widget_template.ts
- [ ] T038 [P] Setup shadcn/ui component library integration in packages/ui/src/components/
- [ ] T039 Create Next.js dashboard app structure in apps/dashboard/src/app/ with constitutional layout
- [ ] T040 Implement dashboard API routes in apps/dashboard/src/app/api/ for widget management
- [ ] T041 [P] Create shared validation schemas with Zod in packages/shared/src/validation/
- [ ] T042 [P] Implement error handling and logging in packages/shared/src/utils/error_handling.ts
- [ ] T043 [P] Setup database migrations with Drizzle in packages/shared/src/database/migrations/
- [ ] T044 [P] Configure build scripts and development tools in tools/scripts/
- [ ] T045 [P] Implement constitutional compliance validators in packages/shared/src/validators/

## Phase 3.4: Verification & Integration
- [ ] T046 Run database migrations with pnpm db:migrate in workspace root
- [ ] T047 Verify monorepo build pipeline with pnpm build in workspace root
- [ ] T048 Test Next.js 15+ dashboard application startup with pnpm dev --filter=dashboard
- [ ] T049 [P] Validate shadcn/ui component integration and theming in packages/ui/
- [ ] T050 [P] Verify Kinde authentication flow and token handling in packages/shared/src/auth/
- [ ] T051 [P] Test WebSocket connectivity and real-time updates in packages/shared/src/websocket/
- [ ] T052 [P] Validate widget base class functionality and webhook interface in packages/widgets/
- [ ] T053 [P] Test v0 component generation and constitutional compliance refinement
- [ ] T054 Run end-to-end tests with constitutional compliance validation
- [ ] T055 [P] Performance testing with Lighthouse CI for <3s load time requirement
- [ ] T056 [P] Accessibility testing with axe-core for WCAG 2.1 AA compliance
- [ ] T057 [P] Responsive design testing across mobile, tablet, desktop breakpoints
- [ ] T058 [P] Security audit with Next.js security headers and OWASP compliance
- [ ] T059 Database performance testing with <100ms query requirement
- [ ] T060 WebSocket performance testing with <50ms latency requirement

## Phase 3.5: Polish
- [ ] T061 [P] Unit tests for workspace package models in packages/shared/tests/unit/
- [ ] T062 [P] Unit tests for configuration entities in packages/config/tests/unit/
- [ ] T063 [P] Unit tests for development workflow automation in tools/tests/unit/
- [ ] T064 [P] Performance optimization and bundle size analysis (<50KB per component)
- [ ] T065 [P] Documentation generation for API endpoints in docs/api/
- [ ] T066 [P] Widget template documentation and examples in docs/widgets/
- [ ] T067 [P] Constitutional compliance documentation in docs/constitutional/
- [ ] T068 [P] Quick start guide validation and refinement
- [ ] T069 Code review and TypeScript strict mode validation across workspace
- [ ] T070 Final constitutional compliance audit and certification

## Dependencies
- Setup (T001-T015) before tests (T016-T028)
- Tests (T016-T028) before implementation (T029-T045)
- Core implementation (T029-T045) before verification (T046-T060)
- Implementation before polish (T061-T070)

**Critical Dependencies:**
- T001 (monorepo init) blocks all other tasks
- T011 (Next.js setup) blocks T039-T040 (dashboard implementation)
- T032 (database schema) blocks T033 (database service)
- T034 (auth service) blocks authentication-dependent features
- T035 (WebSocket service) blocks real-time features
- T036-T037 (widget foundation) blocks widget-dependent features

## Parallel Example
```
# Launch T016-T028 together (TDD test writing phase):
Task: "Contract test: Development environment setup validation in apps/dashboard/tests/contract/test_setup_validation.ts"
Task: "Contract test: Turborepo build system validation in tests/integration/test_build_system.ts"
Task: "Contract test: shadcn/ui component integration in packages/ui/tests/contract/test_component_integration.ts"
Task: "Integration test: Workspace package dependency validation in packages/shared/tests/integration/test_workspace_packages.ts"
Task: "Constitutional compliance test: Accessibility validation in packages/ui/tests/accessibility/test_wcag_compliance.ts"
Task: "Constitutional compliance test: Widget architecture validation in packages/widgets/tests/contract/test_widget_architecture.ts"

# Launch T029-T038 together (Core model implementation):
Task: "Implement Workspace Package entity with dependency management in packages/shared/src/models/workspace_package.ts"
Task: "Implement Configuration Entity with validation in packages/shared/src/models/configuration_entity.ts"
Task: "Create database schema with Drizzle ORM in packages/shared/src/database/schema.ts"
Task: "Setup Kinde authentication service in packages/shared/src/services/auth_service.ts"
Task: "Create base widget class with webhook interface in packages/widgets/src/base/widget_base.tsx"
Task: "Setup shadcn/ui component library integration in packages/ui/src/components/"
```

## Notes
- [P] tasks = different files, no dependencies, can run in parallel
- Verify all tests fail before implementing (TDD principle)
- Commit after each task completion
- All tasks must maintain constitutional compliance
- Node.js 22+ LTS, Next.js 15+, TypeScript 5.9+ requirements enforced

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts** (3 files):
   - setup-validation.md → T016 setup validation test [P]
   - build-system.md → T017 build system test [P]
   - component-integration.md → T018 component integration test [P]
   
2. **From Data Model** (3 entities):
   - Workspace Package → T029 workspace package model [P]
   - Configuration Entity → T030 configuration entity model [P]
   - Development Workflow → T031 development workflow model [P]
   
3. **From Constitutional Requirements**:
   - Accessibility tests (T022-T023) for WCAG 2.1 AA compliance [P]
   - Widget architecture test (T024) for constitutional widget requirements [P]
   - Performance tests (T055-T060) for constitutional benchmarks [P]

4. **Ordering**:
   - Setup (T001-T015) → Tests (T016-T028) → Implementation (T029-T045) → Verification (T046-T060) → Polish (T061-T070)
   - Dependencies strictly enforced for constitutional compliance
   - Parallel execution maximized where files don't conflict

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All 3 contracts have corresponding test tasks (T016-T018)
- [x] All 3 entities have model implementation tasks (T029-T031)
- [x] All tests come before implementation (TDD enforced)
- [x] Parallel tasks truly independent (different file paths)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Constitutional compliance tests included (T022-T024, T055-T060)
- [x] Accessibility validation tasks present (T022, T056)
- [x] Responsive design validation included (T023, T057)
- [x] Widget architecture compliance verified (T024, T052)
- [x] Security validation tasks included (T058)
- [x] Performance benchmarks covered (T055-T060)
- [x] Latest version requirements enforced (Node.js 22+, Next.js 15+, TypeScript 5.9+)