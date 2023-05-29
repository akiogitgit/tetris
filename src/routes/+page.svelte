<script lang="ts" context="module">
	export const FIELD_HIGHT = 23
	export const FIELD_WIDTH = 10
</script>

<script lang="ts">
	import { ableToSlideDown, getNextActiveMino, getRandomMinos } from './game'

	// ルール
	// 20 * 10
	// ミノは7種類でワールドルール
	// 自由落下する。時間経過で増加
	// ミノはランダムに落ちてくる。7つが1セットでランダムに降る
	// 左右に移動、90度回転
	// ハードドロップ

	// 各ミノは4*4, 5*5で持っとくといいか？回転を考えると

	type Color = 'I' | 'O' | 'S' | 'Z' | 'J' | 'L' | 'T'
	type Field = null | Color
	type ActiveMino = { y: number; x: number; value: Field }[][]

	let fields: Field[][] = [...Array(FIELD_HIGHT)].map(() =>
		[...Array(FIELD_WIDTH)].map(() => null)
	)
	let randomMinos: Field[][][] = [] // = getRandomMinos()
	let activeMino: ActiveMino = [] // = getNextActiveMino()

	let isFinished = false

	// currentMinoをフィールドに出現
	// ミノの下(nullじゃない)がフィールドの一番上に来るようにしたい
	// minosをnullが下にならないように、fieldsの高さ増やす
	// getNextActiveMinoのyの位置変更
	// 終了判定はここだけでOK
	const spawnMinoInField = () => {
		const testFileds: Field[][] = structuredClone(fields)
		for (let iy = 0; iy < activeMino.length; iy++) {
			const fieldsX = activeMino[iy]
			for (let ix = 0; ix < fieldsX.length; ix++) {
				const field = activeMino[iy][ix]
				const { x, y, value } = field

				if (!value) continue // 値がnullなら無視

				// 一部分でもミノの置く位置が埋まっていたら終了
				if (testFileds[y][x]) {
					isFinished = true
					return
				}
				testFileds[y][x] = value
			}
		}
		// ミノ全体を置ければ置く
		fields = testFileds
	}

	const changeNextMino = () => {
		// randomMinosが減ってきたら、後ろに補充
		if (randomMinos.length <= 2) {
			randomMinos = [...randomMinos, ...getRandomMinos()]
		}

		const [nextMino, ...rest] = randomMinos
		activeMino = getNextActiveMino(nextMino) // randomMinos[0]
		randomMinos = rest // randomMinos[1~6]

		spawnMinoInField()
	}

	let isStopped = false

	// 一定間隔で下にずらす
	const setIntervalId = setInterval(() => {
		// activeMinoがない時は追加する
		if (!activeMino.length) {
			changeNextMino()
			return
		}

		// ゲームが終了したらintervalを停止
		if (isFinished) clearInterval(setIntervalId)
		if (isStopped) return

		// const res = ableToSlideDown()
		const res = ableToSlideDown(fields, activeMino)
		// 着地した
		if (!res) {
			changeNextMino()
			return
		}
		// currentMinoを下にずらす
		fields = res.fields
		activeMino = res.activeMino
	}, 100)
</script>

<h1 class="font-bold text-center text-40px">テトリス</h1>

<button on:click={() => (isStopped = !isStopped)}
	>{isStopped ? '再開' : '止める'}</button
>

{#if isFinished === true}
	<p>終了！</p>
{/if}

<div class="flex gap-3 items-start">
	<!-- フィールド -->
	<div class="border-black border-2 mt-8">
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

	<div>
		{#each randomMinos as field1, y (y)}
			<div class="mt-4">
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

<p>current</p>
<div>
	{#each activeMino as field1, y (y)}
		<div class="flex">
			{#each field1 as field, x (x)}
				<div class="border h-7">{JSON.stringify(field)}</div>
			{/each}
		</div>
	{/each}
</div>
