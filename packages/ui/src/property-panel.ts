import type { StickerElement } from 'qrlayout-core'
import type { EntitySchema } from './types'

export interface MultiSelectCallbacks {
    alignRelative: (dir: string) => void
    alignToLabel: (dir: string) => void
}

export interface PropCallbacks {
    snapshot: () => void
    capture: () => string
    pushRaw: (raw: string) => void
    update: () => void
    align: (direction: string) => void
    refreshPanel: () => void
}

export class PropertyPanel {
    private readonly panel: HTMLElement
    private readonly content: HTMLElement

    constructor(panel: HTMLElement, content: HTMLElement) {
        this.panel = panel
        this.content = content
    }

    show(
        el: StickerElement,
        entitySchema: EntitySchema | null,
        toggleRight: HTMLButtonElement | null,
        isMobile: boolean,
        callbacks: PropCallbacks
    ): void {
        if (isMobile && toggleRight) toggleRight.style.display = 'flex'
        else if (toggleRight) toggleRight.style.display = 'none'

        this.panel.style.display = 'block'
        this.content.innerHTML = this.buildHTML(el)

        this.bindAlignButtons(callbacks)
        this.bindFieldSuggestions(el, entitySchema, callbacks)
        this.bindSpecialInputs(el, callbacks)
        this.bindPropLinks(el, callbacks)
        this.bindStyleToggles(el, callbacks)
    }

    hide(toggleRight: HTMLButtonElement | null): void {
        this.panel.style.display = 'none'
        if (toggleRight) toggleRight.style.display = 'none'
    }

    showMultiSelection(
        count: number,
        toggleRight: HTMLButtonElement | null,
        isMobile: boolean,
        callbacks: MultiSelectCallbacks
    ): void {
        if (isMobile && toggleRight) toggleRight.style.display = 'flex'
        else if (toggleRight) toggleRight.style.display = 'none'

        this.panel.style.display = 'block'
        this.content.innerHTML = this.buildMultiSelectHTML(count)

        this.content.querySelectorAll<HTMLElement>('.align-relative-btn').forEach(btn => {
            btn.addEventListener('click', () => callbacks.alignRelative(btn.dataset.align!))
        })
        this.content.querySelectorAll<HTMLElement>('.align-label-btn').forEach(btn => {
            btn.addEventListener('click', () => callbacks.alignToLabel(btn.dataset.align!))
        })
    }

    private buildMultiSelectHTML(count: number): string {
        const alignBtns = (cls: string) => `
            <button class="btn btn-icon btn-outline ${cls}" data-align="left"     title="Align Left Edges"      style="width:28px;height:28px;"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="6" height="8" rx="1"/><line x1="1" y1="1" x2="1" y2="13"/></svg></button>
            <button class="btn btn-icon btn-outline ${cls}" data-align="center-h" title="Center Horizontally"   style="width:28px;height:28px;"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="3" width="6" height="8" rx="1"/><line x1="7" y1="1" x2="7" y2="13"/></svg></button>
            <button class="btn btn-icon btn-outline ${cls}" data-align="right"    title="Align Right Edges"     style="width:28px;height:28px;"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="3" width="6" height="8" rx="1"/><line x1="13" y1="1" x2="13" y2="13"/></svg></button>
            <div class="align-sep"></div>
            <button class="btn btn-icon btn-outline ${cls}" data-align="top"      title="Align Top Edges"       style="width:28px;height:28px;"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="8" height="6" rx="1"/><line x1="1" y1="1" x2="13" y2="1"/></svg></button>
            <button class="btn btn-icon btn-outline ${cls}" data-align="center-v" title="Center Vertically"     style="width:28px;height:28px;"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="8" height="6" rx="1"/><line x1="1" y1="7" x2="13" y2="7"/></svg></button>
            <button class="btn btn-icon btn-outline ${cls}" data-align="bottom"   title="Align Bottom Edges"    style="width:28px;height:28px;"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="8" height="6" rx="1"/><line x1="1" y1="13" x2="13" y2="13"/></svg></button>
        `
        return `
            <div style="text-align:center;padding:10px 0 12px;background:var(--panel-bg-alt);border-radius:8px;border:1px solid var(--border-color);margin-bottom:14px;">
                <div style="font-size:0.8125rem;font-weight:600;color:var(--text-primary);">${count} elements selected</div>
                <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px;">Ctrl+Click to add or remove</div>
            </div>
            <div class="align-toolbar">
                <span class="align-toolbar-label">Align to Each Other</span>
                <div class="align-toolbar-btns">${alignBtns('align-relative-btn')}</div>
            </div>
            <div style="height:1px;background:var(--border-color);margin:10px 0;"></div>
            <div class="align-toolbar" style="margin-bottom:0;">
                <span class="align-toolbar-label">Align to Label</span>
                <div class="align-toolbar-btns">${alignBtns('align-label-btn')}</div>
            </div>
        `
    }

    private buildHTML(el: StickerElement): string {
        return `
            ${this.buildAlignToolbarHTML()}
            <div class="form-group">
                ${this.buildQrSeparatorHTML(el)}
                ${this.buildBarcodeFormatHTML(el)}
                <label>Content</label>
                <textarea data-prop="content-val" rows="2">${el.content}</textarea>
                <div class="field-buttons" data-el="field-suggestions"></div>
            </div>
            <div class="form-row">
                <div class="form-group" style="flex:1;"><label>X (pos)</label><input type="number" step="0.01" data-prop="x" value="${el.x.toFixed(2)}"></div>
                <div class="form-group" style="flex:1;"><label>Y (pos)</label><input type="number" step="0.01" data-prop="y" value="${el.y.toFixed(2)}"></div>
            </div>
            <div class="form-row">
                <div class="form-group" style="flex:1;"><label>Width</label><input type="number" step="0.01" data-prop="w" value="${el.w.toFixed(2)}"></div>
                <div class="form-group" style="flex:1;"><label>Height</label><input type="number" step="0.01" data-prop="h" value="${el.h.toFixed(2)}"></div>
            </div>
            ${this.buildTextStylesHTML(el)}
            ${this.buildBarcodeNoticeHTML(el)}
        `
    }

    private buildAlignToolbarHTML(): string {
        return `
            <div class="align-toolbar">
                <span class="align-toolbar-label">Align to Label</span>
                <div class="align-toolbar-btns">
                    <button class="btn btn-icon btn-outline align-btn" data-align="left" title="Align Left Edge" style="width:28px;height:28px;">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="6" height="8" rx="1"/><line x1="1" y1="1" x2="1" y2="13"/></svg>
                    </button>
                    <button class="btn btn-icon btn-outline align-btn" data-align="center-h" title="Center Horizontally" style="width:28px;height:28px;">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="3" width="6" height="8" rx="1"/><line x1="7" y1="1" x2="7" y2="13"/></svg>
                    </button>
                    <button class="btn btn-icon btn-outline align-btn" data-align="right" title="Align Right Edge" style="width:28px;height:28px;">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="3" width="6" height="8" rx="1"/><line x1="13" y1="1" x2="13" y2="13"/></svg>
                    </button>
                    <div class="align-sep"></div>
                    <button class="btn btn-icon btn-outline align-btn" data-align="top" title="Align Top Edge" style="width:28px;height:28px;">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="8" height="6" rx="1"/><line x1="1" y1="1" x2="13" y2="1"/></svg>
                    </button>
                    <button class="btn btn-icon btn-outline align-btn" data-align="center-v" title="Center Vertically" style="width:28px;height:28px;">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="8" height="6" rx="1"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
                    </button>
                    <button class="btn btn-icon btn-outline align-btn" data-align="bottom" title="Align Bottom Edge" style="width:28px;height:28px;">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="8" height="6" rx="1"/><line x1="1" y1="13" x2="13" y2="13"/></svg>
                    </button>
                </div>
            </div>
        `
    }

    private buildQrSeparatorHTML(el: StickerElement): string {
        if (el.type !== 'qr') return ''
        return `
            <label>Field Separator</label>
            <input type="text" id="prop-qr-separator" placeholder="e.g. | or -" value="${el.qrSeparator || ''}">
        `
    }

    private buildBarcodeFormatHTML(el: StickerElement): string {
        if (el.type !== 'barcode') return ''
        const fmt = el.barcodeFormat || 'CODE128'
        const sel128 = fmt === 'CODE128' ? 'selected' : ''
        const selEAN = fmt === 'EAN13'   ? 'selected' : ''
        const selUPC = fmt === 'UPCA'    ? 'selected' : ''
        const sel39  = fmt === 'CODE39'  ? 'selected' : ''
        const selITF = fmt === 'ITF14'   ? 'selected' : ''
        return `
            <label>Barcode Format</label>
            <select id="prop-barcode-format">
                <option value="CODE128" ${sel128}>CODE128 — Universal / Logistics</option>
                <option value="EAN13"   ${selEAN}>EAN-13 — Retail (12 digits)</option>
                <option value="UPCA"    ${selUPC}>UPC-A — US Retail (11 digits)</option>
                <option value="CODE39"  ${sel39}>CODE39 — Industrial / MRO</option>
                <option value="ITF14"   ${selITF}>ITF-14 — Carton / Pallet (13 digits)</option>
            </select>
        `
    }

    private buildTextStylesHTML(el: StickerElement): string {
        if (el.type !== 'text') return ''
        const fw    = el.style?.fontWeight
        const hAlign = el.style?.textAlign
        const vAlign = el.style?.verticalAlign
        const fwNormal = fw === 'normal' ? 'selected' : ''
        const fwBold   = fw === 'bold'   ? 'selected' : ''
        const hLeft    = hAlign === 'left'   ? 'active' : ''
        const hCenter  = hAlign === 'center' ? 'active' : ''
        const hRight   = hAlign === 'right'  ? 'active' : ''
        const vTop     = vAlign === 'top'    ? 'active' : ''
        const vMiddle  = vAlign === 'middle' ? 'active' : ''
        const vBottom  = vAlign === 'bottom' ? 'active' : ''
        return `
            <div style="height: 1px; background: var(--border-color); margin: 16px 0;"></div>
            <div class="form-row">
                <div class="form-group" style="flex:1;">
                    <label>Font Size</label>
                    <input type="number" data-prop="fontSize" value="${el.style?.fontSize || 12}">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Font Weight</label>
                    <select data-prop="fontWeight">
                        <option value="normal" ${fwNormal}>Normal</option>
                        <option value="bold"   ${fwBold}>Bold</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Horizontal Align</label>
                <div class="toggle-group" style="width: 100%;">
                    <button class="toggle-btn prop-align-h ${hLeft}"   data-val="left"   style="flex:1;">Left</button>
                    <button class="toggle-btn prop-align-h ${hCenter}" data-val="center" style="flex:1;">Center</button>
                    <button class="toggle-btn prop-align-h ${hRight}"  data-val="right"  style="flex:1;">Right</button>
                </div>
            </div>
            <div class="form-group">
                <label>Vertical Align</label>
                <div class="toggle-group" style="width: 100%;">
                    <button class="toggle-btn prop-align-v ${vTop}"    data-val="top"    style="flex:1;">Top</button>
                    <button class="toggle-btn prop-align-v ${vMiddle}" data-val="middle" style="flex:1;">Middle</button>
                    <button class="toggle-btn prop-align-v ${vBottom}" data-val="bottom" style="flex:1;">Bottom</button>
                </div>
            </div>
        `
    }

    private buildBarcodeNoticeHTML(el: StickerElement): string {
        if (el.type !== 'barcode') return ''
        return `
            <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 12px 0 0; line-height: 1.5;">
                EAN-13 needs 12 digits &nbsp;·&nbsp; UPC-A needs 11 digits &nbsp;·&nbsp; ITF-14 needs 13 digits
            </p>
        `
    }

    private bindAlignButtons(callbacks: PropCallbacks): void {
        this.content.querySelectorAll<HTMLElement>('.align-btn').forEach(btn => {
            btn.addEventListener('click', () => callbacks.align(btn.dataset.align!))
        })
    }

    private bindFieldSuggestions(el: StickerElement, schema: EntitySchema | null, callbacks: PropCallbacks): void {
        const suggestions = this.content.querySelector('[data-el="field-suggestions"]')
        if (!schema || !suggestions) return

        schema.fields.forEach(f => {
            const pill = document.createElement('div')
            pill.className = 'field-pill'
            pill.innerText = `+ ${f.label}`
            pill.onclick = () => {
                el.content += `{{${f.name}}}`
                callbacks.refreshPanel()
                callbacks.update()
            }
            suggestions.appendChild(pill)
        })
    }

    private bindSpecialInputs(el: StickerElement, callbacks: PropCallbacks): void {
        const sepInput = this.content.querySelector<HTMLInputElement>('#prop-qr-separator')
        if (sepInput) {
            sepInput.addEventListener('input', (e) => {
                el.qrSeparator = (e.target as HTMLInputElement).value
                callbacks.update()
            })
        }

        const barcodeFormat = this.content.querySelector<HTMLSelectElement>('#prop-barcode-format')
        if (barcodeFormat) {
            barcodeFormat.addEventListener('change', (e) => {
                callbacks.snapshot()
                const newFormat = (e.target as HTMLSelectElement).value
                ;(el as any).barcodeFormat = newFormat
                callbacks.update()
            })
        }
    }

    private bindPropLinks(el: StickerElement, callbacks: PropCallbacks): void {
        const link = (key: string, field: string, isNum = false, subField?: string) => {
            const input = this.content.querySelector<HTMLInputElement>(`[data-prop="${key}"]`)
            if (!input) return

            let preEditState: string | null = null

            input.addEventListener('focus', () => {
                preEditState = callbacks.capture()
            })

            input.addEventListener('input', (e) => {
                const raw = (e.target as HTMLInputElement).value
                const val = isNum ? (Number.parseFloat(raw) || 0) : raw
                if (subField) {
                    if (!el.style) { el.style = {} }
                    const style = el.style as Record<string, unknown>
                    style[subField] = val
                } else {
                    (el as any)[field] = val
                }
                callbacks.update()
            })

            input.addEventListener('blur', () => {
                if (preEditState !== null) {
                    callbacks.pushRaw(preEditState)
                    preEditState = null
                }
            })
        }

        link('content-val', 'content')
        link('x', 'x', true)
        link('y', 'y', true)
        link('w', 'w', true)
        link('h', 'h', true)
        link('fontSize', 'style', true, 'fontSize')
        link('fontWeight', 'style', false, 'fontWeight')
    }

    private bindStyleToggles(el: StickerElement, callbacks: PropCallbacks): void {
        this.content.querySelectorAll<HTMLElement>('.prop-align-h').forEach(btn => {
            btn.addEventListener('click', () => {
                callbacks.snapshot()
                el.style = el.style || {}
                el.style.textAlign = btn.dataset.val as any
                callbacks.refreshPanel()
                callbacks.update()
            })
        })

        this.content.querySelectorAll<HTMLElement>('.prop-align-v').forEach(btn => {
            btn.addEventListener('click', () => {
                callbacks.snapshot()
                el.style = el.style || {}
                el.style.verticalAlign = btn.dataset.val as any
                callbacks.refreshPanel()
                callbacks.update()
            })
        })
    }
}
