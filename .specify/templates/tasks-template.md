# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting, widget template system, database setup, v0 configuration
   → Tests: contract tests, integration tests, widget template validation, database tests, v0 component validation
   → Core: models, services, CLI commands, widget templates, database migrations, v0 component refinement
   → Integration: DB, middleware, logging, webhook data mapping
   → Polish: unit tests, performance, docs, widget template documentation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
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
- [ ] T001 Initialize monorepo with pnpm workspace configuration and Turborepo setup
- [ ] T002 Create workspace structure: apps/, packages/, tools/ directories
- [ ] T003 [P] Configure Turborepo build pipeline and caching in turbo.json
- [ ] T004 [P] Setup Next.js dashboard app in apps/dashboard/ with TypeScript
- [ ] T005 [P] Initialize shared UI package in packages/ui/ with shadcn/ui components
- [ ] T006 [P] Configure ESLint, Prettier, and Tailwind CSS in tools/config/
- [ ] T007 [P] Setup Kinde authentication configuration in packages/shared/auth/
- [ ] T008 [P] Setup PostgreSQL database with Drizzle ORM in packages/shared/database/
- [ ] T009 [P] Configure database connection and migration scripts in packages/shared/database/migrations/
- [ ] T010 [P] Setup v0 workspace configuration for rapid UI prototyping
- [ ] T011 [P] Configure WebSocket infrastructure in packages/shared/websocket/
- [ ] T012 [P] Setup shared TypeScript configuration in tools/tsconfig/

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T013 [P] Contract test POST /api/users in apps/dashboard/tests/contract/test_users_post.ts
- [ ] T014 [P] Contract test GET /api/users/{id} in apps/dashboard/tests/contract/test_users_get.ts
- [ ] T015 [P] Database integration test user CRUD operations in packages/shared/tests/database/test_user_crud.ts
- [ ] T016 [P] Database migration test schema versioning in packages/shared/tests/database/test_migrations.ts
- [ ] T017 [P] v0 component validation test constitutional compliance in packages/ui/tests/v0/test_component_compliance.ts
- [ ] T018 [P] Integration test user registration in apps/dashboard/tests/integration/test_registration.ts
- [ ] T019 [P] Integration test Kinde auth flow in packages/shared/tests/auth/test_auth.ts
- [ ] T020 [P] Accessibility test WCAG 2.1 AA compliance in packages/ui/tests/accessibility/test_wcag.ts
- [ ] T021 [P] Responsive design test cross-device validation in packages/ui/tests/responsive/test_breakpoints.ts
- [ ] T022 [P] Widget architecture test webhook interfaces in packages/widgets/tests/test_webhook_contract.ts
- [ ] T023 [P] WebSocket communication test real-time updates in packages/shared/tests/websocket/test_realtime.ts
- [ ] T024 [P] Monorepo build test Turborepo pipeline validation in tests/integration/test_build_pipeline.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T025 [P] Database schema definition with Drizzle ORM in packages/shared/src/database/schema.ts
- [ ] T026 [P] User model with TypeScript interfaces in packages/shared/src/models/user.ts
- [ ] T027 [P] Database service layer with Drizzle queries in packages/shared/src/services/database_service.ts
- [ ] T028 [P] v0 component generation and constitutional refinement in packages/ui/src/components/
- [ ] T029 [P] UserService CRUD with database integration in packages/shared/src/services/user_service.ts
- [ ] T030 [P] shadcn/ui component library integration in packages/ui/src/components/
- [ ] T031 POST /api/users endpoint with Next.js API routes in apps/dashboard/src/pages/api/users/
- [ ] T032 GET /api/users/{id} endpoint with Next.js API routes in apps/dashboard/src/pages/api/users/[id].ts
- [ ] T033 Database migration scripts with Drizzle migrate in packages/shared/src/database/migrations/
- [ ] T034 Input validation with Zod schema validation in packages/shared/src/validation/
- [ ] T035 Error handling and logging with Next.js error boundaries in apps/dashboard/src/components/error/
- [ ] T036 [P] Widget base class with webhook interface in packages/widgets/src/base_widget.tsx
- [ ] T037 [P] Kinde authentication integration in packages/shared/src/auth/kinde_config.ts
- [ ] T038 [P] WebSocket client/server implementation in packages/shared/src/websocket/

## Phase 3.4: Verification & Integration
- [ ] T039 Run database migrations with pnpm db:migrate in workspace root
- [ ] T040 Run end-to-end tests with pnpm test in workspace root
- [ ] T041 Verify API response schemas match frontend models in packages/shared/
- [ ] T042 Validate v0-generated components meet constitutional standards in packages/ui/
- [ ] T043 Confirm database queries are optimized with proper indexing in packages/shared/database/
- [ ] T044 Confirm shadcn/ui component variants and styling in packages/ui/
- [ ] T045 Validate authentication flow with Kinde integration in packages/shared/src/auth/
- [ ] T046 Test WebSocket connectivity across all widgets in packages/widgets/
- [ ] T047 Performance testing with Lighthouse CI in apps/dashboard/
- [ ] T048 Database performance testing with query analysis in packages/shared/database/
- [ ] T049 Security audit with Next.js security headers in apps/dashboard/next.config.js
- [ ] T050 Code review with TypeScript strict mode in workspace configuration

## Phase 3.5: Polish
- [ ] T025 [P] Unit tests for validation in tests/unit/test_validation.py
- [ ] T026 Performance tests (<200ms widget render, <100ms webhook response)
- [ ] T027 [P] Update docs/api.md with widget webhook specifications
- [ ] T028 Remove duplication
- [ ] T029 Run manual-testing.md with accessibility and responsive validation
- [ ] T030 [P] Visual design consistency audit in tests/visual/test_design_system.py

## Dependencies
- Setup (T001-T005) before tests (T006-T013)
- Tests (T006-T013) before implementation (T014-T023)
- T014 blocks T015, T017-T018
- T022 (Kinde) blocks authentication-dependent features
- T023 (WebSocket) blocks real-time features
- Implementation before polish (T024-T033)

## Parallel Example
```
# Launch T004-T010 together:
Task: "Contract test POST /api/users in tests/contract/test_users_post.py"
Task: "Contract test GET /api/users/{id} in tests/contract/test_users_get.py"
Task: "Integration test registration in tests/integration/test_registration.py"
Task: "Integration test auth in tests/integration/test_auth.py"
Task: "Accessibility test WCAG 2.1 AA compliance in tests/accessibility/test_wcag.py"
Task: "Responsive design test cross-device validation in tests/responsive/test_breakpoints.py"
Task: "Widget architecture test webhook interfaces in tests/widget/test_webhook_contract.py"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution
   - Constitutional compliance tests (accessibility, responsive, widget architecture) are mandatory

5. **Constitutional Compliance**:
   - Accessibility tests mandatory for all UI components
   - Responsive design validation across device breakpoints
   - Widget webhook interface testing required
   - Security validation for all endpoints

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
- [ ] Accessibility tests included for all UI components
- [ ] Responsive design validation tasks present
- [ ] Widget architecture compliance verified
- [ ] Security validation tasks included