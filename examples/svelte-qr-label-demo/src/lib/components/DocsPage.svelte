<script lang="ts">
	import {
		BookOpen,
		Terminal,
		Download,
		Github,
		ChevronRight,
		Layers,
		Zap,
		FileText
	} from 'lucide-svelte';

	const SECTIONS = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'packages', label: 'Packages' },
		{ id: 'embed-designer', label: 'Embed Designer' },
		{ id: 'headless', label: 'Headless Rendering' },
		{ id: 'schema', label: 'Schema Reference' },
		{ id: 'export', label: 'Export Formats' }
	];

	let activeSection = $state('overview');

	function scrollTo(id: string) {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) activeSection = entry.target.id;
				}
			},
			{ rootMargin: '-20% 0px -70% 0px' }
		);
		for (const { id } of SECTIONS) {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}
		return () => observer.disconnect();
	});
</script>

<div class="min-h-screen bg-white flex">
	<!-- Sidebar -->
	<aside
		class="hidden lg:flex flex-col w-60 xl:w-72 shrink-0 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto border-r border-gray-100 bg-gray-50/60 py-8 px-5"
	>
		<p class="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4 px-2">
			On this page
		</p>
		<nav class="flex flex-col gap-1">
			{#each SECTIONS as { id, label } (id)}
				<button
					onclick={() => scrollTo(id)}
					class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left cursor-pointer {activeSection ===
					id
						? 'bg-svelte-50 text-svelte-700 border-l-2 border-svelte-600'
						: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
				>
					<ChevronRight
						size={14}
						class={activeSection === id ? 'text-svelte-500' : 'text-gray-400'}
					/>
					{label}
				</button>
			{/each}
		</nav>
		<div class="mt-auto pt-8 border-t border-gray-200">
			<a
				href="https://github.com/shashi089/qr-code-label-designer"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors px-2"
			>
				<Github size={15} />
				View on GitHub
			</a>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 xl:px-16 py-10 max-w-4xl">
		<!-- Overview -->
		<section id="overview" class="mb-16 scroll-mt-24">
			<div class="flex items-center gap-3 mb-4">
				<div class="p-2 bg-svelte-100 rounded-lg">
					<BookOpen size={20} class="text-svelte-600" />
				</div>
				<h1 class="text-3xl font-bold text-gray-900">QR Label Designer â€” Docs</h1>
			</div>
			<p class="text-gray-600 text-lg leading-relaxed mb-6">
				QR Label Designer is powered by <code
					class="font-mono font-bold text-gray-800 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 text-sm"
					>svelte-qr-label</code
				>, a complete visual editor and high-performance print engine for Svelte 5 applications.
			</p>
			<div class="grid sm:grid-cols-2 gap-4">
				{#each [{ icon: Layers, color: 'text-svelte-500', title: '<QRLabelDesigner /> Component', desc: 'Embeddable drag-and-drop designer workspace. Uses Svelte 5 runes ($state, $effect, $props) for fine-grained reactivity.' }, { icon: Terminal, color: 'text-green-500', title: 'StickerPrinter Engine', desc: 'Headless batch rendering engine that merges layouts with record arrays to output PNGs, PDFs, and ZPL commands.' }] as item (item.title)}
					{@const ItemIcon = item.icon}
					<div
						class="border border-gray-200 rounded-xl p-4 hover:border-svelte-300 transition-colors"
					>
						<div class="flex items-center gap-2 mb-2">
							<ItemIcon size={18} class={item.color} />
							<span class="font-bold text-gray-800">{item.title}</span>
						</div>
						<p class="text-sm text-gray-500">{item.desc}</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Packages -->
		<section id="packages" class="mb-16 scroll-mt-24">
			<h2 class="text-2xl font-bold text-gray-900 mb-2">Package Details</h2>
			<p class="text-gray-500 mb-6">
				The Svelte library is published on npm under the MIT license.
			</p>
			<div class="bg-gray-950 rounded-2xl p-6">
				<div class="flex justify-between items-center mb-3 flex-wrap gap-2">
					<div class="flex items-center gap-2">
						<Layers size={16} class="text-svelte-400" />
						<code class="text-svelte-400 font-bold font-mono text-base">svelte-qr-label</code>
					</div>
					<div class="flex gap-3">
						<a
							href="https://www.npmjs.com/package/svelte-qr-label"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-1 text-xs text-svelte-400 hover:text-svelte-300"
							><Download size={12} /> npm</a
						>
						<a
							href="https://github.com/shashi089/qr-code-label-designer/tree/main/packages/svelte-qr-label"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-1 text-xs text-svelte-400 hover:text-svelte-300"
							><Github size={12} /> source</a
						>
					</div>
				</div>
				<div class="bg-gray-800 rounded-lg px-4 py-3 font-mono text-sm text-gray-200">
					npm install svelte-qr-label
				</div>
				<p class="text-gray-400 text-sm mt-3">
					Also import the stylesheet: <code class="text-gray-300"
						>import 'svelte-qr-label/style.css'</code
					>
				</p>
			</div>
		</section>

		<!-- Embed Designer -->
		<section id="embed-designer" class="mb-16 scroll-mt-24">
			<h2 class="text-2xl font-bold text-gray-900 mb-2">Embed Designer in Svelte</h2>
			<p class="text-gray-500 mb-6">
				Use the native <code class="text-svelte-600 font-mono bg-svelte-50 px-1 rounded"
					>svelte-qr-label</code
				> component to drop a visual editor into your Svelte 5 application in seconds.
			</p>
			<pre class="bg-gray-950 rounded-2xl p-5 overflow-x-auto text-sm leading-relaxed">
<code class="text-gray-200"
					>{`<!-- npm install svelte-qr-label -->

<script lang="ts">
  import { QRLabelDesigner, type StickerLayout } from 'svelte-qr-label';
  import 'svelte-qr-label/style.css';

  const SCHEMA = {
    employee: {
      label: 'Employee Master',
      fields: [
        { name: 'fullName',    label: 'Full Name'  },
        { name: 'employeeId', label: 'Employee ID' },
        { name: 'department', label: 'Department'  },
      ],
      sampleData: {
        fullName: 'Jane Smith',
        employeeId: 'EMP-2024-007',
        department: 'Engineering',
      },
    },
  };

  let layout = $state<StickerLayout>({
    id: crypto.randomUUID(),
    name: 'Employee Badge',
    width: 100, height: 60, unit: 'mm',
    backgroundColor: '#ffffff',
    elements: [],
  });
<` +
						`/script>

<div style="width: 100vw; height: 100vh; position: relative;">
  <QRLabelDesigner
    style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;"
    initialLayout={layout}
    entitySchemas={SCHEMA}
    onsave={(savedLayout) => {
      console.log('Saved layout:', savedLayout);
      layout = savedLayout;
    }}
  />
</div>`}</code
				>
</pre>
		</section>

		<!-- Headless -->
		<section id="headless" class="mb-16 scroll-mt-24">
			<h2 class="text-2xl font-bold text-gray-900 mb-2">Headless Rendering</h2>
			<p class="text-gray-500 mb-6">
				Use the <code class="text-green-700 font-mono bg-green-50 px-1 rounded">StickerPrinter</code
				>
				engine (re-exported by
				<code class="text-green-700 font-mono bg-green-50 px-1 rounded">svelte-qr-label</code>) to
				programmatically render labels without any UI.
			</p>
			<pre class="bg-gray-950 rounded-2xl p-5 overflow-x-auto text-sm leading-relaxed">
<code class="text-gray-200"
					>{`import { StickerPrinter } from 'svelte-qr-label';
import { exportToPDF } from 'svelte-qr-label/pdf';

const printer = new StickerPrinter();

const layout = { /* your StickerLayout JSON */ };
const data = { fullName: 'Jane Smith', employeeId: 'EMP-2024-007' };

// â”€â”€â”€ Render as PNG (browser) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const dataUrl = await printer.renderToDataURL(layout, data, { format: 'png' });

// â”€â”€â”€ Batch PNG (one image per record) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const images = await printer.exportImages(layout, [data]);

// â”€â”€â”€ Export PDF (requires jspdf) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const pdf = await exportToPDF(layout, [data]);
pdf.save('employee-badge.pdf');

// â”€â”€â”€ Export ZPL for Zebra / thermal printers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const zplArray = printer.exportToZPL(layout, [data]);
console.log(zplArray[0]); // ^XA ... ^XZ`}</code
				>
</pre>
		</section>

		<!-- Schema -->
		<section id="schema" class="mb-16 scroll-mt-24">
			<h2 class="text-2xl font-bold text-gray-900 mb-2">Schema Reference</h2>
			<p class="text-gray-500 mb-6">
				Every label is a plain JSON object of type <code
					class="text-purple-700 font-mono bg-purple-50 px-1 rounded">StickerLayout</code
				>. Use
				<code class="text-purple-700 font-mono bg-purple-50 px-1 rounded">{'{{variableName}}'}</code
				>
				for dynamic content.
			</p>
			<pre class="bg-gray-950 rounded-2xl p-5 overflow-x-auto text-sm leading-relaxed">
<code class="text-gray-200"
					>{`// Re-exported by 'svelte-qr-label'

type Unit = 'mm' | 'cm' | 'in' | 'px';

type StickerLayout = {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: Unit;
  backgroundColor?: string;
  backgroundImage?: string;
  targetEntity?: string;
  elements: StickerElement[];
};

type StickerElement = {
  id: string;
  type: 'text' | 'qr';
  x: number; y: number;
  w: number; h: number;
  content: string;         // static text OR '{{fieldName}}'
  style?: {
    fontSize?: number;
    fontWeight?: string | number;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
};

// Entity schema (used by the designer UI)
type EntitySchema = {
  label: string;
  fields: { name: string; label: string }[];
  sampleData: Record<string, string>;
};`}</code
				>
</pre>
		</section>

		<!-- Export Formats -->
		<section id="export" class="mb-16 scroll-mt-24">
			<h2 class="text-2xl font-bold text-gray-900 mb-2">Export Formats</h2>
			<p class="text-gray-500 mb-6">
				All exports are handled by the <code
					class="text-green-700 font-mono bg-green-50 px-1 rounded">StickerPrinter</code
				>
				class re-exported by
				<code class="text-green-700 font-mono bg-green-50 px-1 rounded">svelte-qr-label</code>.
			</p>

			<div class="grid sm:grid-cols-3 gap-4 mb-8">
				{#each [{ icon: FileText, color: 'text-orange-500', title: 'PNG / JPEG', desc: 'Canvas-based image export. One file per record.', method: 'renderToDataURL()' }, { icon: FileText, color: 'text-red-500', title: 'PDF', desc: 'Multi-page PDF batch export via jspdf.', method: 'exportToPDF()' }, { icon: Zap, color: 'text-svelte-500', title: 'ZPL', desc: 'Zebra Programming Language for thermal printers.', method: 'exportToZPL()' }] as fmt (fmt.title)}
					{@const FmtIcon = fmt.icon}
					<div class="border border-gray-200 rounded-xl p-4">
						<div class="flex items-center gap-2 mb-2">
							<FmtIcon size={20} class={fmt.color} />
							<span class="font-bold text-gray-800">{fmt.title}</span>
						</div>
						<p class="text-xs text-gray-500 mb-2">{fmt.desc}</p>
						<code class="text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5 font-mono"
							>{fmt.method}</code
						>
					</div>
				{/each}
			</div>
		</section>

		<!-- Bottom Links -->
		<div
			class="border-t border-gray-100 pt-10 flex flex-col sm:flex-row gap-4 items-center justify-between"
		>
			<p class="text-gray-400 text-sm">Found an issue or want to contribute?</p>
			<a
				href="https://github.com/shashi089/qr-code-label-designer"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-all"
			>
				<Github size={18} />
				Open an Issue on GitHub
			</a>
		</div>
	</main>
</div>

