# qrlayout-ui

A framework-agnostic, embeddable UI for designing sticker layouts with QR codes. Part of the [QR Layout Tool](https://github.com/shashi089/qr-code-layout-generate-tool).

[**🚀 Live Demo**](https://qr-layout-designer.netlify.app/)

## Features

- **Framework Independent**: Built with vanilla TypeScript, works with React, Vue, Angular, Svelte, or plain HTML/JS.
- **Drag & Drop Designer**: Visual placement of text and QR code elements.
- **Data Binding**: Bind fields like `{{name}}` or `{{id}}` from your entity schemas.
- **Rich Text Styling**: Customize font size, weight, and alignment (horizontal/vertical).
- **Auto-Join Fields**: Set a "Field Separator" (e.g., `|`) on QR elements to automatically join variables (e.g. `{{id}}{{name}}` becomes `ID|NAME`).
- **Dark Mode**: Built-in support for light and dark themes.
- **Flexible Units**: Design in millimeters (mm), centimeters (cm), inches (in), or pixels (px).
- **Export**: Get the final layout JSON for storage.

## Installation

```bash
npm install qrlayout-ui qrlayout-core
```

## Usage

This library is exposed as a class `QRLayoutDesigner` that can be mounted into any HTML element. It also re-exports `StickerPrinter` for rendering layouts without the UI.

### 1. Import Styles

Make sure to import the CSS file in your project entry point:

```javascript
import "qrlayout-ui/style.css";
```

### 2. Basic Setup

```typescript
import { QRLayoutDesigner } from "qrlayout-ui";

const container = document.getElementById("my-designer-container");

const designer = new QRLayoutDesigner({
    element: container,
    
    // Optional: Provide Schemas for data binding
    entitySchemas: {
        employee: {
            label: "Employee",
            fields: [
                { name: "name", label: "Full Name" },
                { name: "id", label: "Employee ID" }
            ],
            sampleData: { name: "Vishal Naik", id: "12345" } // Used for preview
        }
    },

    // Optional: Load an existing layout
    initialLayout: {
        id: "1",
        name: "My Layout",
        targetEntity: "employee",
        width: 100,
        height: 60,
        unit: "mm",
        backgroundColor: "#ffffff",
        elements: []
    },

    onSave: (layout) => {
        console.log("Layout saved:", layout);
        // Save to your backend here
    }
});
```

### 3. Cleanup

When unmounting your component (e.g., in React's `useEffect` return or Vue's `onUnmounted`):

```javascript
designer.destroy();
```

## Props / Options

| Option | Type | Description |
|---|---|---|
| `element` | `HTMLElement` | **Required**. The DOM element to mount the designer into. |
| `entitySchemas` | `Record<string, Schema>` | Definitions for data entities. Allows users to pick fields (like `{{name}}`) to bind to text/QR elements. |
| `initialLayout` | `StickerLayout` | The initial layout state to load. |
| `onSave` | `(layout) => void` | Callback triggered when the "Save Layout" button is clicked. |

## React Integration Example

```tsx
import { useEffect, useRef } from 'react';
import { QRLayoutDesigner } from 'qrlayout-ui';
import 'qrlayout-ui/style.css';

const MyDesigner = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const designer = new QRLayoutDesigner({
      element: containerRef.current,
      onSave: (data) => console.log(data)
    });

    return () => designer.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '800px' }} />;
};
export default MyDesigner;
```
