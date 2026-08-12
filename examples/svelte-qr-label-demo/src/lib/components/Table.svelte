<script module lang="ts">
	export interface Column<T> {
		header: string;
		accessorKey?: keyof T;
		id?: string;
	}
</script>

<script lang="ts" generics="T">
	import { Edit2, Trash2 } from 'lucide-svelte';

	interface Props {
		data: T[];
		columns: Column<T>[];
		keyField: keyof T;
		selectedIds?: string[];
		onEdit?: (item: T) => void;
		onDelete?: (item: T) => void;
	}

	let { data, columns, keyField, selectedIds = $bindable(), onEdit, onDelete }: Props = $props();

	let isSelectionEnabled = $derived(selectedIds !== undefined);
	let allIds = $derived(data.map((d) => String(d[keyField])));
	let isAllSelected = $derived(
		isSelectionEnabled && selectedIds?.length === data.length && data.length > 0
	);
	let isIndeterminate = $derived(
		isSelectionEnabled && (selectedIds?.length || 0) > 0 && (selectedIds?.length || 0) < data.length
	);

	function handleSelectAll(e: Event) {
		const checked = (e.target as HTMLInputElement).checked;
		selectedIds = checked ? allIds : [];
	}

	function handleSelectRow(id: string, checked: boolean) {
		if (!selectedIds) return;
		selectedIds = checked ? [...selectedIds, id] : selectedIds.filter((i) => i !== id);
	}

	function indeterminate(node: HTMLInputElement, val: boolean) {
		$effect(() => {
			node.indeterminate = val;
		});
	}
</script>

{#if data.length === 0}
	<div
		class="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-dashed border-gray-300"
	>
		<p class="text-gray-500">No records found</p>
	</div>
{:else}
	<div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
		<div class="hidden md:block overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead class="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
					<tr>
						{#if isSelectionEnabled}
							<th class="px-6 py-3 border-b border-gray-200 w-10">
								<input
									type="checkbox"
									class="rounded border-gray-300 text-svelte-600 focus:ring-svelte-500 cursor-pointer"
									checked={isAllSelected}
									use:indeterminate={isIndeterminate}
									onchange={handleSelectAll}
								/>
							</th>
						{/if}
						{#each columns as col (col.id || col.header)}
							<th class="px-6 py-3 font-semibold border-b border-gray-200">{col.header}</th>
						{/each}
						{#if onEdit || onDelete}
							<th class="px-6 py-3 font-semibold border-b border-gray-200 text-right">Actions</th>
						{/if}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each data as item (String(item[keyField]))}
						{@const id = String(item[keyField])}
						{@const isSelected = selectedIds?.includes(id)}
						<tr class="hover:bg-gray-50 transition-colors {isSelected ? 'bg-svelte-50/50' : ''}">
							{#if isSelectionEnabled}
								<td class="px-6 py-4">
									<input
										type="checkbox"
										class="rounded border-gray-300 text-svelte-600 focus:ring-svelte-500 cursor-pointer"
										checked={isSelected}
										onchange={(e) => handleSelectRow(id, (e.target as HTMLInputElement).checked)}
									/>
								</td>
							{/if}
							{#each columns as col (col.id || col.header)}
								<td class="px-6 py-4 text-sm text-gray-700">
									{#if col.accessorKey}
										{item[col.accessorKey]}
									{:else}
										<span class="text-gray-400">--</span>
									{/if}
								</td>
							{/each}
							{#if onEdit || onDelete}
								<td class="px-6 py-4 text-right space-x-2">
									{#if onEdit}
										<button
											onclick={() => onEdit!(item)}
											class="text-svelte-600 hover:text-svelte-800 p-1.5 rounded-lg hover:bg-svelte-50 transition-colors cursor-pointer"
											title="Edit"
										>
											<Edit2 size={16} />
										</button>
									{/if}
									{#if onDelete}
										<button
											onclick={() => onDelete!(item)}
											class="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
											title="Delete"
										>
											<Trash2 size={16} />
										</button>
									{/if}
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="md:hidden divide-y divide-gray-100">
			{#each data as item (String(item[keyField]))}
				{@const id = String(item[keyField])}
				{@const isSelected = selectedIds?.includes(id)}
				<div class="p-4 {isSelected ? 'bg-svelte-50/50' : ''}">
					<div class="flex justify-between items-start">
						<div class="flex items-center gap-3">
							{#if isSelectionEnabled}
								<input
									type="checkbox"
									class="rounded border-gray-300 text-svelte-600 focus:ring-svelte-500 cursor-pointer"
									checked={isSelected}
									onchange={(e) => handleSelectRow(id, (e.target as HTMLInputElement).checked)}
								/>
							{/if}
							<div class="flex flex-col gap-1">
								{#each columns as col, idx (col.id || col.header)}
									<div class={idx === 0 ? 'font-semibold text-gray-900' : 'text-sm text-gray-600'}>
										{#if idx > 0}
											<span class="text-gray-400 font-medium mr-1">{col.header}:</span>
										{/if}
										{#if col.accessorKey}{item[col.accessorKey]}{/if}
									</div>
								{/each}
							</div>
						</div>
						<div class="flex gap-1 shrink-0">
							{#if onEdit}
								<button
									onclick={() => onEdit!(item)}
									class="text-svelte-600 p-2 rounded-lg hover:bg-svelte-50 cursor-pointer"
								>
									<Edit2 size={18} />
								</button>
							{/if}
							{#if onDelete}
								<button
									onclick={() => onDelete!(item)}
									class="text-red-600 p-2 rounded-lg hover:bg-red-50 cursor-pointer"
								>
									<Trash2 size={18} />
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

