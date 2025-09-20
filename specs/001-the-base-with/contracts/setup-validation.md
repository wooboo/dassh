# Development Environment Setup Contract

**Contract Type**: Setup Validation  
**Phase**: Base Setup  
**Generated**: 2025-09-20

## Contract Description
Validates that the development environment meets all constitutional requirements for the project base setup.

## Input Requirements
```typescript
interface SetupInput {
  nodeVersion: string;          // Must be >= 18.0.0
  packageManager: 'pnpm';       // Constitutional requirement
  repositoryStructure: {
    apps: string[];             // Must include 'dashboard'
    packages: string[];         // Must include 'ui', 'shared', 'widgets', 'config'
    tools: string[];           // Must include build tools
  };
}
```

## Expected Output
```typescript
interface SetupOutput {
  status: 'PASSED' | 'FAILED';
  validations: {
    nodeVersion: boolean;
    packageManager: boolean;
    monorepoStructure: boolean;
    constitutionalCompliance: boolean;
    accessibilityTools: boolean;
    testingFramework: boolean;
  };
  errors?: string[];
  warnings?: string[];
}
```

## Validation Rules

### 1. Node.js Version Check
```bash
# Command: node --version
# Expected: >= 18.0.0
# Error: "Node.js version must be 18.0.0 or higher"
```

### 2. Package Manager Validation
```bash
# Command: pnpm --version
# Expected: pnpm installed and available
# Error: "pnpm is required as constitutional package manager"
```

### 3. Monorepo Structure Validation
```typescript
const requiredStructure = {
  apps: ['dashboard'],
  packages: ['ui', 'shared', 'widgets', 'config'],
  tools: ['build', 'scripts']
};
```

### 4. Constitutional Compliance Check
- Next.js framework availability
- shadcn/ui component library setup
- Turborepo configuration
- TypeScript configuration
- ESLint with accessibility rules
- Prettier formatting

### 5. Accessibility Tooling
- axe-core testing library
- WCAG 2.1 AA compliance rules
- Keyboard navigation testing setup
- Screen reader compatibility tools

## Test Scenarios

### Success Case
```typescript
{
  input: {
    nodeVersion: "18.17.0",
    packageManager: "pnpm",
    repositoryStructure: {
      apps: ["dashboard"],
      packages: ["ui", "shared", "widgets", "config"],
      tools: ["build", "scripts", "generators"]
    }
  },
  expectedOutput: {
    status: "PASSED",
    validations: {
      nodeVersion: true,
      packageManager: true,
      monorepoStructure: true,
      constitutionalCompliance: true,
      accessibilityTools: true,
      testingFramework: true
    }
  }
}
```

### Failure Case
```typescript
{
  input: {
    nodeVersion: "16.14.0",  // Too old
    packageManager: "npm",   // Wrong package manager
    repositoryStructure: {
      apps: ["dashboard"],
      packages: ["ui"],      // Missing required packages
      tools: []              // Missing tools
    }
  },
  expectedOutput: {
    status: "FAILED",
    validations: {
      nodeVersion: false,
      packageManager: false,
      monorepoStructure: false,
      constitutionalCompliance: false,
      accessibilityTools: false,
      testingFramework: false
    },
    errors: [
      "Node.js version 16.14.0 is below required 18.0.0",
      "Package manager 'npm' does not meet constitutional requirement for 'pnpm'",
      "Missing required packages: shared, widgets, config",
      "Missing required tools directory"
    ]
  }
}
```

## Implementation Requirements

### Contract Test File Location
```
apps/dashboard/tests/contract/test_setup_validation.ts
```

### Test Implementation
```typescript
import { describe, it, expect } from '@jest/globals';

describe('Development Environment Setup Contract', () => {
  it('should validate Node.js version >= 18.0.0', async () => {
    // Test implementation
  });

  it('should require pnpm as package manager', async () => {
    // Test implementation  
  });

  it('should validate monorepo structure', async () => {
    // Test implementation
  });

  it('should verify constitutional compliance', async () => {
    // Test implementation
  });
});
```

## Dependencies
- Node.js version detection
- Package manager detection
- File system structure validation
- Constitutional requirement validation
- Accessibility tooling verification