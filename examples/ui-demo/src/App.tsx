import { useEffect, useRef } from 'react';
import { QRLayoutDesigner, type EntitySchema, type StickerLayout } from 'qrlayout-ui';
import 'qrlayout-ui/style.css';
import './App.css';

// Sample Schema
const SAMPLE_SCHEMAS: Record<string, EntitySchema> = {
  employee: {
    label: "Employee Badge",
    fields: [
      { name: "fullName", label: "Full Name" },
      { name: "employeeId", label: "Employee ID" },
      { name: "department", label: "Department" },
      { name: "joinDate", label: "Join Date" },
    ],
    sampleData: {
      fullName: "Alex Johnson",
      employeeId: "EMP-2024-889",
      department: "Engineering",
      joinDate: "2024-01-15"
    }
  },
  inventory: {
    label: "Inventory Label",
    fields: [
      { name: "sku", label: "SKU" },
      { name: "itemName", label: "Item Name" },
      { name: "category", label: "Category" },
      { name: "price", label: "Price" }
    ],
    sampleData: {
      sku: "INV-9920-X",
      itemName: "Wireless Mouse Pro",
      category: "Peripherals",
      price: "$49.99"
    }
  }
};

// Initial Layout
const INITIAL_LAYOUT: StickerLayout = {
  id: "layout-1",
  name: "Employee ID Card",
  targetEntity: "employee",
  width: 85,
  height: 54,
  unit: "mm",
  backgroundColor: "#ffffff",
  elements: [
    {
      id: "title",
      type: "text",
      x: 5,
      y: 5,
      w: 75,
      h: 8,
      content: "COMPANY NAME",
      style: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        verticalAlign: "middle"
      }
    },
    {
      id: "qr-code",
      type: "qr",
      x: 32.5,
      y: 15,
      w: 20,
      h: 20,
      content: "{{employeeId}}",
      qrSeparator: "|"
    },
    {
      id: "name-label",
      type: "text",
      x: 5,
      y: 38,
      w: 75,
      h: 6,
      content: "{{fullName}}",
      style: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center"
      }
    },
    {
      id: "dept-label",
      type: "text",
      x: 5,
      y: 44,
      w: 75,
      h: 5,
      content: "{{department}}",
      style: {
        fontSize: 10,
        textAlign: "center",
        color: "#666666"
      }
    }
  ]
};

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const designerRef = useRef<QRLayoutDesigner | null>(null);

  useEffect(() => {
    if (!containerRef.current || designerRef.current) return;

    // Initialize Designer
    designerRef.current = new QRLayoutDesigner({
      element: containerRef.current,
      entitySchemas: SAMPLE_SCHEMAS,
      initialLayout: INITIAL_LAYOUT,
      onSave: (layout) => {
        console.log("Saved Layout:", layout);
        alert(`Layout "${layout.name}" saved! Check console for JSON.`);
      }
    });

    return () => {
      if (designerRef.current) {
        designerRef.current.destroy();
        designerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="designer-container"
      ref={containerRef}
    />
  )
}

export default App
