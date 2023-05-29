<script lang="ts">
	import type { Field } from '../routes/+page.svelte'

	export let randomMinos: Field[][][] = []
</script>

<div>
	<div class="flex flex-col gap-3">
		{#each randomMinos as field1, y (y)}
			<div>
				{#each field1 as field2, x (x)}
					<div class="flex">
						{#each field2 as field, x (x)}
							<div class={`border h-7 w-7 ${field && 'bg-blue-100'}`}>
								{field ? field : ''}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>
