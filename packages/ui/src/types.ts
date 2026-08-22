import type { StickerLayout } from 'qrlayout-core'

export interface DesignerLayout extends StickerLayout {
    targetEntity?: string
}

export interface EntityField {
    name: string
    label: string
}

export interface EntitySchema {
    label: string
    fields: EntityField[]
    sampleData: Record<string, any>
}

export interface DesignerOptions {
    element: HTMLElement
    initialLayout?: StickerLayout
    entitySchemas?: Record<string, EntitySchema>
    onSave?: (layout: StickerLayout) => void
}
