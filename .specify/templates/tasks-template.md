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
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Contract test POST /api/users in tests/contract/test_users_post.py
- [ ] T005 [P] Contract test GET /api/users/{id} in tests/contract/test_users_get.py
- [ ] T006 [P] Integration test user registration in tests/integration/test_registration.py
- [ ] T007 [P] Integration test auth flow in tests/integration/test_auth.py
- [ ] T008 [P] Accessibility test WCAG 2.1 AA compliance in tests/accessibility/test_wcag.py
- [ ] T009 [P] Responsive design test cross-device validation in tests/responsive/test_breakpoints.py
- [ ] T010 [P] Widget architecture test webhook interfaces in tests/widget/test_webhook_contract.py

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T011 [P] User model in src/models/user.py
- [ ] T012 [P] UserService CRUD in src/services/user_service.py
- [ ] T013 [P] CLI --create-user in src/cli/user_commands.py
- [ ] T014 POST /api/users endpoint
- [ ] T015 GET /api/users/{id} endpoint
- [ ] T016 Input validation with security sanitization
- [ ] T017 Error handling and logging
- [ ] T018 [P] Widget base class with webhook interface in src/widgets/base_widget.py

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
- Tests (T004-T010) before implementation (T011-T018)
- T011 blocks T012, T019
- T020 blocks T022
- Implementation before polish (T025-T030)

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