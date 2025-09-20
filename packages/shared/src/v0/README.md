# v0 Integration Configuration

This directory contains configuration and utilities for v0.dev integration within the dassh project.

## Overview

v0.dev is Vercel's AI-powered UI generation tool that creates React components from natural language descriptions. This integration allows dassh users to:

1. Generate widget templates using v0.dev
2. Import v0 components as widget templates
3. Customize v0-generated components for dashboard use
4. Maintain v0 component library for reuse

## Structure

```
v0/
├── README.md                 # This file
├── config.ts                # v0 integration configuration
├── client.ts                # v0 API client wrapper
├── templates/               # v0 widget template utilities
│   ├── converter.ts         # Convert v0 components to widget templates
│   └── validator.ts         # Validate v0 components for widget use
└── types.ts                 # v0 integration types
```

## Usage

### Generating Widget Templates

```typescript
import { V0Client } from '@dassh/shared/v0';

const v0 = new V0Client();
const component = await v0.generateComponent("A metrics dashboard widget with charts");
const widgetTemplate = await v0.convertToWidgetTemplate(component);
```

### Integration with Dashboard

v0-generated components are automatically:
- Converted to dassh widget templates
- Validated for dashboard compatibility  
- Stored in the widget template library
- Made available for user customization

## Configuration

Set the following environment variables:

```bash
V0_API_KEY=your_v0_api_key
V0_PROJECT_ID=your_v0_project_id
```

## Component Requirements

v0 components must meet these requirements for widget integration:

1. Accept `data` prop for dynamic content
2. Support responsive design (mobile-first)
3. Follow accessibility guidelines (WCAG 2.1 AA)
4. Use Tailwind CSS for styling
5. Export as default React component

## Template Conversion

The conversion process:

1. Parses v0 component structure
2. Extracts configurable properties
3. Generates JSON schema for configuration
4. Creates widget template metadata
5. Validates against widget requirements