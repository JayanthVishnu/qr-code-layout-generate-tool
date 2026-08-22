export function buildTemplate(): string {
    return `
    <header>
        <div data-el="header-left"></div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <button class="btn btn-icon btn-outline" data-el="undo-btn" data-action="undo" title="Undo (Ctrl+Z)" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </button>
            <button class="btn btn-icon btn-outline" data-el="redo-btn" data-action="redo" title="Redo (Ctrl+Y)" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
            </button>
            <div style="width: 1px; height: 24px; background: var(--border-color);"></div>
            <button class="btn btn-icon btn-outline" data-action="toggle-theme" title="Toggle Dark Mode">
                <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </button>
            <button class="btn btn-primary" data-action="save">Save Layout</button>
        </div>
    </header>
    <div class="main-container">
        <div class="edit-view" style="display: flex; flex: 1; height: 100%;">
            <!-- LEFT SIDEBAR: CONFIG & ELEMENTS -->
            <aside class="sidebar">
                <!-- Configuration -->
                <div class="sidebar-section">
                    <div class="sidebar-title">Layout Settings</div>
                    <div class="form-group">
                        <label>Target Entity</label>
                        <select data-input="entity">
                            <option value="">Select Entity...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Internal Layout Name</label>
                        <input type="text" data-input="name" placeholder="Standard Badge" />
                    </div>
                    <div class="form-group">
                        <label>Size Preset</label>
                        <select data-input="preset">
                            <option value="">Custom</option>
                            <option value="100x60mm">Badge — 100 × 60 mm</option>
                            <option value="100x50mm">EU Standard — 100 × 50 mm</option>
                            <option value="50x25mm">Mini Tag — 50 × 25 mm</option>
                            <option value="62x29mm">Brother QL — 62 × 29 mm</option>
                            <option value="4x6in">Shipping Label — 4" × 6"</option>
                            <option value="3x2in">Asset Tag — 3" × 2"</option>
                            <option value="2x1in">Small Label — 2" × 1"</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group" style="flex: 1">
                            <label data-label="width">Width (mm)</label>
                            <input type="number" data-input="width" value="100" step="0.01" min="1" />
                        </div>
                        <div class="form-group" style="flex: 1">
                            <label data-label="height">Height (mm)</label>
                            <input type="number" data-input="height" value="60" step="0.01" min="1" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Measurement Unit</label>
                        <select data-input="unit">
                            <option value="mm">Millimeters (mm)</option>
                            <option value="cm">Centimeters (cm)</option>
                            <option value="in">Inches (in)</option>
                            <option value="px">Pixels (px)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Base Background</label>
                        <div class="color-picker-wrapper">
                            <input type="color" data-input="bg-picker" class="color-preview" style="padding: 0; border: 1px solid var(--border-color); cursor: pointer; background: none;" />
                            <input type="text" data-input="bg" value="#ffffff" placeholder="#ffffff" />
                        </div>
                    </div>
                </div>

                <!-- Elements List -->
                <div class="sidebar-section">
                    <div class="sidebar-title">
                        Elements
                        <div style="display: flex; gap: 6px">
                            <button class="btn btn-outline btn-sm" data-action="add-text" title="Add Text">+ Text</button>
                            <button class="btn btn-outline btn-sm" data-action="add-qr" title="Add QR">+ QR</button>
                            <button class="btn btn-outline btn-sm" data-action="add-barcode" title="Add Barcode">+ Barcode</button>
                        </div>
                    </div>
                    <div data-el="elements-container" class="element-list" style="margin-top: 8px;"></div>
                </div>

                <!-- Sample Data + Previews -->
                <div class="sidebar-section" style="margin-top: auto; border-top: 1px solid var(--border-color); border-bottom: none;">
                    <button class="btn btn-outline btn-block" data-action="edit-sample-data" style="gap: 10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
                        Edit Sample Data
                    </button>
                    <div style="display:flex;gap:6px;margin-top:8px;">
                        <button class="btn btn-outline" style="flex:1;gap:6px;font-size:0.75rem;" data-action="preview-pdf" title="Preview as PDF">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
                            Preview PDF
                        </button>
                        <button class="btn btn-outline" style="flex:1;gap:6px;font-size:0.75rem;" data-action="preview-zpl" title="Preview ZPL for thermal printer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                            Preview ZPL
                        </button>
                    </div>
                </div>
            </aside>

            <!-- CENTER: CANVAS -->
            <main class="preview-area">
                <button id="toggle-left" class="sidebar-toggle" title="Toggle Settings">☰</button>
                <button id="toggle-right" class="sidebar-toggle" title="Toggle Properties" style="display: none;">✎</button>

                <div class="canvas-wrapper">
                    <canvas data-el="preview-canvas"></canvas>
                    <div data-el="editor-overlay" class="editor-overlay"></div>
                </div>

                <div class="canvas-toolbar">
                    <label class="snap-grid-label" title="Snap elements to a 1-unit grid while dragging">
                        <input type="checkbox" data-action="toggle-grid" />
                        <span>Snap to Grid</span>
                    </label>
                    <span class="canvas-toolbar-hint">Del — delete · Arrow — nudge · Shift+Arrow — nudge 5x · Ctrl+D — duplicate · Ctrl+A — select all · Ctrl+Click — multi-select</span>
                </div>
            </main>

            <!-- RIGHT SIDEBAR: PROPERTIES -->
            <aside class="sidebar-right" data-el="property-panel" style="display: none;">
                <div class="sidebar-section">
                    <div class="sidebar-title">Element Properties</div>
                    <div data-el="prop-content"></div>
                    <button class="btn btn-danger btn-block" data-action="delete-element" style="margin-top: 24px">Delete Element</button>
                </div>
            </aside>
        </div>
    </div>

    <!-- MODAL: PDF PREVIEW -->
    <div class="modal-overlay" data-el="pdf-preview-modal">
        <div class="modal-content" style="max-width:680px;width:95vw;">
            <div class="modal-header">
                <h3>PDF Preview</h3>
                <button class="btn-close" data-action="close-pdf-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div data-el="pdf-preview-container" style="min-height:180px;"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" data-action="close-pdf-modal">Close</button>
            </div>
        </div>
    </div>

    <!-- MODAL: ZPL PREVIEW -->
    <div class="modal-overlay" data-el="zpl-preview-modal">
        <div class="modal-content" style="max-width:860px;width:95vw;">
            <div class="modal-header">
                <h3>ZPL Preview</h3>
                <button class="btn-close" data-action="close-zpl-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
                    <label style="font-size:0.8125rem;color:var(--text-secondary);white-space:nowrap;">Printer DPI:</label>
                    <select data-el="zpl-dpi" style="font-size:0.8125rem;padding:4px 8px;border:1px solid var(--border-color);border-radius:6px;background:var(--input-bg);color:var(--text-primary);">
                        <option value="203">203 DPI — Standard desktop</option>
                        <option value="300">300 DPI — High quality</option>
                        <option value="600">600 DPI — Ultra high res</option>
                    </select>
                    <button class="btn btn-outline btn-sm" data-action="refresh-zpl-preview">Refresh</button>
                    <button class="btn btn-outline btn-sm" data-action="copy-zpl">Copy ZPL</button>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div>
                        <div class="sidebar-title" style="margin-bottom:8px;">ZPL Code</div>
                        <textarea data-el="zpl-code" style="width:100%;height:360px;font-family:'Courier New',Courier,monospace;font-size:0.6875rem;resize:vertical;background:var(--panel-bg-alt);border:1px solid var(--border-color);border-radius:6px;padding:10px;color:var(--text-primary);line-height:1.5;box-sizing:border-box;" readonly></textarea>
                    </div>
                    <div>
                        <div class="sidebar-title" style="margin-bottom:8px;">Labelary Preview</div>
                        <div data-el="zpl-preview-image" style="background:#fff;border:1px solid var(--border-color);border-radius:6px;min-height:200px;display:flex;align-items:center;justify-content:center;overflow:hidden;"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" data-action="close-zpl-modal">Close</button>
            </div>
        </div>
    </div>

    <!-- MODAL FOR SAMPLE DATA -->
    <div class="modal-overlay" data-el="sample-data-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Sample Data</h3>
                <button class="btn-close" data-action="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p style="font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 20px;">
                    Update the values below to see how they appear on your layout in real-time.
                </p>
                <div data-el="sample-data-container" class="sample-data-grid"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" data-action="close-modal">Done Editing</button>
            </div>
        </div>
    </div>
    `
}
