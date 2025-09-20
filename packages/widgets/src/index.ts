// Widget base types and interfaces
export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  description?: string;
  settings: Record<string, any>;
}

export interface WidgetProps {
  config: WidgetConfig;
  data?: any;
  onUpdate?: (data: any) => void;
  isEditing?: boolean;
}

export interface WidgetMeta {
  type: string;
  name: string;
  description: string;
  category: string;
  settings: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'select';
      label: string;
      defaultValue?: any;
      options?: string[];
    };
  };
}

// Base widget class
export abstract class BaseWidget {
  abstract type: string;
  abstract meta: WidgetMeta;
  
  constructor(public config: WidgetConfig) {}
  
  abstract render(props: WidgetProps): any;
  abstract validateSettings(settings: Record<string, any>): boolean;
}

// Export specific modules
export * from "./prebuilt";
export * from "./templates";