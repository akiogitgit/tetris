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

	let fields: Field[][] = [...Array(FIELD_HIGHT)].map((_, y) =>
		[...Array(FIELD_WIDTH)].map(() => null)
	)
	let nextMinos: Field[][][] = []
	let activeMino: ActiveMino = []
	let dropPoint: ActiveMino = []

	let isFinished = false
	let score = 0 // 1列50点、2:200, 3:450, 4:800
	let deletedLines = 0
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
		if (nextMinos.length <= 2) {
			nextMinos = [...nextMinos, ...getRandomMinos()]
		}

		const [nextMino, ...rest] = nextMinos
		activeMino = getNextActiveMino(nextMino) // nextMinos[0]
		nextMinos = rest // nextMinos[1~6]

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
		deletedLines += deleteLine
		level = Math.ceil((deletedLines + 1) / 10)
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
</script>

<div>
	{#if isFinished}
		<p
			class="bg-gradient-to-r bg-clip-text font-bold from-red-600 via-violet-400 to-blue-600 text-transparent pb-3 text-5xl sm:text-6xl"
		>
			GAME OVER
		</p>
	{/if}
	<div class="flex gap-3 items-start">
		<!-- フィールド -->
		<Fields {fields} {dropPoint} />
		<div class="flex flex-col gap-3 justify-between items-start">
			<NextMinos {nextMinos} />

			<div class="flex flex-col mx-auto text-center text-lg gap-3">
				<p>レベル<span class="font-bold block">{level}</span></p>
				<p>ライン <span class="font-bold block">{deletedLines}</span></p>
				<p>スコア <span class="font-bold block">{score}</span></p>
			</div>
		</div>
	</div>

	<div class="mt-3 grid place-items-center sm:hidden">
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

	<div class="mt-3 text-lg w-280px hidden sm:block">
		<p class="flex justify-between">← <span>左移動</span></p>
		<p class="flex justify-between">→<span>右移動</span></p>
		<p class="flex justify-between">↓<span>下移動</span></p>
		<p class="flex justify-between">↑ x<span>右回転</span></p>
		<p class="flex justify-between">z<span>左回転</span></p>
		<p class="flex justify-between">Space<span>下まで落下</span></p>
		<p class="flex justify-between">P<span>ポーズ ON/OFF</span></p>
	</div>
</div>
