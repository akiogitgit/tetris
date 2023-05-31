import {
	FIELD_HIGHT,
	FIELD_WIDTH,
	type ActiveMino,
	type Field
} from './+page.svelte'

const minos: Field[][][] = [
	// I 水色
	[
		[null, null, null, null],
		[null, null, null, null],
		['I', 'I', 'I', 'I'],
		[null, null, null, null]
	],
	// O 黄色
	[
		[null, null, null, null],
		[null, 'O', 'O', null],
		[null, 'O', 'O', null],
		[null, null, null, null]
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

// 7種類のミノをシャッフルし返す
export const getRandomMinos = () => {
	// 0~6の数字を配列をランダムに並び替え
	const numbers = Array.from({ length: 7 }, (_, index) => index)
	const shuffledNumbers = numbers.sort(() => Math.random() - 0.5)

	// ランダムな順番のミノ一式
	const shuffledMinos: Field[][][] = shuffledNumbers.map(v => minos[v])

	return shuffledMinos
}

// 次の操作するミノを返す
export const getNextActiveMino = (nextMino: Field[][]) => {
	// ミノの初期位置をxが中央、yをミノの一番下が4になるように調整する
	return nextMino.map((_, y) =>
		_.map((v, x) => ({
			y: 4 - nextMino.length + y,
			x: nextMino.length > 2 ? x + 3 : x + 4,
			value: v
		}))
	)
}

// activeMinoを下にずらせるかチェック
// ずらせるなら、ずらした後のfields, activeMinoを返す
export const ableToMoveDown = (
	fields: Field[][],
	activeMino: ActiveMino
): false | { fields: Field[][]; activeMino: ActiveMino } => {
	// 引数の配列をコピー
	const testFields = structuredClone(fields)
	const testActiveMino = structuredClone(activeMino)

	// currentMinoを1まとまりで、1つでも移動が無理ならfalseを返す
	for (let iy = activeMino.length - 1; iy >= 0; iy--) {
		const fieldsX = activeMino[iy]

		for (let ix = 0; ix < fieldsX.length; ix++) {
			// 下にずらす
			testActiveMino[iy][ix].y += 1
			const field = testActiveMino[iy][ix]

			if (!field.value) continue // 操作するミノのnullは無視

			// 一番下に着いた or ミノにぶつかる
			if (field.y > FIELD_HIGHT - 1 || testFields[field.y][field.x]) {
				return false
			}

			const { x, y, value } = field
			testFields[y][x] = value // 次の位置に移動
			testFields[y - 1][x] = null // 前にいた位置をnullに
		}
	}

	return { fields: testFields, activeMino: testActiveMino }
}

export const ableToMoveRight = (fields: Field[][], activeMino: ActiveMino) => {
	const testFields = structuredClone(fields)
	const testActiveMino = structuredClone(activeMino)

	// currentMinoを1まとまりで、1つでも移動が無理ならfalseを返す
	for (let ix = activeMino.length - 1; ix >= 0; ix--) {
		const fieldsX = activeMino[ix]

		for (let iy = 0; iy < fieldsX.length; iy++) {
			// 下にずらす
			testActiveMino[iy][ix].x += 1
			const field = testActiveMino[iy][ix]

			if (!field.value) continue // 操作するミノのnullは無視

			// 一番下に着いた or ミノにぶつかる
			if (field.x > FIELD_WIDTH - 1 || testFields[field.y][field.x]) {
				return false
			}

			const { x, y, value } = field
			testFields[y][x] = value // 次の位置に移動
			testFields[y][x - 1] = null // 前にいた位置をnullに
		}
	}

	return { fields: testFields, activeMino: testActiveMino }
}

export const ableToMoveLeft = (fields: Field[][], activeMino: ActiveMino) => {
	const testFields = structuredClone(fields)
	const testActiveMino = structuredClone(activeMino)

	// currentMinoを1まとまりで、1つでも移動が無理ならfalseを返す
	for (let iy = 0; iy < activeMino.length; iy++) {
		const fieldsX = activeMino[iy]

		for (let ix = 0; ix < fieldsX.length; ix++) {
			// 下にずらす
			testActiveMino[iy][ix].x -= 1
			const field = testActiveMino[iy][ix]

			if (!field.value) continue // 操作するミノのnullは無視

			// 一番下に着いた or ミノにぶつかる
			if (field.x < 0 || testFields[field.y][field.x]) {
				return false
			}

			const { x, y, value } = field
			testFields[y][x] = value // 次の位置に移動
			testFields[y][x + 1] = null // 前にいた位置をnullに
		}
	}

	return { fields: testFields, activeMino: testActiveMino }
}

// 回転できれば、回転後のfields,activeMino、回転出来なければfalseを返す
const ableToRotate = (
	fields: Field[][],
	activeMino: ActiveMino,
	direction: 'right' | 'left'
) => {
	const testFields = structuredClone(fields)
	const testActiveMino = structuredClone(activeMino)
	const length = testActiveMino.length

	// currentMinoを1まとまりで、1つでも移動が無理ならfalseを返す
	for (let iy = 0; iy < activeMino.length; iy++) {
		const fieldsX = activeMino[iy]

		for (let ix = 0; ix < fieldsX.length; ix++) {
			const beforeMinoY = iy
			const beforeMinoX = ix
			// activeMino内で回転させる時の公式
			const afterMinoY = direction === 'right' ? ix : length - 1 - ix
			const afterMinoX = direction === 'right' ? length - 1 - iy : iy

			// fields内はx,yがactiveMinoのx,yと異なるので activeMino[y][x].x, .yから算出
			const { y: beforeFieldY, x: beforeFieldX } =
				activeMino[beforeMinoY][beforeMinoX]
			const { y: afterFieldY, x: afterFieldX } =
				activeMino[afterMinoY][afterMinoX]

			// フィールドから左右下いずれかにはみ出る時、回転しない
			if (
				beforeFieldY >= FIELD_HIGHT || // 下にはみ出る
				afterFieldY >= FIELD_HIGHT || // 下にはみ出る
				beforeFieldX < 0 || // 左にはみ出る
				afterFieldX < 0 || // 左にはみ出る
				beforeFieldX >= FIELD_WIDTH || // 右にはみ出る
				afterFieldX >= FIELD_WIDTH // 右にはみ出る
			) {
				return false
			}

			// 回転前のミノがあって、回転後のミノの空の位置が、fieldsで埋まっていたら、回転しない
			// (after両方埋まる場合は、activeMinoの場所だから回せる)
			if (
				activeMino[beforeMinoY][beforeMinoX].value && // 回転前のミノの位置が埋まってる
				!activeMino[afterMinoY][afterMinoX].value && // 回転後のミノの位置が空
				fields[afterFieldY][afterFieldX] // 回転後のフィールドの位置が埋まってる
			) {
				return false
			}

			// 違うミノ持ってかれないように
			// 回転前のミノの空の位置が、回転後の埋まっていないミノの位置で、回転後のfieldsが埋まってたら無視
			if (
				!activeMino[beforeMinoY][beforeMinoX].value && // 回転前のミノの位置が空
				!activeMino[afterMinoY][afterMinoX].value && // 回転後のミノの位置が空
				fields[afterFieldY][afterFieldX] // 回転後のフィールドの位置が埋まってる
			) {
				continue
			}

			// 回転前のミノの空の位置が、fieldsが埋まってたら、両方の回転後の位置にnullを代入
			if (
				!activeMino[beforeMinoY][beforeMinoX].value && // 回転前のミノの位置が空
				fields[beforeFieldY][beforeFieldX] // 回転前のフィールドの位置が埋まってる
			) {
				testActiveMino[afterMinoY][afterMinoX].value = null
				testFields[afterFieldY][afterFieldX] = null
				continue
			}

			// 回転
			// ミノ、フィールドそれぞれ、回転後の位置に回転前の値を代入
			testActiveMino[afterMinoY][afterMinoX].value =
				activeMino[beforeMinoY][beforeMinoX].value
			testFields[afterFieldY][afterFieldX] = fields[beforeFieldY][beforeFieldX]
		}
	}

	return { fields: testFields, activeMino: testActiveMino }
}

export const ableToRotateRight = (
	fields: Field[][],
	activeMino: ActiveMino
) => {
	return ableToRotate(fields, activeMino, 'right')
}

export const ableToRotateLeft = (fields: Field[][], activeMino: ActiveMino) => {
	return ableToRotate(fields, activeMino, 'left')
}
