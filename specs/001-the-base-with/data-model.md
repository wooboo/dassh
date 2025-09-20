# Data Model: Project Base Setup

**Feature**: Project Base Setup  
**Phase**: 1 - Design  
**Generated**: 2025-09-20

## Core Entities

### Workspace Package
Represents individual packages within the monorepo structure with defined boundaries and dependencies.

**Properties**:
- **name**: Package identifier (e.g., "@dassh/ui", "@dassh/shared")
- **type**: Package category (app, library, config, tool)
- **dependencies**: List of internal and external dependencies
- **version**: Semantic version for package releases
- **buildScript**: Turborepo build configuration
- **testScript**: Testing configuration and scripts

**Relationships**:
- **Depends On**: Other workspace packages (shared dependencies)
- **Used By**: Consuming packages (reverse dependencies)
- **Configured By**: Shared configuration packages

### Configuration Entity
Represents shared configuration files that enforce constitutional standards across packages.

**Properties**:
- **type**: Configuration category (typescript, eslint, prettier, tailwind)
- **scope**: Application scope (workspace, package, environment)
- **rules**: Specific configuration rules and settings
- **extends**: Base configurations or presets
- **overrides**: Package-specific configuration overrides

**Relationships**:
- **Applied To**: Workspace packages that use this configuration
- **Extends From**: Base configuration templates
- **Overridden By**: Package-specific customizations

### Development Workflow
Represents the established patterns and tooling that guide feature development.

**Properties**:
- **phase**: Development phase (setup, testing, implementation, validation)
- **tools**: Required development tools and versions
- **gates**: Quality gates and validation checkpoints
- **artifacts**: Generated files and documentation
- **validation**: Constitutional compliance verification

**Relationships**:
- **Requires**: Development tools and configurations
- **Produces**: Artifacts and documentation
- **Validates**: Constitutional compliance standards

## Package Architecture

### Apps Layer
```
apps/
├── dashboard/          # Main dashboard application
│   ├── package.json   # Next.js dependencies and scripts
│   ├── next.config.js # Next.js configuration
│   ├── tailwind.config.js # Tailwind customization
│   └── tsconfig.json  # TypeScript configuration
└── admin/             # Admin interface (future)
    └── package.json   # Admin-specific dependencies
```

### Packages Layer
```
packages/
├── ui/                # Component library
│   ├── package.json   # shadcn/ui and component dependencies
│   ├── tailwind.config.js # Design system configuration
│   └── src/components/ # Reusable UI components
├── shared/            # Shared utilities
│   ├── package.json   # Common utilities and types
│   ├── src/database/  # Database schemas and migrations
│   ├── src/auth/      # Authentication utilities
│   └── src/validation/ # Input validation schemas
├── widgets/           # Widget framework
│   ├── package.json   # Widget base classes and templates
│   ├── src/base/      # Base widget classes
│   └── src/templates/ # Widget template system
└── config/            # Shared configurations
    ├── eslint/        # ESLint configurations
    ├── typescript/    # TypeScript configurations
    └── prettier/      # Prettier configurations
```

### Tools Layer
```
tools/
├── build/             # Build and deployment scripts
├── scripts/           # Development automation
└── generators/        # Code generation tools
```

## Configuration Dependencies

### TypeScript Configuration Hierarchy
```
tools/typescript/base.json (base config)
├── apps/dashboard/tsconfig.json (app-specific)
├── packages/ui/tsconfig.json (library-specific)
├── packages/shared/tsconfig.json (utility-specific)
└── packages/widgets/tsconfig.json (widget-specific)
```

### ESLint Configuration Hierarchy
```
tools/config/eslint/base.js (constitutional rules)
├── tools/config/eslint/react.js (React-specific rules)
├── tools/config/eslint/accessibility.js (WCAG compliance)
└── package-level .eslintrc.js (package overrides)
```

### Build Dependencies (Turborepo)
```
Root turbo.json (workspace orchestration)
├── apps/dashboard (depends on: @dassh/ui, @dassh/shared)
├── packages/ui (depends on: @dassh/config)
├── packages/shared (depends on: @dassh/config)
└── packages/widgets (depends on: @dassh/ui, @dassh/shared)
```

## Development Workflow Data

### Quality Gates
```json
{
  "gates": [
    {
      "name": "Constitutional Compliance",
      "type": "validation",
      "tools": ["custom-validator"],
      "blocking": true
    },
    {
      "name": "Accessibility Testing",
      "type": "testing",
      "tools": ["axe-core", "@testing-library/jest-dom"],
      "blocking": true
    },
    {
      "name": "Type Safety",
      "type": "compilation",
      "tools": ["typescript"],
      "blocking": true
    },
    {
      "name": "Code Quality",
      "type": "linting",
      "tools": ["eslint", "prettier"],
      "blocking": true
    }
  ]
}
```

### Build Pipeline
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Security Model

### Authentication Flow
```
User Request → Kinde Authentication → JWT Token → WebSocket Auth → Widget Access
```

### Widget Security
```
Webhook Request → Authentication Check → Rate Limiting → Input Validation → Template Processing → Widget Update
```

### Data Flow Security
```
External Data → Webhook Endpoint → Authentication → Validation → Template Mapping → UI Update
```

## Performance Optimization

### Caching Strategy
- **Turborepo**: Build artifact caching across packages
- **Next.js**: Page and API route caching
- **Database**: Connection pooling and query optimization
- **Static Assets**: CDN and browser caching

### Bundle Optimization
- **Code Splitting**: Package-level and route-level splitting
- **Tree Shaking**: Unused code elimination
- **Dynamic Imports**: Lazy loading for widgets and components
- **Asset Optimization**: Image and font optimization

## Database Schema Foundation

### Core Tables (Future Implementation)
```sql
-- User management (Kinde integration)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    kinde_id VARCHAR UNIQUE NOT NULL,
    email VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Widget definitions
CREATE TABLE widgets (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    template JSONB NOT NULL,
    webhook_url VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Widget data mapping
CREATE TABLE widget_data (
    id UUID PRIMARY KEY,
    widget_id UUID REFERENCES widgets(id),
    data JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

This data model provides the foundation for constitutional compliance while supporting the widget-centric architecture and development workflow requirements.