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
		ableToDeleteLine,
		getDropPoint,
		execHardDrop
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
	// nextMinoを2つだけ表示
	// Fieldsの上を隠す
	// ハードドロップ、ゴーストブロック
	// 得点
	// 落下速度は初期値0.8s
	// ミノを消す度レベルが上がり、落下速度が上がる

	// キー操作説明

	let fields: Field[][] = [...Array(FIELD_HIGHT)].map((_, y) =>
		[...Array(FIELD_WIDTH)].map(() => null)
	)
	let randomMinos: Field[][][] = []
	let activeMino: ActiveMino = []
	let dropPoint: ActiveMino = []

	let isFinished = false
	let score = 0 // 1列50点、2:200, 3:450, 4:800
	let line = 0
	let level = 1 // 10ライン消すごとに1上がる
	const initDropSpeed = 0.8
	let dropSpeed = initDropSpeed

	// currentMinoをフィールドに出現
	// 終了判定はここだけでOK
	const spawnMinoInField = () => {
		const testFields: Field[][] = structuredClone(fields)
		for (let iy = 0; iy < activeMino.length; iy++) {
			const fieldsX = activeMino[iy]
			for (let ix = 0; ix < fieldsX.length; ix++) {
				const field = activeMino[iy][ix]
				const { x, y, value } = field

				if (!value) continue // 値がnullなら無視

				// 一部分でもミノの置く位置が埋まっていたら終了
				if (testFields[y][x]) {
					isFinished = true
					return
				}
				testFields[y][x] = value
			}
		}
		// ミノ全体を置ければ置く
		fields = testFields
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

		dropPoint = getDropPoint(fields, activeMino)
	}

	// 行を消せるかチェックして消せれば消す
	const deleteLine = () => {
		const deletedFields = ableToDeleteLine(fields, activeMino)
		if (!deletedFields) return

		const deleteLine = deletedFields.deleteLineCount
		fields = deletedFields.fields
		score += deleteLine * deleteLine * 50
		line += deleteLine
		level = Math.ceil((line + 1) / 10)
		dropSpeed = initDropSpeed ** level

		startGame()
	}

	let isPaused = false
	let setIntervalId = 0
	// 一定間隔で下にずらす 実行するとともに間隔を更新する
	const startGame = () => {
		clearInterval(setIntervalId)
		setIntervalId = setInterval(() => {
			// activeMinoがない時は追加する
			if (!activeMino.length) {
				changeNextMino()
				return
			}

			// ゲームが終了したらintervalを停止
			if (isFinished) clearInterval(setIntervalId)
			if (isPaused) return

			// 着地したかチェック
			const res = ableToSlideDown(fields, activeMino)
			if (!res) {
				deleteLine() // 列を消す
				changeNextMino() // 次のミノ
				return
			}
			// currentMinoを下にずらす
			fields = res.fields
			activeMino = res.activeMino
		}, dropSpeed * 1000)
	}
	startGame()

	// ミノを動かせた時の処理
	const onMoveMino = (v: { fields: Field[][]; activeMino: ActiveMino }) => {
		fields = v.fields
		activeMino = v.activeMino

		dropPoint = getDropPoint(fields, activeMino)
	}

	// slideDownはdropPointが変わらないので別で関数にしている
	const onSlideDown = () => {
		const res = ableToSlideDown(fields, activeMino)
		if (!!res) {
			fields = res.fields
			activeMino = res.activeMino
		}
	}

	const onHardDrop = () => {
		const res = execHardDrop(fields, activeMino, dropPoint)
		if (!!res) {
			fields = res.fields
			activeMino = res.activeMino
		}

		deleteLine() // 列を消す
		changeNextMino() // 次のミノ
	}

	let screenSize: number
</script>

<!-- windowの横幅を取得 -->
<svelte:window bind:innerWidth={screenSize} />

<div class="flex pb-10 gap-3 items-start sm:items-stretch">
	<!-- フィールド -->
	<div>
		<Fields {fields} {dropPoint} {activeMino} />
		{#if screenSize <= 640}
			<div class="mt-3 grid place-items-center">
				<ControlPanel
					{fields}
					{activeMino}
					{isFinished}
					bind:isPaused
					{onMoveMino}
					{onSlideDown}
					{onHardDrop}
				/>
			</div>
		{/if}
	</div>
	<div class="flex flex-col gap-3 justify-between items-start">
		<NextMino {randomMinos} />

		<div>
			<p>レベル {level}</p>
			<p>スコア {score}</p>
			<p>ライン {line}</p>
		</div>
		{#if screenSize > 640}
			<ControlPanel
				{fields}
				{activeMino}
				{isFinished}
				bind:isPaused
				{onMoveMino}
				{onSlideDown}
				{onHardDrop}
			/>
		{/if}
	</div>
</div>
