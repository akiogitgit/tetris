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
	type CurrentMino = { y: number; x: number; value: Field }[][]

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
	let currentMino: CurrentMino
	let isFinished = false

	// 配列の0~6をランダムの順番にする
	const getRandomMino = () => {
		const mino = structuredClone(minos[5])
		// console.log(JSON.stringify(mino.map((_, y) => _.map((v, x) => ({ y, x, value: v }))),null,2))
		// ここでxの位置を初期値（左上をx:3,y:0にする）
		return mino.map((_, y) => _.map((v, x) => ({ y, x: x + 3, value: v })))
	}

	// currentMinoをフィールドに出現
	const spawnMinoInField = () => {
		for (let iy = 0; iy < currentMino.length; iy++) {
			const fieldsX = currentMino[iy]
			for (let ix = 0; ix < fieldsX.length; ix++) {
				const field = currentMino[iy][ix]
				const { x, y, value } = field

				if (!value) continue // 値がnullなら無視

				// 置く位置が埋まっていたら終了
				if (fields[y][x]) {
					isFinished = true
					return
				}
				fields[y][x] = value
			}
		}
	}

	const changeNextMino = () => {
		currentMino = getRandomMino()
		spawnMinoInField()
	}

	changeNextMino()

	// currentMinoを下にずらせるかチェック
	// const ableToSlideDown = (): false | Field[][] => {
	const ableToSlideDown = ():
		| false
		| { fields: Field[][]; currentMino: CurrentMino } => {
		let testFields = structuredClone(fields)
		let testCurrentMino = structuredClone(currentMino)

		// currentMinoを1まとまりで、1つでも無理ならfalse
		for (let iy = currentMino.length - 1; iy >= 0; iy--) {
			const fieldsX = currentMino[iy]
			for (let ix = 0; ix < fieldsX.length; ix++) {
				testCurrentMino[iy][ix].y += 1
				const field = testCurrentMino[iy][ix]
				if (!field.value) continue
				// 一番下に着いた or ミノにぶつかる
				if (field.y > 19 || testFields[field.y][field.x]) {
					console.log('break!', field)
					return false
				}

				const { x, y, value } = field
				testFields[y][x] = value // 次の位置に移動
				testFields[y - 1][x] = null // 前の位置をnullに
			}
		}

		return { fields: testFields, currentMino: testCurrentMino }
	}

	let isBroken = true
	let isStopped = true

	// 一定時間後に下にずらす
	const setIntervalId = setInterval(() => {
		if (isFinished) clearInterval(setIntervalId)
		if (isStopped) return

		const res = ableToSlideDown()
		if (!res) {
			changeNextMino()
			return
		}
		// currentMinoを下にずらす
		fields = res.fields
		currentMino = res.currentMino
		// slideDownCurrentMino()
	}, 50)
</script>

<h1 class="font-bold text-center text-40px">テトリス</h1>

<button on:click={() => (isStopped = !isStopped)}
	>{isStopped ? '再開' : '止める'}</button
>

{#if isFinished === true}
	<p>終了！</p>
{/if}

<div class="border border-black border-2 mt-8">
	{#each fields as field1, y (y)}
		<div class="flex">
			{#each field1 as field, x (x)}
				<!-- <div class="border h-7 w-7">{field}</div> -->
				<div
					class={`border h-7 w-7 ${
						currentMino.flat().find(pos => pos.x === x && pos.y === y) &&
						'bg-red-100'
					} 
					${field && 'bg-blue-100'} 
					`}
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
