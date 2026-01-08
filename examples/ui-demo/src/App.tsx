import { useEffect, useRef, useState } from 'react';
import { QRLayoutDesigner, type EntitySchema, type StickerLayout } from 'qrlayout-ui';
import 'qrlayout-ui/style.css';
import './App.css';
import { LabelList } from './components/LabelList';
import { storage, } from './modules/storage';
import { ArrowLeft, Tag,  } from 'lucide-react';

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

// Initial Default Layout for New Labels
const DEFAULT_NEW_LAYOUT: Omit<StickerLayout, 'id'> = {
  name: "New QR Label",
  targetEntity: "employee",
  width: 100,
  height: 60,
  unit: "mm",
  backgroundColor: "#ffffff",
  elements: []
};

type MainView = 'labels' | 'employees';
type SubView = 'list' | 'designer';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const designerRef = useRef<QRLayoutDesigner | null>(null);

  const [mainView, setMainView] = useState<MainView>('labels');
  const [subView, setSubView] = useState<SubView>('list');
  const [labels, setLabels] = useState<StickerLayout[]>([]);
  const [editingLayout, setEditingLayout] = useState<StickerLayout | null>(null);

  // Load data on mount
  useEffect(() => {
    setLabels(storage.getLabels());
  }, []);

  // Initialize Designer when switching to designer view
  useEffect(() => {
    if (subView !== 'designer' || !containerRef.current) return;

    // Use editingLayout or create a new one
    const initialLayout = editingLayout || {
      ...DEFAULT_NEW_LAYOUT,
      id: crypto.randomUUID()
    };

    // Initialize Designer
    designerRef.current = new QRLayoutDesigner({
      element: containerRef.current,
      entitySchemas: SAMPLE_SCHEMAS,
      initialLayout: initialLayout as StickerLayout,
      onSave: (layout) => {
        console.log(layout, "layout")
        storage.addLabel(layout);
        setLabels(storage.getLabels());
        setSubView('list');
        setEditingLayout(null);
      }
    });

    return () => {
      if (designerRef.current) {
        designerRef.current.destroy();
        designerRef.current = null;
      }
    };
  }, [subView, editingLayout]);

  const handleCreateNew = () => {
    setEditingLayout(null);
    setSubView('designer');
  };

  const handleEdit = (layout: StickerLayout) => {
    setEditingLayout(layout);
    setSubView('designer');
  };

  const handleDelete = (id: string) => {
    storage.deleteLabel(id);
    setLabels(storage.getLabels());
  };

  const handleBackToList = () => {
    setSubView('list');
    setEditingLayout(null);
  };

 

  const handleMainViewChange = (view: MainView) => {
    setMainView(view);
    setSubView('list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {subView === 'list' ? (
        <>
          {/* Navigation Bar */}
          <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 backdrop-blur-lg bg-white/95">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex items-center justify-between py-4">
                {/* Logo/Brand */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      QR Layout Studio
                    </h1>
                    <p className="text-xs text-gray-500">Management Dashboard</p>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex gap-2 bg-gray-100 p-1.5 rounded-xl">
                  <button
                    onClick={() => handleMainViewChange('labels')}
                    className={`flex items-center gap-2 px-5 py-2.5 font-semibold transition-all duration-200 rounded-lg cursor-pointer ${mainView === 'labels'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                  >
                    <Tag size={18} />
                    <span>Labels</span>
                  </button>
                
                </nav>
              </div>
            </div>
          </div>

          {/* Content */}
      
            <LabelList
              labels={labels}
              onCreateNew={handleCreateNew}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
         
        </>
      ) : (
        <div className="relative">
          <button
            onClick={handleBackToList}
            className="fixed top-4 left-4 z-[9999] flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-md transition-all border border-gray-200 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Labels
          </button>
          <div
            className="designer-container"
            ref={containerRef}
          />
        </div>
      )}
    </div>
  )
}

export default App
