<script lang="ts">
	export let level: number
	export let deletedLines: number
	export let score: number
</script>

<div class="flex flex-col mx-auto text-center text-lg gap-3">
	<p>レベル<span class="font-bold block">{level}</span></p>
	<p>ライン <span class="font-bold block">{deletedLines}</span></p>
	<p>スコア <span class="font-bold block">{score}</span></p>
</div>
