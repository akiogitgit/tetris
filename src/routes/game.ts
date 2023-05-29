import { FIELD_HIGHT, FIELD_WIDTH } from './+page.svelte'

type Color = 'I' | 'O' | 'S' | 'Z' | 'J' | 'L' | 'T'
type Field = null | Color
type CurrentMino = { y: number; x: number; value: Field }[][]

// const minos: Field[][][] = [
// 	// I 水色
// 	[
// 		['I', 'I', 'I', 'I'],
// 		[null, null, null, null],
// 		[null, null, null, null],
// 		[null, null, null, null]
// 	],
// 	// O 黄色
// 	[
// 		['O', 'O'],
// 		['O', 'O']
// 	],
// 	// S 緑
// 	[
// 		[null, 'S', 'S'],
// 		['S', 'S', null],
// 		[null, null, null]
// 	],
// 	// Z 赤
// 	[
// 		['Z', 'Z', null],
// 		[null, 'Z', 'Z'],
// 		[null, null, null]
// 	],
// 	// J 青
// 	[
// 		['J', null, null],
// 		['J', 'J', 'J'],
// 		[null, null, null]
// 	],
// 	// L 青
// 	[
// 		[null, null, 'L'],
// 		['L', 'L', 'L'],
// 		[null, null, null]
// 	],
// 	// T 紫
// 	[
// 		[null, 'T', null],
// 		['T', 'T', 'T'],
// 		[null, null, null]
// 	]
// ]
const minos: Field[][][] = [
	// I 水色
	[
		[null, null, null, null],
		[null, null, null, null],
		[null, null, null, null],
		['I', 'I', 'I', 'I']
	],
	// O 黄色
	[
		['O', 'O'],
		['O', 'O']
	],
	// S 緑
	[
		[null, null, null],
		[null, 'S', 'S'],
		['S', 'S', null]
	],
	// Z 赤
	[
		[null, null, null],
		['Z', 'Z', null],
		[null, 'Z', 'Z']
	],
	// J 青
	[
		[null, null, null],
		['J', null, null],
		['J', 'J', 'J']
	],
	// L 青
	[
		[null, null, null],
		[null, null, 'L'],
		['L', 'L', 'L']
	],
	// T 紫
	[
		[null, null, null],
		[null, 'T', null],
		['T', 'T', 'T']
	]
]

export const getRandomMinos = () => {
	// 0~6の数字を配列をランダムに並び替え
	const numbers = Array.from({ length: 7 }, (_, index) => index)
	const shuffledNumbers = numbers.sort(() => Math.random() - 0.5)

	// ランダムな順番のミノ一式
	const shuffledMinos: Field[][][] = shuffledNumbers.map(v => minos[v])

	return shuffledMinos
}

// 次の操作するミノを取得
export const getNextActiveMino = (nextMino: readonly Field[][]) => {
	// ここで初期位置をxが中央、yを一番下が4になるように調整する
	return nextMino.map((_, y) =>
		// _.map((v, x) => ({ y, x: nextMino.length > 2 ? x + 3 : x + 4, value: v }))
		_.map((v, x) => ({
			y: 4 - nextMino.length + y,
			x: nextMino.length > 2 ? x + 3 : x + 4,
			value: v
		}))
	)
}

// currentMinoをフィールドに出現
const spawnMinoInField = (
	activeMino: CurrentMino,
	fields: Field[][],
	isFinished: boolean
) => {
	for (let iy = 0; iy < activeMino.length; iy++) {
		const fieldsX = activeMino[iy]
		for (let ix = 0; ix < fieldsX.length; ix++) {
			const field = activeMino[iy][ix]
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

// currentMinoを下にずらせるかチェック
// ずらせるなら、ずらした後のfields, currentMinoを返す
export const ableToMoveDown = (
	fields: Field[][],
	activeMino: CurrentMino
): false | { fields: Field[][]; activeMino: CurrentMino } => {
	// 引数の配列をコピー
	const testFields = structuredClone(fields)
	const testCurrentMino = structuredClone(activeMino)

	// currentMinoを1まとまりで、1つでも無理ならfalse
	for (let iy = activeMino.length - 1; iy >= 0; iy--) {
		const fieldsX = activeMino[iy]

		for (let ix = 0; ix < fieldsX.length; ix++) {
			// 下にずらす
			testCurrentMino[iy][ix].y += 1
			const field = testCurrentMino[iy][ix]

			if (!field.value) continue // nullは無視

			// 一番下に着いた or ミノにぶつかる
			if (field.y > FIELD_HIGHT - 1 || testFields[field.y][field.x]) {
				console.log('break!', field)
				return false
			}

			const { x, y, value } = field
			testFields[y][x] = value // 次の位置に移動
			testFields[y - 1][x] = null // 前にいた位置をnullに
		}
	}

	return { fields: testFields, activeMino: testCurrentMino }
}

export const ableToMoveRight = (fields: Field[][], activeMino: CurrentMino) => {
	const testFields = structuredClone(fields)
	const testCurrentMino = structuredClone(activeMino)

	// currentMinoを1まとまりで、1つでも無理ならfalse
	for (let ix = activeMino.length - 1; ix >= 0; ix--) {
		const fieldsX = activeMino[ix]

		for (let iy = 0; iy < fieldsX.length; iy++) {
			// 下にずらす
			testCurrentMino[iy][ix].x += 1
			const field = testCurrentMino[iy][ix]
			console.log(iy, ix, field)

			if (!field.value) continue // nullは無視

			// 一番下に着いた or ミノにぶつかる
			if (field.x > FIELD_WIDTH - 1 || testFields[field.y][field.x]) {
				console.log('break!', field)
				return false
			}

			const { x, y, value } = field
			testFields[y][x] = value // 次の位置に移動
			testFields[y][x - 1] = null // 前にいた位置をnullに
		}
	}

	return { fields: testFields, activeMino: testCurrentMino }
}

export const ableToMoveLeft = (fields: Field[][], activeMino: CurrentMino) => {
	const testFields = structuredClone(fields)
	const testCurrentMino = structuredClone(activeMino)

	// currentMinoを1まとまりで、1つでも無理ならfalse
	for (let iy = 0; iy < activeMino.length; iy++) {
		const fieldsX = activeMino[iy]

		for (let ix = 0; ix < fieldsX.length; ix++) {
			// 下にずらす
			testCurrentMino[iy][ix].x -= 1
			const field = testCurrentMino[iy][ix]
			console.log(iy, ix, field)

			if (!field.value) continue // nullは無視

			// 一番下に着いた or ミノにぶつかる
			if (field.x < 0 || testFields[field.y][field.x]) {
				console.log('break!', field)
				return false
			}

			const { x, y, value } = field
			testFields[y][x] = value // 次の位置に移動
			testFields[y][x + 1] = null // 前にいた位置をnullに
		}
	}

	return { fields: testFields, activeMino: testCurrentMino }
}
