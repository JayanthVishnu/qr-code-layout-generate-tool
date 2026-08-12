<script lang="ts">
    import { untrack } from 'svelte';
    import { QRLayoutDesigner } from 'qrlayout-ui';
    import type { StickerLayout, EntitySchema } from 'qrlayout-ui';
    import 'qrlayout-ui/style.css';

    interface Props {
        initialLayout?: StickerLayout;
        entitySchemas?: Record<string, EntitySchema>;
        onsave?: (layout: StickerLayout) => void;
        class?: string;
        style?: string;
    }

    let {
        initialLayout,
        entitySchemas,
        onsave,
        class: className = '',
        style = '',
    }: Props = $props();

    let container: HTMLDivElement | undefined = $state();
    let designer: QRLayoutDesigner | null = null;

    $effect(() => {
        const layoutId = initialLayout?.id;
        const _b = JSON.stringify(entitySchemas);

        if (!container) return;

        untrack(() => {
            designer?.destroy();
            designer = new QRLayoutDesigner({
                element: container!,
                initialLayout,
                entitySchemas,
                onSave: (layout) => onsave?.(layout),
            });
        });

        return () => {
            untrack(() => {
                designer?.destroy();
                designer = null;
            });
        };
    });

    $effect(() => {
        if (designer) {
            (designer as any).onSaveCallback = (layout: StickerLayout) => {
                onsave?.(layout);
            };
        }
    });
</script>

<div
    bind:this={container}
    class={className}
    style="width:100%;height:100%;{style}"
></div>
