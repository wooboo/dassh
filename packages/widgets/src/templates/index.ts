// Widget templates for common use cases
export const widgetTemplates = {
  dashboard: "Dashboard Template",
  analytics: "Analytics Template",
  monitoring: "Monitoring Template"
} as const;

export type WidgetTemplateType = keyof typeof widgetTemplates;