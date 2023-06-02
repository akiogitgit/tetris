<script lang="ts">
	import 'virtual:windi.css'
</script>

<svelte:head>
	<title>テトリス</title>
	<meta name="description" content="テトリスがWebで遊べる" />
	<link rel="icon" href="/tetris.webp" />
	<meta
		name="keywords"
		content="テトリス, テトリスゲーム, テトリスブラウザ, テトリスブラウザゲーム"
	/>
	<meta property="og:image" content="/tetris.webp" />
	<meta property="og:site_name" content="テトリス" />
	<meta property="og:locale" content="ja_JP" />
</svelte:head>
<main
	class="flex flex-col mx-auto min-h-screen my-8 max-w-500px w-90vw justify-center items-center"
>
	<slot />
</main>
