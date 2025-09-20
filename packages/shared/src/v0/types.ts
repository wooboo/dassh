export interface V0Config {
  apiKey: string;
  projectId: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

export interface V0Component {
  id: string;
  name: string;
  description: string;
  code: string;
  preview_url?: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  props?: Record<string, any>;
}

export interface V0GenerateRequest {
  prompt: string;
  style?: "default" | "minimal" | "corporate" | "modern";
  framework?: "react" | "next";
  libraries?: string[];
  accessibility?: boolean;
  responsive?: boolean;
}

export interface V0GenerateResponse {
  success: boolean;
  component?: V0Component;
  error?: string;
  usage?: {
    tokens_used: number;
    generation_time: number;
  };
}

export interface WidgetCompatibilityCheck {
  compatible: boolean;
  issues: string[];
  suggestions: string[];
  score: number;
}

export interface V0ToWidgetTemplate {
  name: string;
  description: string;
  type: string;
  template: {
    component: string;
    props: Record<string, any>;
    style: Record<string, any>;
  };
  configSchema: Record<string, any>;
  previewData?: Record<string, any>;
}