import { StickerPrinter } from 'qrlayout-core'
import type { StickerElement } from 'qrlayout-core'
import type { DesignerLayout } from './types'

export class CanvasManager {
    readonly canvas: HTMLCanvasElement
    readonly overlay: HTMLDivElement
    readonly printer: StickerPrinter

    pxPerUnit = 1
    isDragging = false
    snapToGrid = false
    private readonly GRID_SIZE = 1

    constructor(canvas: HTMLCanvasElement, overlay: HTMLDivElement, printer: StickerPrinter) {
        this.canvas = canvas
        this.overlay = overlay
        this.printer = printer
    }

    async render(layout: DesignerLayout, sampleData: Record<string, any>): Promise<void> {
        try {
            await this.printer.renderToCanvas(layout, sampleData, this.canvas)
            const rect = this.canvas.getBoundingClientRect()
            if (rect.width > 0 && layout.width > 0) {
                this.pxPerUnit = rect.width / layout.width
            }
        } catch (err) {
            console.error('[qrlayout-ui] Canvas render failed:', err)
        }
    }

    updateOverlay(
        elements: StickerElement[],
        selectedIds: Set<string>,
        onSelect: (id: string, ctrlKey: boolean) => void,
        onDragStart: (e: MouseEvent, el: StickerElement, item: HTMLElement) => void,
        onResizeStart: (e: MouseEvent, el: StickerElement, item: HTMLElement) => void
    ): void {
        if (!this.isDragging) {
            this.overlay.style.width = this.canvas.style.width
            this.overlay.style.height = this.canvas.style.height
        }

        if (this.snapToGrid && this.pxPerUnit > 0) {
            this.overlay.style.setProperty('--grid-dot-spacing', `${this.GRID_SIZE * this.pxPerUnit}px`)
            this.overlay.classList.add('show-grid')
        } else {
            this.overlay.classList.remove('show-grid')
        }

        const existingIds = new Set(elements.map(e => e.id))
        this.overlay.querySelectorAll<HTMLElement>('.editor-item').forEach(node => {
            if (!existingIds.has(node.dataset.id!)) node.remove()
        })

        elements.forEach(el => {
            let item = this.overlay.querySelector<HTMLElement>(`.editor-item[data-id="${el.id}"]`)

            if (!item) {
                item = document.createElement('div')
                item.className = 'editor-item'
                item.dataset.id = el.id

                const handle = document.createElement('div')
                handle.className = 'resize-handle'
                item.appendChild(handle)
                this.overlay.appendChild(item)
            }

            const handle = item.querySelector<HTMLElement>('.resize-handle')!
            handle.onmousedown = (e) => {
                e.preventDefault()
                e.stopPropagation()
                onResizeStart(e, el, item!)
            }

            item.onmousedown = (e) => {
                if ((e.target as HTMLElement).classList.contains('resize-handle')) return
                e.preventDefault()
                onSelect(el.id, e.ctrlKey || e.metaKey)
                onDragStart(e, el, item!)
            }

            item.classList.toggle('selected', selectedIds.has(el.id))
            item.style.left = `${el.x * this.pxPerUnit}px`
            item.style.top = `${el.y * this.pxPerUnit}px`
            item.style.width = `${el.w * this.pxPerUnit}px`
            item.style.height = `${el.h * this.pxPerUnit}px`
        })
    }

    startDrag(
        e: MouseEvent,
        primaryEl: StickerElement,
        item: HTMLElement,
        companions: StickerElement[],
        onMove: () => void,
        onComplete: () => void
    ): void {
        this.isDragging = true
        const startX = e.clientX
        const startY = e.clientY
        const initX = primaryEl.x
        const initY = primaryEl.y
        const snap = (v: number) =>
            this.snapToGrid ? Math.round(v / this.GRID_SIZE) * this.GRID_SIZE : v
        const companionInits = companions.map(c => ({ el: c, x: c.x, y: c.y }))

        const moveHandler = (me: MouseEvent) => {
            const rawDx = (me.clientX - startX) / this.pxPerUnit
            const rawDy = (me.clientY - startY) / this.pxPerUnit
            primaryEl.x = snap(initX + rawDx)
            primaryEl.y = snap(initY + rawDy)
            item.style.left = `${primaryEl.x * this.pxPerUnit}px`
            item.style.top = `${primaryEl.y * this.pxPerUnit}px`
            companionInits.forEach(({ el, x, y }) => {
                el.x = snap(x + rawDx)
                el.y = snap(y + rawDy)
                const node = this.overlay.querySelector<HTMLElement>(`.editor-item[data-id="${el.id}"]`)
                if (node) { node.style.left = `${el.x * this.pxPerUnit}px`; node.style.top = `${el.y * this.pxPerUnit}px` }
            })
            onMove()
        }
        const upHandler = () => {
            this.isDragging = false
            onComplete()
            window.removeEventListener('mousemove', moveHandler)
            window.removeEventListener('mouseup', upHandler)
        }
        window.addEventListener('mousemove', moveHandler)
        window.addEventListener('mouseup', upHandler)
    }

    startResize(
        e: MouseEvent,
        el: StickerElement,
        item: HTMLElement,
        onMove: () => void,
        onComplete: () => void
    ): void {
        this.isDragging = true
        const startX = e.clientX
        const startY = e.clientY
        const initW = el.w
        const initH = el.h
        const snap = (v: number) =>
            this.snapToGrid ? Math.round(v / this.GRID_SIZE) * this.GRID_SIZE : v

        const moveHandler = (me: MouseEvent) => {
            el.w = snap(Math.max(this.GRID_SIZE, initW + (me.clientX - startX) / this.pxPerUnit))
            el.h = snap(Math.max(this.GRID_SIZE, initH + (me.clientY - startY) / this.pxPerUnit))
            item.style.width = `${el.w * this.pxPerUnit}px`
            item.style.height = `${el.h * this.pxPerUnit}px`
            onMove()
        }
        const upHandler = () => {
            this.isDragging = false
            onComplete()
            window.removeEventListener('mousemove', moveHandler)
            window.removeEventListener('mouseup', upHandler)
        }
        window.addEventListener('mousemove', moveHandler)
        window.addEventListener('mouseup', upHandler)
    }
}
