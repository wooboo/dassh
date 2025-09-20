import type { 
  V0Config, 
  V0Component, 
  V0GenerateRequest, 
  V0GenerateResponse 
} from "./types";
import { validateV0Config, widgetGenerationDefaults } from "./config";

export class V0Client {
  private config: V0Config;

  constructor(config?: Partial<V0Config>) {
    this.config = validateV0Config(config || {});
  }

  // Generate a component using v0.dev
  async generateComponent(
    prompt: string, 
    options?: Partial<V0GenerateRequest>
  ): Promise<V0GenerateResponse> {
    try {
      const request: V0GenerateRequest = {
        prompt,
        ...widgetGenerationDefaults,
        ...options,
      };

      // For now, return a mock response since v0.dev API integration requires setup
      const mockResponse: V0GenerateResponse = {
        success: true,
        component: {
          id: `v0_${Date.now()}`,
          name: this.extractComponentName(prompt),
          description: prompt,
          code: this.generateMockComponent(prompt),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tags: ["widget", "dashboard", "v0-generated"],
        },
        usage: {
          tokens_used: prompt.length * 2,
          generation_time: 1500,
        },
      };

      return mockResponse;
    } catch (error) {
      console.error("v0 component generation failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Generation failed",
      };
    }
  }

  // Get component by ID
  async getComponent(id: string): Promise<V0Component | null> {
    try {
      // Mock implementation - would call v0.dev API
      console.log(`Fetching v0 component: ${id}`);
      return null;
    } catch (error) {
      console.error("Failed to fetch v0 component:", error);
      return null;
    }
  }

  // List user's components
  async listComponents(limit = 20, offset = 0): Promise<V0Component[]> {
    try {
      // Mock implementation - would call v0.dev API
      console.log(`Listing v0 components: limit=${limit}, offset=${offset}`);
      return [];
    } catch (error) {
      console.error("Failed to list v0 components:", error);
      return [];
    }
  }

  // Private helper methods
  private extractComponentName(prompt: string): string {
    // Extract a component name from the prompt
    const words = prompt.split(" ").slice(0, 3);
    return words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  }

  private generateMockComponent(prompt: string): string {
    // Generate a mock React component based on the prompt
    const componentName = this.extractComponentName(prompt);
    
    return `import React from 'react';

interface ${componentName}Props {
  data?: any;
  className?: string;
}

export default function ${componentName}({ data, className }: ${componentName}Props) {
  return (
    <div className={\`p-4 border rounded-lg \${className}\`}>
      <h3 className="text-lg font-semibold mb-2">${componentName}</h3>
      <p className="text-gray-600">
        Generated component for: ${prompt}
      </p>
      {data && (
        <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}`;
  }

  // Health check for v0.dev API
  async healthCheck(): Promise<boolean> {
    try {
      // Would ping v0.dev API health endpoint
      console.log("v0.dev API health check");
      return true;
    } catch (error) {
      console.error("v0.dev API health check failed:", error);
      return false;
    }
  }
}