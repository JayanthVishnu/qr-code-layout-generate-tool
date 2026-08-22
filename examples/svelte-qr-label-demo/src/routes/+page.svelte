<script lang="ts">
	import { onMount } from 'svelte';
	import { QRLabelDesigner } from 'svelte-qr-label';
	import type { StickerLayout, EntitySchema } from 'svelte-qr-label';
	import { ArrowLeft, Home, Github, BookOpen, Layers } from 'lucide-svelte';
	import { storage } from '$lib/services/storage';
	import LandingPage from '$lib/components/LandingPage.svelte';
	import LabelList from '$lib/components/LabelList.svelte';
	import DocsPage from '$lib/components/DocsPage.svelte';

	const SAMPLE_SCHEMAS: Record<string, EntitySchema> = {
		employee: {
			label: 'Employee Master',
			fields: [
				{ name: 'fullName', label: 'Full Name' },
				{ name: 'employeeId', label: 'Employee ID' },
				{ name: 'department', label: 'Department' },
				{ name: 'joinDate', label: 'Join Date' }
			],
			sampleData: {
				fullName: 'Arjun Mehta',
				employeeId: 'EMP-001',
				department: 'Operations',
				joinDate: '2023-01-10'
			}
		},
		machine: {
			label: 'Machine Master',
			fields: [
				{ name: 'machineName', label: 'Machine Name' },
				{ name: 'machineCode', label: 'Machine Code' },
				{ name: 'location', label: 'Location' },
				{ name: 'model', label: 'Model' }
			],
			sampleData: {
				machineName: 'CNC Router X1',
				machineCode: 'CNC-01',
				location: 'Section A',
				model: '2024-Pro'
			}
		}
	};

	const DEFAULT_NEW_LAYOUT: Omit<StickerLayout, 'id'> = {
		name: 'New QR Label',
		targetEntity: 'employee',
		width: 100,
		height: 60,
		unit: 'mm',
		backgroundColor: '#ffffff',
		elements: []
	};

	type MainView = 'home' | 'docs' | 'labels';
	type SubView = 'list' | 'designer';

	let mainView = $state<MainView>('home');
	let subView = $state<SubView>('list');
	let labels = $state<StickerLayout[]>([]);
	let editingLayout = $state<StickerLayout | null>(null);

	onMount(() => {
		storage.initializeDefaults();
		labels = storage.getLabels();
	});

	function handleCreateNew() {
		editingLayout = { ...DEFAULT_NEW_LAYOUT, id: crypto.randomUUID() } as StickerLayout;
		subView = 'designer';
	}

	function handleEdit(layout: StickerLayout) {
		editingLayout = layout;
		subView = 'designer';
	}

	function handleDelete(id: string) {
		storage.deleteLabel(id);
		labels = storage.getLabels();
	}

	function handleBackToList() {
		subView = 'list';
		editingLayout = null;
	}

	function handleMainViewChange(view: MainView) {
		mainView = view;
		subView = 'list';
	}

	function handleLoadPreset(presetId: string) {
		storage.initializeDefaults();
		const defaultLabels = storage.getLabels();
		const preset = defaultLabels.find((l) => l.id === presetId);
		if (preset) {
			editingLayout = preset;
			subView = 'designer';
			mainView = 'labels';
		}
	}

	let designerLayout = $derived(
		editingLayout ?? ({ ...DEFAULT_NEW_LAYOUT, id: 'temp-new-layout' } as StickerLayout)
	);
</script>

<div class="min-h-screen bg-gray-50">
	{#if subView === 'designer'}
		<!-- Full-screen designer -->
		<div class="fixed inset-0 z-50 bg-white">
			<button
				onclick={handleBackToList}
				class="fixed top-4 left-4 z-[9999] flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-md transition-all border border-gray-200 cursor-pointer text-sm"
			>
				<ArrowLeft size={16} />
				Back to Studio
			</button>
			<QRLabelDesigner
				style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;"
				class="designer-container"
				entitySchemas={SAMPLE_SCHEMAS}
				initialLayout={designerLayout}
				onsave={(layout: StickerLayout) => {
					storage.addLabel(layout);
					labels = storage.getLabels();
					subView = 'list';
					editingLayout = null;
				}}
			/>
		</div>
	{:else}
		<!-- Navigation Bar -->
		<div
			class="bg-white border-b border-gray-200 shadow-xs sticky top-0 z-40 backdrop-blur-lg bg-white/95"
		>
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex flex-col lg:flex-row items-center justify-between py-4 gap-4">
					<!-- Logo -->
					<div class="flex items-center justify-between w-full lg:w-auto gap-3">
						<div class="flex items-center gap-3">
							<div
								class="p-2 sm:p-2.5 bg-gradient-to-br from-svelte-500 to-svelte-700 rounded-xl shadow-md shrink-0"
							>
								<svg
									class="w-5 h-5 sm:w-6 sm:h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width={2}
										d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
									/>
								</svg>
							</div>
							<div>
								<h1
									class="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate max-w-[150px] sm:max-w-full"
								>
									QR Label Designer
								</h1>
								<div class="flex items-center gap-2">
									<p class="text-[10px] sm:text-xs text-gray-500 hidden sm:block">by</p>
									<a
										href="https://github.com/shashi089"
										target="_blank"
										rel="noopener noreferrer"
										class="text-[10px] sm:text-xs font-semibold text-svelte-600 hover:text-svelte-700 transition-colors"
									>
										@shashi089
									</a>
								</div>
							</div>
						</div>

						<button
							onclick={() => {
								if (
									confirm('Are you sure? This will delete all custom layouts and test records.')
								) {
									storage.clearAll();
									labels = [];
									window.location.reload();
								}
							}}
							class="lg:hidden text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-100 whitespace-nowrap"
						>
							Clear Data
						</button>
					</div>

					<!-- Nav Tabs -->
					<div class="w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
						<nav
							class="flex gap-1.5 sm:gap-2 bg-gray-100 p-1 sm:p-1.5 rounded-xl w-max mx-auto lg:mx-0"
						>
							{#each [{ view: 'home' as MainView, icon: Home, label: 'Home' }, { view: 'labels' as MainView, icon: Layers, label: 'Sticker Studio' }, { view: 'docs' as MainView, icon: BookOpen, label: 'Docs' }] as tab (tab.view)}
								{@const IconComponent = tab.icon}
								<button
									onclick={() => handleMainViewChange(tab.view)}
									class="flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all duration-200 rounded-lg cursor-pointer {mainView ===
									tab.view
										? 'bg-white text-svelte-600 shadow-xs'
										: 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}"
								>
									<IconComponent size={16} />
									<span>{tab.label}</span>
								</button>
							{/each}
						</nav>
					</div>

					<!-- Desktop actions -->
					<div class="hidden lg:flex items-center gap-3">
						<a
							href="https://github.com/shashi089/qr-code-label-designer"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 font-bold px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
						>
							<Github size={16} />
							<span>Source Code</span>
						</a>
						<button
							onclick={() => {
								if (
									confirm('Are you sure? This will delete all custom layouts and test records.')
								) {
									storage.clearAll();
									labels = [];
									window.location.reload();
								}
							}}
							class="text-xs text-red-600 hover:text-red-800 font-bold px-3 py-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-100 whitespace-nowrap"
						>
							Clear Data
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Content -->
		<div class="animate-in fade-in duration-300">
			{#if mainView === 'home'}
				<LandingPage onNavigate={handleMainViewChange} onLoadPreset={handleLoadPreset} />
			{:else if mainView === 'labels'}
				<LabelList
					{labels}
					onCreateNew={handleCreateNew}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			{:else}
				<DocsPage />
			{/if}
		</div>
	{/if}
</div>
