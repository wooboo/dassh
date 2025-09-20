import type { V0Component, WidgetCompatibilityCheck } from "../types";

export class V0ComponentValidator {
  // Check if v0 component is compatible with widget system
  validateCompatibility(component: V0Component): WidgetCompatibilityCheck {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check for required props interface
    if (!this.hasDataProp(component.code)) {
      issues.push("Component does not accept 'data' prop");
      suggestions.push("Add 'data' prop to component interface");
      score -= 20;
    }

    // Check for responsive design
    if (!this.hasResponsiveClasses(component.code)) {
      issues.push("Component may not be responsive");
      suggestions.push("Add responsive Tailwind classes (sm:, md:, lg:)");
      score -= 15;
    }

    // Check for accessibility
    if (!this.hasAccessibilityFeatures(component.code)) {
      issues.push("Component lacks accessibility features");
      suggestions.push("Add ARIA labels, keyboard navigation, and semantic HTML");
      score -= 15;
    }

    // Check for Tailwind CSS usage
    if (!this.usesTailwindCSS(component.code)) {
      issues.push("Component does not use Tailwind CSS");
      suggestions.push("Convert styles to Tailwind CSS classes");
      score -= 10;
    }

    // Check component structure
    if (!this.hasProperStructure(component.code)) {
      issues.push("Component structure is not optimal for widgets");
      suggestions.push("Use container div with configurable className");
      score -= 10;
    }

    return {
      compatible: score >= 70,
      issues,
      suggestions,
      score,
    };
  }

  // Check if component accepts data prop
  private hasDataProp(code: string): boolean {
    return /interface\s+\w+Props[^}]*data[?:]?\s*[^}]*}/.test(code) ||
           /\{\s*data[^}]*\}/.test(code);
  }

  // Check for responsive design classes
  private hasResponsiveClasses(code: string): boolean {
    return /(sm:|md:|lg:|xl:)/.test(code);
  }

  // Check for accessibility features
  private hasAccessibilityFeatures(code: string): boolean {
    return /(aria-|role=|tabIndex|onKeyDown|alt=)/.test(code);
  }

  // Check if uses Tailwind CSS
  private usesTailwindCSS(code: string): boolean {
    return /className=["'`][^"'`]*[^"'`]*["'`]/.test(code) &&
           /(bg-|text-|p-|m-|border|rounded|flex|grid)/.test(code);
  }

  // Check component structure
  private hasProperStructure(code: string): boolean {
    return /export default function/.test(code) &&
           /className/.test(code);
  }

  // Extract configurable properties from component
  extractConfigurableProps(component: V0Component): Record<string, any> {
    const props: Record<string, any> = {};
    
    // Extract color configurations
    const colorMatches = component.code.match(/(bg-|text-|border-)(\w+-\d+)/g);
    if (colorMatches) {
      props.colors = colorMatches.map(match => match.split('-').slice(-2).join('-'));
    }

    // Extract size configurations
    const sizeMatches = component.code.match(/(text-|p-|m-|w-|h-)(\w+)/g);
    if (sizeMatches) {
      props.sizes = sizeMatches.map(match => match.split('-').slice(-1)[0]);
    }

    // Extract text content
    const textMatches = component.code.match(/["'`]([^"'`]*[A-Za-z][^"'`]*)["'`]/g);
    if (textMatches) {
      props.text = textMatches
        .map(match => match.slice(1, -1))
        .filter(text => text.length > 3 && !text.includes('className'));
    }

    return props;
  }
}