// Prebuilt widget components
export const prebuiltWidgets = {
  chart: "ChartWidget",
  counter: "CounterWidget", 
  list: "ListWidget",
  text: "TextWidget"
} as const;

export type PrebuiltWidgetType = keyof typeof prebuiltWidgets;