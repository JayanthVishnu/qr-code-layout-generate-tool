import { StickerPrinter } from 'svelte-qr-label';
import { exportToPDF } from 'svelte-qr-label/pdf';
import type { StickerLayout } from 'svelte-qr-label';

export interface ExportOptions {
	layout: StickerLayout;
	items: Record<string, unknown>[];
	printer: StickerPrinter;
	baseFilename: string;
}

export async function exportToPNG(options: ExportOptions): Promise<void> {
	const { layout, items, printer, baseFilename } = options;
	if (!layout || items.length === 0) return;

	for (const item of items) {
		const dataUrl = await printer.renderToDataURL(layout, item, { format: 'png' });
		const link = document.createElement('a');
		link.download = `${baseFilename}-${item.id || Date.now()}.png`;
		link.href = dataUrl;
		link.click();
	}
}

export async function exportToBatchPDF(options: ExportOptions): Promise<void> {
	const { layout, items, baseFilename } = options;
	if (!layout || items.length === 0) return;

	const pdf = await exportToPDF(layout, items);
	pdf.save(`${baseFilename}-${Date.now()}.pdf`);
}

export function exportToZPLFile(options: ExportOptions): void {
	const { layout, items, printer, baseFilename } = options;
	if (!layout || items.length === 0) return;

	const zplArray = printer.exportToZPL(layout, items);
	const zplContent = zplArray.join('\n');

	const blob = new Blob([zplContent], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `${baseFilename}-${Date.now()}.txt`;
	link.click();
	URL.revokeObjectURL(url);
}
