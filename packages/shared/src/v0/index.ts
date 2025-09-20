// v0.dev integration exports
export * from "./config";
export * from "./types";
export { V0Client } from "./client";
export { V0ComponentValidator } from "./templates/validator";
export { V0TemplateConverter } from "./templates/converter";

// Import classes for convenience functions
import { V0Client } from "./client";
import { V0ComponentValidator } from "./templates/validator";
import { V0TemplateConverter } from "./templates/converter";

// Convenience functions
export const createV0Client = (config?: any) => new V0Client(config);
export const validateV0Component = (component: any) => {
  const validator = new V0ComponentValidator();
  return validator.validateCompatibility(component);
};
export const convertV0ToWidget = async (component: any) => {
  const converter = new V0TemplateConverter();
  return converter.convertToWidgetTemplate(component);
};