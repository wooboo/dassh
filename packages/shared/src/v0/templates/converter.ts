import type { V0Component, V0ToWidgetTemplate } from "../types";
import { V0ComponentValidator } from "./validator";

export class V0TemplateConverter {
  private validator = new V0ComponentValidator();

  // Convert v0 component to widget template
  async convertToWidgetTemplate(component: V0Component): Promise<V0ToWidgetTemplate> {
    // Validate compatibility first
    const compatibility = this.validator.validateCompatibility(component);
    
    if (!compatibility.compatible) {
      throw new Error(`Component not compatible: ${compatibility.issues.join(", ")}`);
    }

    // Extract configurable properties
    const configurableProps = this.validator.extractConfigurableProps(component);

    // Generate widget template
    const template: V0ToWidgetTemplate = {
      name: component.name,
      description: component.description,
      type: this.detectWidgetType(component),
      template: {
        component: this.processComponentCode(component.code),
        props: configurableProps,
        style: this.extractStyleConfig(component.code),
      },
      configSchema: this.generateConfigSchema(configurableProps),
      previewData: this.generatePreviewData(component),
    };

    return template;
  }

  // Detect widget type from component
  private detectWidgetType(component: V0Component): string {
    const code = component.code.toLowerCase();
    const description = component.description.toLowerCase();
    
    if (code.includes("chart") || description.includes("chart")) {
      return "chart";
    }
    if (code.includes("table") || description.includes("table")) {
      return "table";
    }
    if (code.includes("metric") || description.includes("metric")) {
      return "metric";
    }
    if (code.includes("gauge") || description.includes("gauge")) {
      return "gauge";
    }
    if (code.includes("timeline") || description.includes("timeline")) {
      return "timeline";
    }
    
    return "generic";
  }

  // Process component code for widget use
  private processComponentCode(code: string): string {
    // Ensure component accepts data prop and className
    let processedCode = code;
    
    // Add data prop if missing
    if (!processedCode.includes("data")) {
      processedCode = processedCode.replace(
        /interface\s+(\w+)Props\s*{/,
        "interface $1Props {\n  data?: any;"
      );
    }

    // Ensure className is properly handled
    if (!processedCode.includes("className")) {
      processedCode = processedCode.replace(
        /\({\s*([^}]*)\s*}\)/,
        "({ $1, className }"
      );
    }

    return processedCode;
  }

  // Extract style configuration
  private extractStyleConfig(code: string): Record<string, any> {
    const styleConfig: Record<string, any> = {};

    // Extract container styles
    const containerMatch = code.match(/className=\{?["'`]([^"'`]*container[^"'`]*)["'`]\}?/);
    if (containerMatch) {
      styleConfig.container = containerMatch[1];
    }

    // Extract color scheme
    const colorMatches = code.match(/(bg-|text-|border-)([a-z]+-\d+)/g);
    if (colorMatches) {
      styleConfig.colorScheme = [...new Set(colorMatches)];
    }

    // Extract spacing
    const spacingMatches = code.match(/(p-|m-|gap-)(\d+)/g);
    if (spacingMatches) {
      styleConfig.spacing = [...new Set(spacingMatches)];
    }

    return styleConfig;
  }

  // Generate JSON schema for configuration
  private generateConfigSchema(props: Record<string, any>): Record<string, any> {
    const schema = {
      type: "object",
      properties: {} as Record<string, any>,
    };

    // Add color configuration
    if (props.colors && props.colors.length > 0) {
      schema.properties.primaryColor = {
        type: "string",
        title: "Primary Color",
        enum: props.colors,
        default: props.colors[0],
      };
    }

    // Add size configuration
    if (props.sizes && props.sizes.length > 0) {
      schema.properties.size = {
        type: "string",
        title: "Size",
        enum: ["sm", "md", "lg", "xl"],
        default: "md",
      };
    }

    // Add text configuration
    if (props.text && props.text.length > 0) {
      schema.properties.title = {
        type: "string",
        title: "Widget Title",
        default: props.text[0] || "Widget",
      };
    }

    // Always include data source configuration
    schema.properties.dataSource = {
      type: "object",
      title: "Data Source",
      properties: {
        type: {
          type: "string",
          enum: ["webhook", "api", "static"],
          default: "webhook",
        },
        url: {
          type: "string",
          title: "Data URL",
        },
      },
    };

    return schema;
  }

  // Generate preview data for testing
  private generatePreviewData(component: V0Component): Record<string, any> {
    const type = this.detectWidgetType(component);
    
    const previewData: Record<string, any> = {
      metric: {
        value: 1234,
        label: "Total Users",
        trend: "+12%",
        color: "green",
      },
      chart: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        data: [10, 25, 15, 40, 30],
        type: "line",
      },
      table: {
        headers: ["Name", "Value", "Status"],
        rows: [
          ["Item 1", "100", "Active"],
          ["Item 2", "250", "Inactive"],
          ["Item 3", "175", "Active"],
        ],
      },
      gauge: {
        value: 75,
        max: 100,
        label: "Progress",
        color: "blue",
      },
      timeline: {
        events: [
          { date: "2024-01-01", title: "Event 1", description: "First event" },
          { date: "2024-01-15", title: "Event 2", description: "Second event" },
        ],
      },
    };

    return previewData[type] || { message: "Hello, Widget!" };
  }
}