<script lang="ts">
	import {
		ArrowRight,
		Cpu,
		Users,
		Shield,
		Zap,
		Layout,
		CheckCircle2,
		Sparkles
	} from 'lucide-svelte';

	interface Props {
		onNavigate: (view: 'home' | 'labels' | 'docs') => void;
		onLoadPreset?: (presetId: string) => void;
	}

	let { onNavigate, onLoadPreset }: Props = $props();

	function handleLoadWorkflow(presetId: string) {
		if (onLoadPreset) {
			onLoadPreset(presetId);
		} else {
			onNavigate('labels');
		}
	}
</script>

<div class="bg-white min-h-screen text-gray-900 font-sans">
	<!-- Hero Section -->
	<div
		class="relative overflow-hidden bg-gradient-to-b from-svelte-50 via-svelte-50/20 to-white pb-20 pt-16 sm:pb-32 sm:pt-36"
	>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
			<div class="lg:grid lg:grid-cols-12 lg:gap-12">
				<div class="text-center lg:text-left lg:col-span-7 flex flex-col justify-center">
					<div
						class="inline-flex items-center gap-1.5 self-center lg:self-start bg-svelte-100/80 border border-svelte-200/50 rounded-full px-3.5 py-1 text-xs font-semibold text-svelte-700 mb-6 shadow-sm backdrop-blur-sm animate-pulse"
					>
						<Sparkles size={12} />
						<span>svelte-qr-label v0.1.0 Released</span>
					</div>

					<h1
						class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl leading-[1.15]"
					>
						Dynamic Svelte
						<span
							class="bg-gradient-to-r from-svelte-600 to-svelte-400 bg-clip-text text-transparent"
						>
							QR Label Designer
						</span>
						& Batch Printer
					</h1>

					<p class="mt-6 text-lg leading-relaxed text-gray-600 max-w-2xl mx-auto lg:mx-0">
						An embeddable drag-and-drop label editor and headless batch-mail-merge printing engine
						for Svelte 5. Design professional layouts visually, map dynamic dataset fields, and
						render directly to ZPL commands, PDFs, or PNGs locally in the browser.
					</p>

					<div
						class="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
					>
						<button
							onclick={() => onNavigate('labels')}
							class="w-full sm:w-auto rounded-xl bg-gradient-to-r from-svelte-600 to-svelte-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-svelte-600/25 hover:shadow-svelte-600/35 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer scale-100 hover:scale-[1.02] active:scale-98"
						>
							Launch Sticker Studio <ArrowRight size={18} />
						</button>
						<button
							onclick={() => onNavigate('docs')}
							class="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1 hover:text-svelte-600 transition-all cursor-pointer"
						>
							View Documentation <span aria-hidden="true">→</span>
						</button>
					</div>
				</div>

				<!-- Hero Code Card -->
				<div class="mt-16 lg:col-span-5 lg:mt-0 flex items-center justify-center relative">
					<div
						class="absolute inset-0 bg-gradient-to-r from-svelte-400 to-svelte-600 rounded-3xl filter blur-3xl opacity-10"
					></div>
					<div
						class="relative rounded-2xl bg-white/80 p-5 shadow-2xl border border-gray-200/50 backdrop-blur-md rotate-1 hover:rotate-0 transition-transform duration-500 max-w-md w-full"
					>
						<div class="bg-gray-900 rounded-xl p-6 text-gray-400 font-mono text-xs shadow-inner">
							<div class="flex gap-1.5 mb-4">
								<div class="w-3 h-3 rounded-full bg-red-500"></div>
								<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
								<div class="w-3 h-3 rounded-full bg-green-500"></div>
							</div>
							<span class="text-svelte-400">import</span>
							&#123; <span class="text-yellow-300">QRLabelDesigner</span>
							&#125;
							<span class="text-svelte-400">from</span>
							<span class="text-green-300"> 'svelte-qr-label'</span>;
							<br />
							<span class="text-svelte-400">import</span>
							<span class="text-green-300"> 'svelte-qr-label/style.css'</span>;
							<br /><br />
							<span class="text-gray-500">&lt;!-- Embed in your .svelte file --&gt;</span>
							<br />
							<span class="text-purple-400">&lt;</span><span class="text-yellow-300"
								>QRLabelDesigner</span
							>
							<br />
							&nbsp;&nbsp;initialLayout=&#123;savedLayout&#125;
							<br />
							&nbsp;&nbsp;entitySchemas=&#123;schemas&#125;
							<br />
							&nbsp;&nbsp;onsave=&#123;(layout) =&gt; save(layout)&#125;
							<br />
							<span class="text-purple-400">/&gt;</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Preset Stories Section -->
	<div class="py-20 sm:py-28 bg-gray-50 border-y border-gray-200/50">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="mx-auto max-w-3xl text-center mb-16">
				<h2 class="text-base font-semibold leading-7 text-svelte-600 tracking-wider uppercase">
					Interactive Industry Workflows
				</h2>
				<p class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
					Choose a Preset Story & Launch the Designer
				</p>
				<p class="mt-4 text-base text-gray-600 leading-relaxed">
					Select one of the sample industries below. The demo will preload the corresponding data
					schema, sample database, and design template directly into your designer session.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
				<div
					class="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-svelte-200 transition-all group duration-300"
				>
					<div>
						<div
							class="h-12 w-12 bg-svelte-100 rounded-xl flex items-center justify-center text-svelte-600 mb-5 group-hover:scale-110 transition-transform"
						>
							<Users size={24} />
						</div>
						<h3 class="text-xl font-bold text-gray-900 mb-2">Workforce ID Badges</h3>
						<p
							class="text-xs font-semibold text-svelte-600 mb-4 bg-svelte-50 py-1 px-2.5 rounded-full w-fit"
						>
							Use Case: Security & Events
						</p>
						<p class="text-gray-600 text-sm leading-relaxed mb-6">
							Design company tags, staff security badges, or visitor credentials. Automatically bind
							employee names, departments, and scan URLs.
						</p>
					</div>
					<button
						onclick={() => handleLoadWorkflow('default-emp-layout')}
						class="w-full bg-gray-50 hover:bg-svelte-600 hover:text-white border border-gray-200 hover:border-svelte-600 rounded-xl py-3 text-sm font-semibold text-gray-700 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
					>
						Load Staff Badge Preset <Sparkles size={14} />
					</button>
				</div>

				<div
					class="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-svelte-200 transition-all group duration-300"
				>
					<div>
						<div
							class="h-12 w-12 bg-svelte-100 rounded-xl flex items-center justify-center text-svelte-600 mb-5 group-hover:scale-110 transition-transform"
						>
							<Cpu size={24} />
						</div>
						<h3 class="text-xl font-bold text-gray-900 mb-2">Equipment Asset Tags</h3>
						<p
							class="text-xs font-semibold text-svelte-600 mb-4 bg-svelte-50 py-1 px-2.5 rounded-full w-fit"
						>
							Use Case: Industrial Maintenance
						</p>
						<p class="text-gray-600 text-sm leading-relaxed mb-6">
							Print spec plates for plant machinery, tools, and servers. Integrate dynamic QR codes
							pointing to installation dates, serial codes, and service logs.
						</p>
					</div>
					<button
						onclick={() => handleLoadWorkflow('default-machine-layout')}
						class="w-full bg-gray-50 hover:bg-svelte-600 hover:text-white border border-gray-200 hover:border-svelte-600 rounded-xl py-3 text-sm font-semibold text-gray-700 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
					>
						Load Asset Tag Preset <Sparkles size={14} />
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Developer Workflow Section -->
	<div class="py-20 sm:py-28 bg-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="mx-auto max-w-3xl text-center mb-16">
				<h2 class="text-base font-semibold leading-7 text-svelte-600 tracking-wider uppercase">
					Developer Tour
				</h2>
				<p class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
					Build a Full Labeling Pipeline in 3 Steps
				</p>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
				{#each [{ step: 1, title: 'Embed the Canvas UI', desc: 'Drop <QRLabelDesigner /> directly into your .svelte file. It adjusts to flex parents automatically and encapsulates all canvas controls.' }, { step: 2, title: 'Bind DB Schemas', desc: 'Define the available database fields. The designer automatically provides visual drag pills so users can map tags like {{fullName}}.' }, { step: 3, title: 'Headless Printing', desc: 'Extract the saved JSON and send it with your database arrays to StickerPrinter to batch print multi-page PDFs, PNG arrays, or raw ZPL code.' }] as item (item.step)}
					<div class="relative flex flex-col items-center text-center">
						<div
							class="h-12 w-12 rounded-full bg-svelte-100 text-svelte-600 flex items-center justify-center font-bold text-lg mb-4 shadow-inner"
						>
							{item.step}
						</div>
						<h4 class="font-bold text-lg text-gray-900 mb-2">{item.title}</h4>
						<p class="text-gray-600 text-sm max-w-xs">{item.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Core Benefits -->
	<div class="py-20 sm:py-28 bg-gray-50 border-t border-gray-200/50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
				<div>
					<h3 class="text-3xl font-extrabold text-gray-900 mb-8 text-center lg:text-left">
						Engineered for High-Performance Apps
					</h3>
					<div class="space-y-6 max-w-xl mx-auto lg:mx-0">
						{#each [{ icon: Zap, bgClass: 'bg-svelte-100', textClass: 'text-svelte-600', title: 'ZPL Code Output (Thermal Printing)', desc: 'Convert design canvas layouts into raw ZPL commands dynamically. Stream print jobs directly to Zebra industrial thermal sticker printers.' }, { icon: CheckCircle2, bgClass: 'bg-svelte-100', textClass: 'text-svelte-600', title: 'Svelte 5 Runes Architecture', desc: 'Built entirely with Svelte 5 runes ($state, $effect, $props). Fine-grained reactivity with zero re-render overhead on designer canvas updates.' }, { icon: Shield, bgClass: 'bg-purple-100', textClass: 'text-purple-600', title: '100% Client-Side Privacy', desc: 'All canvas drawing, barcode parsing, PDF generation, and ZPL rendering happen locally in the browser. Zero server data sharing.' }] as feat (feat.title)}
							{@const FeatIcon = feat.icon}
							<div class="flex gap-4">
								<div
									class="h-10 w-10 shrink-0 {feat.bgClass} rounded-lg flex items-center justify-center {feat.textClass}"
								>
									<FeatIcon size={20} />
								</div>
								<div>
									<h4 class="font-bold text-gray-900">{feat.title}</h4>
									<p class="text-gray-600 text-sm mt-1">{feat.desc}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div
					class="bg-gradient-to-br from-svelte-600 to-svelte-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl"
				>
					<div class="relative z-10 text-center lg:text-left">
						<h3 class="text-3xl font-extrabold mb-4">Ready to test?</h3>
						<p
							class="text-svelte-100 mb-8 max-w-sm mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed"
						>
							Open the label design dashboard and try creating, editing, and batch exporting tags
							with mock database tables.
						</p>
						<button
							onclick={() => onNavigate('labels')}
							class="w-full sm:w-auto bg-white hover:bg-svelte-50 text-svelte-600 px-8 py-4 rounded-xl font-bold transition-all cursor-pointer shadow-lg hover:shadow-xl text-sm"
						>
							Launch Sticker Studio
						</button>
					</div>
					<div class="absolute -right-20 -bottom-20 opacity-10">
						<Layout size={300} />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
