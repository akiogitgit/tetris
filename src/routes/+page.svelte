<script lang="ts">
	// ルール
	// 20 * 10
	// ミノは7種類でワールドルール
	// 自由落下する。時間経過で増加
	// 左右に移動、90度回転
	// ハードドロップ
	// ミノはランダムに落ちてくる。7つが1セットでランダムに降る

	// 各ミノは4*4, 5*5で持っとくといいか？回転を考えると

	type Color = 'I' | 'O' | 'S' | 'Z' | 'J' | 'L' | 'T'
	type Field = null | Color
	let fields: Field[][] = [...Array(20)].map(() =>
		[...Array(10)].map(() => null)
	)

	const minos: Field[][][] = [
		// I 水色
		[
			['I', 'I', 'I', 'I'],
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null]
		],
		// O 黄色
		[
			['O', 'O'],
			['O', 'O']
		],
		// S 緑
		[
			[null, 'S', 'S'],
			['S', 'S', null],
			[null, null, null]
		],
		// Z 赤
		[
			['Z', 'Z', null],
			[null, 'Z', 'Z'],
			[null, null, null]
		],
		// J 青
		[
			['J', null, null],
			['J', 'J', 'J'],
			[null, null, null]
		],
		// L 青
		[
			[null, null, 'L'],
			['L', 'L', 'L'],
			[null, null, null]
		],
		// T 紫
		[
			[null, 'T', null],
			['T', 'T', 'T'],
			[null, null, null]
		]
	]

	const getRandomMino = () => {
		const mino = minos[0]
		// console.log(
		// 	JSON.stringify(
		// 		mino.map((_, y) => _.map((v, x) => ({ y, x, value: v }))),
		// 		null,
		// 		2
		// 	)
		// )

		// ここでxの位置を初期値（左上を3にする）
		return mino.map((_, y) => _.map((v, x) => ({ y, x, value: v })))
	}

	let currentMino: { y: number; x: number; value: Field }[][] = getRandomMino()

	// 新しいcurrentMinoを初期位置にセット
	const setNewMino = () => {
		// [0][4] が左上で置く
		for (let y = 0; y < currentMino.length; y++) {
			const fieldsX = currentMino[y]
			for (let x = 0; x < fieldsX.length; x++) {
				console.log(y, x)
				const field = currentMino[y][x]
				fields[y][x] = field.value
			}
		}
	}

	setNewMino()
	console.log(currentMino)
</script>

<h1 class="font-bold text-center text-40px">テトリス</h1>

<div class="border border-black border-2 mt-8">
	{#each fields as field1, y (y)}
		<div class="flex">
			{#each field1 as field, x (x)}
				<div class="border h-7 w-7">{field}</div>
			{/each}
		</div>
	{/each}
</div>
