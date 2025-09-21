
# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context
**Language/Version**: [e.g., TypeScript 5.0+, Node.js 18+ or NEEDS CLARIFICATION]  
**Package Manager**: pnpm (CONSTITUTIONAL REQUIREMENT)  
**Monorepo Management**: Turborepo (CONSTITUTIONAL REQUIREMENT)  
**Frontend Framework**: Next.js (CONSTITUTIONAL REQUIREMENT)  
**Component Library**: shadcn/ui (CONSTITUTIONAL REQUIREMENT)  
**API Communication**: oRPC (CONSTITUTIONAL REQUIREMENT for type-safe backend communication with OpenAPI compliance)  
**Rapid Development**: v0 for UI prototyping (CONSTITUTIONAL ALLOWANCE - requires quality refinement)  
**Authentication**: Kinde (CONSTITUTIONAL REQUIREMENT)  
**Database**: PostgreSQL (CONSTITUTIONAL REQUIREMENT)  
**ORM**: Drizzle ORM (CONSTITUTIONAL REQUIREMENT)  
**Real-time Communication**: WebSocket implementation (CONSTITUTIONAL REQUIREMENT)  
**Primary Dependencies**: [e.g., React 18+, Tailwind CSS, additional libraries or NEEDS CLARIFICATION]  
**Storage**: PostgreSQL with Drizzle ORM (CONSTITUTIONAL REQUIREMENT)  
**Testing**: [e.g., Jest, Playwright, Cypress or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Modern browsers (Chrome 100+, Firefox 100+, Safari 15+, Edge 100+)]
**Project Type**: [monorepo - determines source structure]  
**Performance Goals**: [domain-specific, e.g., <3s load time, 60fps rendering, <50ms WebSocket latency, <100ms database queries or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <100ms webhook response, WCAG 2.1 AA compliance, mobile-first or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Accessibility Compliance**: Design must include WCAG 2.1 AA compliance plan, keyboard navigation support, screen reader compatibility testing approach, and semantic markup validation.

**Responsive Design Validation**: Implementation must demonstrate mobile-first design approach, touch-friendly interactions for all devices, and content prioritization strategy across breakpoints.

**Widget Architecture Adherence**: All components must be designed as standalone widgets with webhook interfaces, independent testability, and standardized configuration APIs. Widget templates must support placeholder-based data mapping from webhook payloads. Template system must be secure (no code execution), intuitive for users, and include validation for data binding.

**Security Implementation**: Design must include encryption for data transmission, webhook authentication and rate limiting, input validation strategy, and OWASP compliance measures.

**Data Persistence Compliance**: Database design must use PostgreSQL with Drizzle ORM for type-safe data access. All database schemas must be version-controlled through migrations. Database queries must be optimized with proper indexing and connection pooling.

**Rapid Development Compliance**: If using v0 for UI prototyping, all generated components must be reviewed and refined for constitutional compliance. AI-generated code must pass accessibility, security, and performance standards before integration.

**Visual Design Standards**: Interface design must demonstrate consistent design language, usability-driven decisions, and professional aesthetic coherence across all components.

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
### Source Code (repository root)
```
# Monorepo Structure (CONSTITUTIONAL REQUIREMENT)
apps/
├── dashboard/           # Main Next.js dashboard application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── widgets/
│   └── tests/
├── api/                 # Backend API application (if needed)
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   └── tests/
└── admin/              # Admin interface (if needed)
    ├── src/
    └── tests/

packages/
├── ui/                 # Shared shadcn/ui components
├── shared/             # Shared utilities and types
├── widgets/            # Reusable widget library
└── config/             # Shared configuration

tools/
├── eslint-config/      # Shared ESLint configuration
├── tsconfig/           # Shared TypeScript configuration
└── build/              # Build tools and scripts

# Workspace Configuration Files
├── package.json        # Root workspace configuration
├── pnpm-workspace.yaml # pnpm workspace definition
├── turbo.json          # Turborepo configuration
└── .gitignore
```

**Structure Decision**: Monorepo with Turborepo orchestration (CONSTITUTIONAL REQUIREMENT)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v2.7.0 - See `/memory/constitution.md`*
