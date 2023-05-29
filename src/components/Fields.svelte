<script lang="ts">
	import type { ActiveMino, Field } from '../routes/+page.svelte'

	export let fields: Field[][] = []
	export let activeMino: ActiveMino = []
</script>

<div class="border-black border-2">
	{#each fields as field1, y (y)}
		<div
			class={`${y < 3 && 'bg-gray-100'} ${
				y === 2 && 'border-b-2 border-black'
			} flex`}
		>
			{#each field1 as field, x (x)}
				<div
					class={`border h-7 w-7 ${
						activeMino.flat().find(pos => pos.x === x && pos.y === y) &&
						'bg-red-100'
					} 
        ${field && 'bg-blue-100'} 
        `}
				>
					{field ? field : ''}
				</div>
			{/each}
		</div>
	{/each}
</div>
