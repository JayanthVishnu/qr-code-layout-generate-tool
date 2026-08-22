import type { DesignerLayout } from './types'

export class DesignerState {
    private _layout: DesignerLayout
    private undoStack: string[] = []
    private redoStack: string[] = []
    private readonly MAX_UNDO = 20
    private readonly onStackChange: () => void

    constructor(layout: DesignerLayout, onStackChange: () => void = () => {}) {
        this._layout = layout
        this.onStackChange = onStackChange
    }

    get layout(): DesignerLayout { return this._layout }
    get canUndo(): boolean { return this.undoStack.length > 0 }
    get canRedo(): boolean { return this.redoStack.length > 0 }

    snapshot(): void {
        this.undoStack.push(JSON.stringify(this._layout))
        if (this.undoStack.length > this.MAX_UNDO) this.undoStack.shift()
        this.redoStack = []
        this.onStackChange()
    }

    /** Serialize current state — used by the focus-before-edit pattern */
    capture(): string {
        return JSON.stringify(this._layout)
    }

    /** Push a pre-captured JSON string onto the undo stack */
    pushRaw(raw: string): void {
        this.undoStack.push(raw)
        if (this.undoStack.length > this.MAX_UNDO) this.undoStack.shift()
        this.redoStack = []
        this.onStackChange()
    }

    undo(): DesignerLayout | null {
        if (!this.canUndo) return null
        this.redoStack.push(JSON.stringify(this._layout))
        this._layout = JSON.parse(this.undoStack.pop()!)
        this.onStackChange()
        return this._layout
    }

    redo(): DesignerLayout | null {
        if (!this.canRedo) return null
        this.undoStack.push(JSON.stringify(this._layout))
        this._layout = JSON.parse(this.redoStack.pop()!)
        this.onStackChange()
        return this._layout
    }

    replace(layout: DesignerLayout): void {
        this._layout = layout
    }
}
