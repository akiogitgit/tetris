<script lang="ts">
	import type { ActiveMino, Field } from '../routes/+page.svelte'

	export let fields: Field[][] = []
	export let dropPoint: ActiveMino = []
</script>

<div class="border-black border-2">
	{#each fields as field1, y (y)}
		<div
			class={`${y < 3 && 'hidden'} 
			} flex`}
		>
			{#each field1 as field, x (x)}
				<div
					class={`h-6 w-6 sm:(h-7 w-7)
					${
						dropPoint
							.flat()
							.find(pos => pos.value && pos.x === x && pos.y === y) &&
						'border border-gray-300 bg-gray-100'
					}
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
