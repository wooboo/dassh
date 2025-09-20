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
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
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
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create Next.js project structure with TypeScript configuration
- [ ] T002 Initialize project with Next.js, shadcn/ui, Kinde auth, and WebSocket dependencies
- [ ] T003 [P] Configure ESLint, Prettier, and Tailwind CSS
- [ ] T004 [P] Setup Kinde authentication configuration and environment variables
- [ ] T005 [P] Configure WebSocket server infrastructure for real-time communication

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test POST /api/users in tests/contract/test_users_post.ts
- [ ] T007 [P] Contract test GET /api/users/{id} in tests/contract/test_users_get.ts
- [ ] T008 [P] Integration test user registration in tests/integration/test_registration.ts
- [ ] T009 [P] Integration test Kinde auth flow in tests/integration/test_auth.ts
- [ ] T010 [P] Accessibility test WCAG 2.1 AA compliance in tests/accessibility/test_wcag.ts
- [ ] T011 [P] Responsive design test cross-device validation in tests/responsive/test_breakpoints.ts
- [ ] T012 [P] Widget architecture test webhook interfaces in tests/widget/test_webhook_contract.ts
- [ ] T013 [P] WebSocket communication test real-time updates in tests/websocket/test_realtime.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T014 [P] User model with TypeScript interfaces in src/models/user.ts
- [ ] T015 [P] UserService CRUD with Next.js API routes in src/services/user_service.ts
- [ ] T016 [P] shadcn/ui component library integration in src/components/ui/
- [ ] T017 POST /api/users endpoint with Next.js API routes
- [ ] T018 GET /api/users/{id} endpoint with Next.js API routes
- [ ] T019 Input validation with Zod schema validation
- [ ] T020 Error handling and logging with Next.js error boundaries
- [ ] T021 [P] Widget base class with webhook interface in src/widgets/base_widget.tsx
- [ ] T022 [P] Kinde authentication integration in src/auth/kinde_config.ts
- [ ] T023 [P] WebSocket client/server implementation in src/websocket/

## Phase 3.4: Integration
- [ ] T019 Connect UserService to DB
- [ ] T020 Auth middleware with rate limiting
- [ ] T021 Request/response logging
- [ ] T022 CORS and security headers
- [ ] T023 [P] Responsive CSS framework integration in src/styles/responsive.css
- [ ] T024 [P] Accessibility features (ARIA labels, keyboard nav) in src/accessibility/

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