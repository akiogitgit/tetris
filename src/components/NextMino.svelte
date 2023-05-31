<script lang="ts">
	import type { Field } from '../routes/+page.svelte'

	export let randomMinos: Field[][][] = []
</script>

<div>
	<div class="flex flex-col gap-3">
		{#each randomMinos as field1, y (y)}
			<div class="border-black border-2">
				{#each field1 as field2, x (x)}
					<div class="flex">
						{#each field2 as field, x (x)}
							<div
								class={`h-7 w-7 
								${field && 'border-2'}
								${
									field === 'I' &&
									'bg-sky-300 border-sky-100 border-b-sky-500 border-l-sky-500'
								} 
								${
									field === 'O' &&
									'bg-[#F1F101] border-yellow-50 border-b-stone-400 border-l-stone-400'
								} 
								${
									field === 'S' &&
									'bg-green-400 border-green-200 border-b-green-600 border-l-green-600'
								} 
								${
									field === 'Z' &&
									'bg-red-500 border-red-300 border-b-red-700 border-l-red-700'
								} 
								${
									field === 'J' &&
									'bg-blue-500 border-blue-300 border-b-blue-700 border-l-blue-700'
								} 
								${
									field === 'L' &&
									'bg-[#F1A101] border-amber-200 border-b-amber-700 border-l-amber-700'
								} 
								${
									field === 'T' &&
									'bg-purple-500 border-purple-300 border-b-purple-700 border-l-purple-700'
								}
							`}
							/>
						{/each}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>
