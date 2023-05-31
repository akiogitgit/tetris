<script lang="ts" context="module">
	export const FIELD_HIGHT = 23
	export const FIELD_WIDTH = 10

	export type Color = 'I' | 'O' | 'S' | 'Z' | 'J' | 'L' | 'T'
	export type Field = null | Color
	export type ActiveMino = { y: number; x: number; value: Field }[][]
</script>

<script lang="ts">
	import Fields from '../components/Fields.svelte'
	import NextMino from '../components/NextMino.svelte'
	import {
		ableToMoveRight,
		ableToMoveDown,
		getNextActiveMino,
		getRandomMinos,
		ableToMoveLeft,
		ableToRotateRight,
		ableToRotateLeft
	} from './game'

	// ルール
	// 20 * 10
	// ミノは7種類でワールドルール
	// 自由落下する。時間経過で増加
	// ミノはランダムに落ちてくる。7つが1セットでランダムに降る
	// 左右に移動、90度回転
	// ハードドロップ

	// 各ミノは4*4, 5*5で持っとくといいか？回転を考えると

	// let fields: Field[][] = [...Array(FIELD_HIGHT)].map(() =>
	// 	[...Array(FIELD_WIDTH)].map(() => null)
	// )
	let fields: Field[][] = [...Array(FIELD_HIGHT)].map((_, y) =>
		[...Array(FIELD_WIDTH)].map(
			(_, x) =>
				// (y === 3 && x === 7) || (y === 5 && x === 1) ? 'S' : null
				null
		)
	)
	let randomMinos: Field[][][] = [] // = getRandomMinos()
	let activeMino: ActiveMino = [] // = getNextActiveMino()

	let isFinished = false

	// currentMinoをフィールドに出現
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

		// const res = ableToMoveDown()
		const res = ableToMoveDown(fields, activeMino)
		// 着地した
		if (!res) {
			changeNextMino()
			return
		}
		// currentMinoを下にずらす
		fields = res.fields
		activeMino = res.activeMino
	}, 1000)

	const handleKeydown = (e: KeyboardEvent) => {
		// const handleKeydown = (e: {code:"string"}) => {
		if (isFinished) return
		const code = e.code
		e.preventDefault() // ブラウザ本来の挙動をさせない

		let res:
			| false
			| {
					fields: any
					activeMino: any
			  } = false
		switch (code) {
			// 移動
			case 'ArrowRight':
				res = ableToMoveRight(fields, activeMino)
				break
			case 'ArrowLeft':
				res = ableToMoveLeft(fields, activeMino)
				break
			case 'ArrowDown':
				res = ableToMoveDown(fields, activeMino)
				break

			// 回転
			case 'ArrowUp':
			case 'KeyX':
				res = ableToRotateRight(fields, activeMino)
				break
			case 'KeyZ':
				console.log('左回り')
				res = ableToRotateLeft(fields, activeMino)
				break

			// ハードドロップ
			case 'Space':
				console.log('スペース')
		}
		if (!!res) {
			// console.log('res.active', JSON.stringify(res.activeMino))
			fields = res.fields
			activeMino = res.activeMino
			// console.log('active', JSON.stringify(activeMino))
		}
	}

	const array = [
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 9]
	]

	const length = array.length

	const rotatedArray: number[][] = Array.from({ length: length }, () => [])

	for (let x = 0; x < length; x++) {
		for (let y = 0; y < length; y++) {
			const newX = y
			const newY = length - 1 - x
			rotatedArray[newX][newY] = array[x][y]
		}
	}

	console.log(rotatedArray)
</script>

<h1 class="font-bold text-center text-40px">テトリス</h1>

<button on:click={() => (isStopped = !isStopped)}
	>{isStopped ? '再開' : '止める'}</button
>

{#if isFinished === true}
	<p>終了！</p>
{/if}

<div class="flex mt-8 gap-3 items-start">
	<!-- フィールド -->
	<Fields {fields} {activeMino} />
	<NextMino {randomMinos} />
</div>

<!-- ボタン、キーボード操作 -->
<svelte:window on:keydown={handleKeydown} />

<div>
	<button>左</button>
</div>

<p>active</p>
<div>
	{#each activeMino as field2, x (x)}
		<div class="flex">
			{#each field2 as field, x (x)}
				<div class={`border h-7 w-7 ${field.value && 'bg-blue-100'}`}>
					{field.x}{field.y}
				</div>
			{/each}
		</div>
	{/each}
</div>
