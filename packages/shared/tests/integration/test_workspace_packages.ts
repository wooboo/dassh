import { describe, it, expect, beforeAll } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

interface WorkspacePackage {
  name: string;
  path: string;
  dependencies: string[];
  devDependencies: string[];
  peerDependencies: string[];
}

interface WorkspaceValidation {
  status: 'PASSED' | 'FAILED';
  packages: Record<string, {
    exists: boolean;
    hasPackageJson: boolean;
    dependenciesValid: boolean;
    exportsValid: boolean;
  }>;
  dependencyGraph: {
    valid: boolean;
    circularDependencies: string[];
  };
  errors?: string[];
}

describe('Workspace Package Dependency Validation', () => {
  let workspaceValidation: WorkspaceValidation;
  const projectRoot = path.resolve(process.cwd());

  beforeAll(() => {
    // TDD: Initialize with failing state (tests must fail first)
    workspaceValidation = {
      status: 'FAILED',
      packages: {},
      dependencyGraph: {
        valid: false,
        circularDependencies: []
      },
      errors: ['Workspace package validation not implemented yet']
    };
  });

  it('should validate all workspace packages exist', async () => {
    // TDD: This test MUST fail initially
    const expectedPackages = [
      { name: '@dassh/config', location: 'packages/config' },
      { name: '@dassh/shared', location: 'packages/shared' },
      { name: '@dassh/ui', location: 'packages/ui' },
      { name: '@dassh/widgets', location: 'packages/widgets' },
      { name: 'dashboard', location: 'apps/dashboard' }
    ];

    for (const pkg of expectedPackages) {
      const packagePath = path.join(projectRoot, pkg.location);
      const packageJsonPath = path.join(packagePath, 'package.json');
      
      // Check if package directory exists
      expect(fs.existsSync(packagePath)).toBe(true);
      
      // Check if package.json exists
      expect(fs.existsSync(packageJsonPath)).toBe(true);
      
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Validate package name
        expect(packageJson.name).toBe(pkg.name);
      }
    }

    // This will fail because workspaceValidation.status is set to FAILED
    expect(workspaceValidation.status).toBe('PASSED');
  });

  it('should validate package dependency declarations', async () => {
    // TDD: This test MUST fail initially
    const packageDependencies = {
      '@dassh/config': [],
      '@dassh/shared': ['@dassh/config'],
      '@dassh/ui': ['@dassh/config', '@dassh/shared'],
      '@dassh/widgets': ['@dassh/ui', '@dassh/shared'],
      'dashboard': ['@dassh/ui', '@dassh/shared', '@dassh/widgets']
    };

    for (const [pkgName, expectedDeps] of Object.entries(packageDependencies)) {
      const packageLocation = pkgName === 'dashboard' ? 'apps/dashboard' : 
                            `packages/${pkgName.replace('@dassh/', '')}`;
      const packageJsonPath = path.join(projectRoot, packageLocation, 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const actualDeps = [
          ...Object.keys(packageJson.dependencies || {}),
          ...Object.keys(packageJson.devDependencies || {})
        ].filter(dep => dep.startsWith('@dassh/'));
        
        // Check that all expected dependencies are declared
        for (const expectedDep of expectedDeps) {
          expect(actualDeps).toContain(expectedDep);
        }
      }
    }

    // This will fail because workspaceValidation is not implemented
    expect(workspaceValidation.dependencyGraph.valid).toBe(true);
  });

  it('should detect circular dependencies', async () => {
    // TDD: This test MUST fail initially
    // Build dependency graph
    const dependencyGraph = new Map<string, string[]>();
    
    const packages = ['config', 'shared', 'ui', 'widgets'];
    
    for (const pkg of packages) {
      const packageJsonPath = path.join(projectRoot, 'packages', pkg, 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const deps = [
          ...Object.keys(packageJson.dependencies || {}),
          ...Object.keys(packageJson.devDependencies || {})
        ].filter(dep => dep.startsWith('@dassh/'));
        
        dependencyGraph.set(`@dassh/${pkg}`, deps);
      }
    }

    // Check for circular dependencies using DFS
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    function hasCycle(node: string): boolean {
      if (recursionStack.has(node)) {
        return true;
      }
      if (visited.has(node)) {
        return false;
      }
      
      visited.add(node);
      recursionStack.add(node);
      
      const dependencies = dependencyGraph.get(node) || [];
      for (const dep of dependencies) {
        if (hasCycle(dep)) {
          return true;
        }
      }
      
      recursionStack.delete(node);
      return false;
    }

    let hasCircularDeps = false;
    for (const pkg of dependencyGraph.keys()) {
      if (hasCycle(pkg)) {
        hasCircularDeps = true;
        break;
      }
    }

    expect(hasCircularDeps).toBe(false);
    
    // This will fail because workspaceValidation is not implemented
    expect(workspaceValidation.dependencyGraph.circularDependencies.length).toBe(0);
  });

  it('should validate package exports', async () => {
    // TDD: This test MUST fail initially
    const packagesWithExports = ['config', 'shared', 'ui', 'widgets'];
    
    for (const pkg of packagesWithExports) {
      const packageJsonPath = path.join(projectRoot, 'packages', pkg, 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Check for proper exports configuration
        expect(packageJson.exports).toBeDefined();
        expect(packageJson.main || packageJson.exports['.']).toBeDefined();
        
        // Check for TypeScript types
        expect(packageJson.types || packageJson.exports['.']?.types).toBeDefined();
        
        // Validate that main/export files exist
        const mainFile = packageJson.main || packageJson.exports['.']?.default;
        if (mainFile) {
          const mainFilePath = path.join(projectRoot, 'packages', pkg, mainFile);
          // This might fail initially if source files don't exist
          expect(fs.existsSync(mainFilePath)).toBe(true);
        }
      }
    }

    // This will fail because workspaceValidation is not implemented
    expect(workspaceValidation.status).toBe('PASSED');
  });

  it('should validate workspace configuration', async () => {
    // TDD: This test MUST fail initially
    const workspaceConfigPath = path.join(projectRoot, 'pnpm-workspace.yaml');
    
    expect(fs.existsSync(workspaceConfigPath)).toBe(true);
    
    if (fs.existsSync(workspaceConfigPath)) {
      const workspaceConfig = fs.readFileSync(workspaceConfigPath, 'utf8');
      
      // Check that workspace includes all package directories
      expect(workspaceConfig).toContain('packages/*');
      expect(workspaceConfig).toContain('apps/*');
    }

    // Check root package.json workspace configuration
    const rootPackageJsonPath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(rootPackageJsonPath)) {
      const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
      
      // Should be private and configured for workspace
      expect(rootPackageJson.private).toBe(true);
    }

    // This will fail because workspaceValidation is not implemented
    expect(workspaceValidation.status).toBe('PASSED');
  });

  it('should validate TypeScript path mapping', async () => {
    // TDD: This test MUST fail initially
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    
    if (fs.existsSync(tsconfigPath)) {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      
      // Check for path mapping configuration
      if (tsconfig.compilerOptions?.paths) {
        const paths = tsconfig.compilerOptions.paths;
        
        // Check that workspace packages are mapped
        expect(paths['@dassh/*']).toBeDefined();
        expect(paths['@dassh/ui']).toBeDefined();
        expect(paths['@dassh/shared']).toBeDefined();
      }
    }

    // Check individual package tsconfig files
    const packages = ['config', 'shared', 'ui', 'widgets'];
    for (const pkg of packages) {
      const packageTsconfigPath = path.join(projectRoot, 'packages', pkg, 'tsconfig.json');
      
      if (fs.existsSync(packageTsconfigPath)) {
        const packageTsconfig = JSON.parse(fs.readFileSync(packageTsconfigPath, 'utf8'));
        
        // Should extend from tools/tsconfig
        expect(packageTsconfig.extends).toContain('tools/tsconfig');
      }
    }

    // This will fail because workspaceValidation is not implemented
    expect(workspaceValidation.status).toBe('PASSED');
  });

  it('should provide comprehensive workspace validation output', async () => {
    // TDD: This test MUST fail initially
    expect(workspaceValidation.status).toBe('PASSED');
    expect(workspaceValidation.dependencyGraph.valid).toBe(true);
    expect(workspaceValidation.errors?.length || 0).toBe(0);
    
    // All packages should be valid
    const packageValidations = Object.values(workspaceValidation.packages);
    expect(packageValidations.every(pkg => 
      pkg.exists && pkg.hasPackageJson && pkg.dependenciesValid && pkg.exportsValid
    )).toBe(true);
  });
});