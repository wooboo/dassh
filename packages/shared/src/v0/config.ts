import type { V0Config } from "./types";

// Default v0 configuration
export const defaultV0Config: V0Config = {
  apiKey: process.env.V0_API_KEY || "",
  projectId: process.env.V0_PROJECT_ID || "",
  baseUrl: process.env.V0_BASE_URL || "https://api.v0.dev",
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
};

// Validate v0 configuration
export const validateV0Config = (config: Partial<V0Config>): V0Config => {
  const merged = { ...defaultV0Config, ...config };
  
  if (!merged.apiKey) {
    throw new Error("V0_API_KEY environment variable is required");
  }
  
  if (!merged.projectId) {
    throw new Error("V0_PROJECT_ID environment variable is required");
  }
  
  return merged;
};

// v0 generation templates for common widget types
export const v0Templates = {
  metric: {
    prompt: "Create a metric display widget with large number, label, and trend indicator",
    style: "minimal" as const,
  },
  chart: {
    prompt: "Create a chart widget container with title and responsive chart area",
    style: "default" as const,
  },
  table: {
    prompt: "Create a data table widget with sortable columns and pagination",
    style: "default" as const,
  },
  card: {
    prompt: "Create a card widget with header, content area, and optional actions",
    style: "modern" as const,
  },
  timeline: {
    prompt: "Create a timeline widget showing events with dates and descriptions",
    style: "minimal" as const,
  },
  gauge: {
    prompt: "Create a gauge widget showing progress with percentage and color coding",
    style: "default" as const,
  },
} as const;

// Standard v0 generation options for widgets
export const widgetGenerationDefaults = {
  framework: "react" as const,
  libraries: ["tailwindcss", "lucide-react"],
  accessibility: true,
  responsive: true,
};