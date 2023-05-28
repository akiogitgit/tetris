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
			[null, 'S', null]
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

	let currentMino: { y: number; x: number; value: Field }[][]

	// 配列の0~6をランダムの順番にする
	const getRandomMino = () => {
		const mino = structuredClone(minos[2])
		// console.log(JSON.stringify(mino.map((_, y) => _.map((v, x) => ({ y, x, value: v }))),null,2))
		// ここでxの位置を初期値（左上をx:3,y:0にする）
		return mino.map((_, y) => _.map((v, x) => ({ y, x: x + 3, value: v })))
	}

	// currentMinoをフィールドの初期位置にセット
	const setMinoToFields = () => {
		for (let iy = 0; iy < currentMino.length; iy++) {
			const fieldsX = currentMino[iy]
			for (let ix = 0; ix < fieldsX.length; ix++) {
				const field = currentMino[iy][ix]
				const { x, y, value } = field
				fields[y][x] = value
			}
		}
	}

	const changeNextMino = () => {
		currentMino = getRandomMino()
		setMinoToFields()
	}

	// let currentMino: { y: number; x: number; value: Field }[][] = getRandomMino()
	changeNextMino()

	let isBroken = false

	// 一定時間後に下にずらす
	setInterval(() => {
		// currentMinoの位置をずらす
		// 後ろからやる（先に地面に着くから）

		// if (isBroken) return
		for (let iy = currentMino.length - 1; iy >= 0; iy--) {
			const fieldsX = currentMino[iy]
			for (let ix = 0; ix < fieldsX.length; ix++) {
				const field = currentMino[iy][ix]
				console.log('ループしてるよ')

				// 一番下に着いた
				if (field.y >= 19) {
					console.log('break!', field.y)
					changeNextMino()
					// isBroken = true
					return
				}

				currentMino[iy][ix].y += 1
				const { x, y, value } = currentMino[iy][ix]
				fields[y][x] = value // 次の位置に移動
				fields[y - 1][x] = null // 前の位置をnullに
			}
		}
		console.log('breakの後に実行')
	}, 400)
</script>

<h1 class="font-bold text-center text-40px">テトリス</h1>

<div class="border border-black border-2 mt-8">
	{#each fields as field1, y (y)}
		<div class="flex">
			{#each field1 as field, x (x)}
				<!-- <div class="border h-7 w-7">{field}</div> -->
				<div
					class={`border h-7 w-7 ${
						currentMino.flat().find(pos => pos.x === x && pos.y === y) &&
						'bg-red-100'
					} `}
				>
					{field}
				</div>
			{/each}
		</div>
	{/each}
</div>

<p>current</p>
<div>
	{#each currentMino as field1, y (y)}
		<div class="flex">
			{#each field1 as field, x (x)}
				<div class="border h-7">{JSON.stringify(field)}</div>
			{/each}
		</div>
	{/each}
</div>

<p>minos[2]</p>
<div>
	{#each minos[2] as field1, y (y)}
		<div class="flex">
			{#each field1 as field, x (x)}
				<div class="border h-7">{JSON.stringify(field)}</div>
			{/each}
		</div>
	{/each}
</div>
