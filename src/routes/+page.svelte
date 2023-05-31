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
		ableToSlideDown,
		getNextActiveMino,
		getRandomMinos,
		ableToDeleteLine
	} from './game'
	import ControlPanel from '../components/ControlPanel.svelte'

	// ルール
	// 20 * 10
	// ミノは7種類でワールドルール
	// 自由落下する。時間経過で増加
	// ミノはランダムに落ちてくる。7つが1セットでランダムに降る
	// 左右に移動、90度回転
	// ハードドロップ

	// 色付ける
	// ボタン付ける

	// 一列を消す
	// ハードドロップ、ゴーストブロック
	// 落下速度は初期値0.8s
	// 得点
	// ミノを消す度レベルが上がり、落下速度が上がる

	let fields: Field[][] = [...Array(FIELD_HIGHT)].map((_, y) =>
		[...Array(FIELD_WIDTH)].map(() => null)
	)
	let randomMinos: Field[][][] = []
	let activeMino: ActiveMino = []

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

		const res = ableToSlideDown(fields, activeMino)
		// 着地した
		if (!res) {
			// 列を消す
			const deletedFields = ableToDeleteLine(fields, activeMino)
			if (deletedFields) {
				fields = deletedFields
			}
			changeNextMino()
			return
		}
		// currentMinoを下にずらす
		fields = res.fields
		activeMino = res.activeMino
	}, 1000)

	const onMoveMino = (v: { fields: Field[][]; activeMino: ActiveMino }) => {
		fields = v.fields
		activeMino = v.activeMino
	}
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

	<div class="flex flex-col gap-3">
		<NextMino {randomMinos} />
		<ControlPanel {fields} {activeMino} {isFinished} {onMoveMino} />
	</div>
</div>

{JSON.stringify(fields)}

<!-- <p>active</p>
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
</div> -->
