<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Plus,
		X,
		Printer,
		FileText,
		Image as ImageIcon,
		Info,
		Code,
		Copy,
		Check,
		Terminal,
		Eye
	} from 'lucide-svelte';
	import { storage } from '$lib/services/storage';
	import Table from './Table.svelte';
	import type { Column } from './Table.svelte';
	import { StickerPrinter } from 'svelte-qr-label';
	import { exportToPNG, exportToBatchPDF, exportToZPLFile } from '$lib/services/exportUtils';
	import type { StickerLayout } from 'svelte-qr-label';

	interface Props {
		layout: StickerLayout;
	}

	export interface EntityRecord {
		id: string;
		fullName?: string;
		machineName?: string;
		[key: string]: unknown;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	interface EntityMeta {
		label: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		columns: Column<any>[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getItems: () => any[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		addItem: (item: any) => void;
		deleteItem: (id: string) => void;
		defaultFormValues: Record<string, string>;
		fields: { name: string; label: string; placeholder?: string; type?: string }[];
	}

	const ENTITY_METADATA: Record<string, EntityMeta> = {
		employee: {
			label: 'Employee',
			columns: [
				{ header: 'Employee ID', accessorKey: 'employeeId' },
				{ header: 'Full Name', accessorKey: 'fullName' },
				{ header: 'Department', accessorKey: 'department' },
				{ header: 'Join Date', accessorKey: 'joinDate' }
			],
			getItems: () => storage.getEmployees(),
			addItem: (item) => storage.addEmployee(item),
			deleteItem: (id) => storage.deleteEmployee(id),
			defaultFormValues: {
				fullName: '',
				employeeId: '',
				department: '',
				joinDate: new Date().toISOString().split('T')[0]
			},
			fields: [
				{ name: 'fullName', label: 'Full Name', placeholder: 'e.g. Arjun Mehta', type: 'text' },
				{ name: 'employeeId', label: 'Employee ID', placeholder: 'e.g. EMP-001', type: 'text' },
				{
					name: 'department',
					label: 'Department',
					placeholder: 'e.g. Engineering',
					type: 'text'
				},
				{ name: 'joinDate', label: 'Join Date', type: 'date' }
			]
		},
		machine: {
			label: 'Machine',
			columns: [
				{ header: 'Machine Code', accessorKey: 'machineCode' },
				{ header: 'Machine Name', accessorKey: 'machineName' },
				{ header: 'Location', accessorKey: 'location' },
				{ header: 'Model', accessorKey: 'model' }
			],
			getItems: () => storage.getMachines(),
			addItem: (item) => storage.addMachine(item),
			deleteItem: (id) => storage.deleteMachine(id),
			defaultFormValues: { machineName: '', machineCode: '', location: '', model: '' },
			fields: [
				{
					name: 'machineName',
					label: 'Machine Name',
					placeholder: 'e.g. CNC Milling Machine',
					type: 'text'
				},
				{
					name: 'machineCode',
					label: 'Machine Code',
					placeholder: 'e.g. MC-101',
					type: 'text'
				},
				{
					name: 'location',
					label: 'Location',
					placeholder: 'e.g. Shop Floor A',
					type: 'text'
				},
				{ name: 'model', label: 'Model', placeholder: 'e.g. XYZ-2000', type: 'text' }
			]
		}
	};

	let { layout }: Props = $props();

	let targetEntity = $derived(layout.targetEntity || 'employee');
	let meta = $derived(ENTITY_METADATA[targetEntity] || ENTITY_METADATA.employee);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let items = $state<any[]>([]);
	let selectedIds = $state<string[]>([]);
	let isModalOpen = $state(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let editingItem = $state<any | null>(null);
	let formData = $state<Record<string, string>>({});
	let showDevPanel = $state(false);
	let codeTab = $state<'svelte' | 'headless' | 'json'>('svelte');
	let copied = $state(false);

	let printer: StickerPrinter;

	onMount(() => {
		printer = new StickerPrinter();
	});

	$effect(() => {
		void layout;
		void targetEntity;
		items = meta.getItems();
		selectedIds = [];
	});

	function loadData() {
		items = meta.getItems();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handleOpenModal(item?: any) {
		if (item) {
			editingItem = item;
			formData = { ...item };
		} else {
			editingItem = null;
			formData = { ...meta.defaultFormValues };
		}
		isModalOpen = true;
	}

	function handleCloseModal() {
		isModalOpen = false;
		editingItem = null;
		formData = {};
	}

	function handleSave(e: Event) {
		e.preventDefault();
		const newItem = { id: editingItem?.id || crypto.randomUUID(), ...formData };
		meta.addItem(newItem);
		loadData();
		handleCloseModal();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handleDelete(item: any) {
		const identifier = item.fullName || item.machineName || 'this item';
		if (window.confirm(`Are you sure you want to delete ${identifier}?`)) {
			meta.deleteItem(item.id);
			loadData();
			selectedIds = selectedIds.filter((id) => id !== item.id);
		}
	}

	function getSelectedItems() {
		return items.filter((item) => selectedIds.includes(item.id));
	}

	async function handleExportPNG() {
		const selected = getSelectedItems();
		if (!selected.length) return;
		await exportToPNG({ layout, items: selected, printer, baseFilename: `${targetEntity}-label` });
	}

	async function handleExportPDF() {
		const selected = getSelectedItems();
		if (!selected.length) return;
		await exportToBatchPDF({
			layout,
			items: selected,
			printer,
			baseFilename: `batch-${targetEntity}-labels`
		});
	}

	function handleExportZPL() {
		const selected = getSelectedItems();
		if (!selected.length) return;
		exportToZPLFile({
			layout,
			items: selected,
			printer,
			baseFilename: `batch-${targetEntity}-labels`
		});
	}

	function getSvelteCode() {
		return `<script lang="ts">
  import { QRLabelDesigner, type StickerLayout } from 'svelte-qr-label';
  import 'svelte-qr-label/style.css';

  // Visual design template JSON
  const INITIAL_LAYOUT: StickerLayout = ${JSON.stringify(layout, null, 2)};

  const SCHEMAS = {
    ${targetEntity}: {
      label: '${meta.label} Master',
      fields: [
${meta.fields.map((f) => `        { name: '${f.name}', label: '${f.label}' }`).join(',\n')}
      ],
      sampleData: {
${meta.fields.map((f) => `        ${f.name}: '${f.placeholder ? f.placeholder.replace('e.g. ', '') : 'Value'}'`).join(',\n')}
      }
    }
  };

  let layout = $state<StickerLayout>(INITIAL_LAYOUT);
${'<'}/script>

<div style="width: 100vw; height: 100vh; position: relative;">
  <QRLabelDesigner
    style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;"
    initialLayout={layout}
    entitySchemas={SCHEMAS}
    onsave={(savedLayout) => {
      console.log('Saved Layout:', savedLayout);
      layout = savedLayout;
    }}
  />
</div>`;
	}

	function getHeadlessCode() {
		return `import { StickerPrinter } from 'svelte-qr-label';
import { exportToPDF } from 'svelte-qr-label/pdf';

const printer = new StickerPrinter();
const layout = ${JSON.stringify(layout, null, 2)};

// Your datasets to inject into variables like {{variableName}}
const dataset = [
  {
    id: '1',
${meta.fields.map((f) => `    ${f.name}: '${f.placeholder ? f.placeholder.replace('e.g. ', '') : 'Value'}'`).join(',\n')}
  }
];

// ─── Render to PNG (works in browser) ────────────────────────
const dataUrl = await printer.renderToDataURL(layout, dataset[0], { format: 'png' });

// ─── Export Batch PDF (requires jspdf) ───────────────────────
const pdf = await exportToPDF(layout, dataset);
pdf.save('labels.pdf');

// ─── Export ZPL (send to Zebra/thermal socket) ───────────────
const zplArray = printer.exportToZPL(layout, dataset);
console.log(zplArray.join('\\n'));`;
	}

	function getActiveCode() {
		if (codeTab === 'svelte') return getSvelteCode();
		if (codeTab === 'headless') return getHeadlessCode();
		return JSON.stringify(layout, null, 2);
	}

	function handleCopy() {
		navigator.clipboard.writeText(getActiveCode());
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	let hasSelection = $derived(selectedIds.length > 0);
</script>

<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
	<!-- Main content -->
	<div
		class="{showDevPanel
			? 'lg:col-span-7'
			: 'lg:col-span-12'} space-y-6 transition-all duration-300 w-full"
	>
		<!-- Header card -->
		<div
			class="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
		>
			<div>
				<span
					class="inline-flex items-center gap-1 bg-svelte-50 text-svelte-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 border border-svelte-200"
				>
					Schema: {meta.label}
				</span>
				<h3 class="text-xl font-bold text-gray-900">Sandbox Database</h3>
				<p class="text-sm text-gray-500">
					Inject test records into variables & batch export labels
				</p>
			</div>

			<div class="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap w-full sm:w-auto">
				<button
					onclick={() => (showDevPanel = !showDevPanel)}
					class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all border text-sm cursor-pointer {showDevPanel
						? 'bg-svelte-50 border-svelte-200 text-svelte-700 hover:bg-svelte-100'
						: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}"
				>
					<Code size={16} />
					<span>{showDevPanel ? 'Hide Dev Studio' : 'Show Dev Studio'}</span>
				</button>
				<button
					onclick={() => handleOpenModal()}
					class="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-svelte-600 hover:bg-svelte-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm cursor-pointer text-sm shrink-0"
				>
					<Plus size={16} />
					Add {meta.label}
				</button>
			</div>
		</div>

		<!-- Batch Action Bar -->
		{#if hasSelection}
			<div
				class="bg-svelte-50 border border-svelte-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2"
			>
				<div class="flex items-center gap-2 text-svelte-900">
					<span class="font-semibold bg-svelte-100 px-2.5 py-1 rounded-lg text-sm text-svelte-700">
						{selectedIds.length} Selected
					</span>
					<span class="font-medium text-sm">ready for merge-print</span>
				</div>
				<div class="flex items-center gap-2">
					<button
						onclick={handleExportPNG}
						class="flex items-center gap-2 bg-white text-gray-700 hover:text-svelte-600 border border-gray-200 hover:border-svelte-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
					>
						<ImageIcon size={14} /> PNG
					</button>
					<button
						onclick={handleExportPDF}
						class="flex items-center gap-2 bg-white text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
					>
						<FileText size={14} /> PDF
					</button>
					<button
						onclick={handleExportZPL}
						class="flex items-center gap-2 bg-white text-gray-700 hover:text-black border border-gray-200 hover:border-gray-400 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
					>
						<Printer size={14} /> ZPL
					</button>
				</div>
			</div>
		{:else}
			<div class="bg-svelte-50/50 border border-svelte-100/60 rounded-2xl p-4 flex items-start gap-3">
				<Info class="text-svelte-600 shrink-0 mt-0.5" size={18} />
				<p class="text-xs text-svelte-900 leading-relaxed">
					<strong>To print labels:</strong> Check the box next to one or more {meta.label.toLowerCase()}s
					in the database grid below to open batch export controls.
				</p>
			</div>
		{/if}

		<!-- Table -->
		<div class="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
			<Table
				data={items}
				columns={meta.columns}
				keyField="id"
				onEdit={handleOpenModal}
				onDelete={handleDelete}
				bind:selectedIds
			/>
		</div>
	</div>

	<!-- Dev Studio Panel -->
	{#if showDevPanel}
		<div class="lg:col-span-5 space-y-6 animate-in slide-in-from-right-5 duration-300 w-full">
			<div
				class="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col h-[600px]"
			>
				<div class="p-5 border-b border-gray-100 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Code class="text-svelte-600" size={20} />
						<h3 class="font-bold text-gray-900">Developer Studio</h3>
					</div>
					<button
						onclick={handleCopy}
						class="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer shadow-sm"
					>
						{#if copied}
							<Check size={14} class="text-green-600" />
							<span>Copied!</span>
						{:else}
							<Copy size={14} />
							<span>Copy Code</span>
						{/if}
					</button>
				</div>

				<div class="flex bg-gray-50 border-b border-gray-100 p-1">
					{#each [{ id: 'svelte', icon: Eye, label: 'Svelte Embed' }, { id: 'headless', icon: Terminal, label: 'Headless Print' }, { id: 'json', icon: Code, label: 'Layout Schema' }] as tab (tab.id)}
						{@const TabIcon = tab.icon}
						<button
							onclick={() => (codeTab = tab.id as 'svelte' | 'headless' | 'json')}
							class="flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer {codeTab ===
							tab.id
								? 'bg-white text-svelte-600 shadow-sm'
								: 'text-gray-500 hover:text-gray-900'}"
						>
							<TabIcon size={13} />
							{tab.label}
						</button>
					{/each}
				</div>

				<div
					class="flex-1 bg-gray-950 p-4 font-mono text-xs overflow-y-auto text-gray-300 select-all"
				>
					<pre class="whitespace-pre">{getActiveCode()}</pre>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Modal -->
{#if isModalOpen}
	<div
		class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
	>
		<div
			class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100"
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
				<h3 class="text-lg font-bold text-gray-900">
					{editingItem ? `Edit ${meta.label}` : `Add New ${meta.label}`}
				</h3>
				<button
					onclick={handleCloseModal}
					class="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
				>
					<X size={18} />
				</button>
			</div>

			<form onsubmit={handleSave} class="p-6 space-y-4">
				{#each meta.fields as f (f.name)}
					<div class="space-y-1.5">
						<label for="field-{f.name}" class="block text-sm font-semibold text-gray-700"
							>{f.label}</label
						>
						<input
							id="field-{f.name}"
							type={f.type || 'text'}
							required={!!f.placeholder}
							class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-svelte-500 focus:border-transparent outline-none transition-all text-sm"
							value={formData[f.name] || ''}
							oninput={(e) =>
								(formData = { ...formData, [f.name]: (e.target as HTMLInputElement).value })}
							placeholder={f.placeholder || ''}
						/>
					</div>
				{/each}

				<div class="flex gap-3 pt-4 border-t border-gray-100 mt-6">
					<button
						type="button"
						onclick={handleCloseModal}
						class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors text-sm cursor-pointer"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="flex-1 px-4 py-2.5 bg-svelte-600 text-white rounded-xl hover:bg-svelte-700 font-semibold shadow-sm transition-colors text-sm cursor-pointer"
					>
						Save Changes
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
