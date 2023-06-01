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
export const ableToSlideDown = (
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

export const ableToSlideRight = (fields: Field[][], activeMino: ActiveMino) => {
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

export const ableToSlideLeft = (fields: Field[][], activeMino: ActiveMino) => {
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

export const ableToDeleteLine = (
	fields: Field[][],
	activeMino: ActiveMino
): false | Field[][] => {
	const testFields = structuredClone(fields)
	const topActiveMinoY = activeMino[0][0].y // activeMinoの左上のマスの高さ
	const nullLine: Field[] = [...Array(FIELD_WIDTH)].map(() => null) // 空の行

	let deleteLineCount = 0
	let bottomDeleteLineY = 0 // 一番下の消した時の行の高さ

	// 行を消す処理
	// activeMinoの高さの行を一列ずつ全て埋まっているか確認
	for (let iy = topActiveMinoY; iy < topActiveMinoY + activeMino.length; iy++) {
		if (iy >= FIELD_HIGHT) break // 下にはみ出たらループを抜ける

		for (let ix = 0; ix < FIELD_WIDTH; ix++) {
			if (ix < 0 || ix >= FIELD_WIDTH) continue

			const field = fields[iy][ix]
			if (!field) break // 空ならこの行は消せない

			// このiyの行が全て埋まっている
			if (ix === FIELD_WIDTH - 1) {
				testFields[iy] = [...nullLine] // testFieldsのiyの行を消す
				deleteLineCount++
				bottomDeleteLineY = iy
			}
		}
	}

	// 下に下げる処理
	let nextDropY = bottomDeleteLineY // 次の下ろす行の高さ, 地面から連続している行の高さ

	// 一番下の消した行-1 ~ フィールドの一番上の座標までループ
	for (let iy = bottomDeleteLineY - 1; iy > 2; iy--) {
		const fieldLine = testFields[iy]
		const isLineNull = !fieldLine.find(v => v !== null)

		// topActiveMinoYより上からは、行が空なら終了
		if (iy < topActiveMinoY && isLineNull) break
		if (isLineNull) continue // topActiveMinoYより下で空の列なら無視

		// 自分が落ちる高さに自分の行を代入し、自分の行を空行にする
		testFields[nextDropY] = [...fieldLine]
		testFields[iy] = [...nullLine]
		nextDropY-- // 次の落ちる高さを1つ上にする
	}

	if (deleteLineCount) return testFields
	return false // 消す行ない
}

export const getDropPoint = (
	fields: Field[][],
	activeMino: ActiveMino
): ActiveMino => {
	// 着地した時のactiveMinoの一番上の高さが分かれば良さそう？
	// xはactiveMinoの横幅でOK
	// フィールドの高さ
	let dropPointY = activeMino[0][0].y

	const fn = () => {
		for (
			// let iy1 = activeMino[activeMino.length - 1][0].y;
			let iy1 = activeMino[0][0].y;
			iy1 < FIELD_HIGHT - activeMino.length + 2;
			iy1++
		) {
			// activeMinoの高さ
			for (let iy2 = 0; iy2 < activeMino.length; iy2++) {
				// activeMinoの横幅
				for (let ix = 0; ix < activeMino[0].length; ix++) {
					const realX = activeMino[0][ix].x
					const realY = iy1 + iy2
					const mino = activeMino[iy2][ix] // activeMinoの位置
					console.log(iy1, iy2, realY)

					if (!mino.value) continue // nullは無視
					if (
						realX < 0 || // 左にはみ出る
						realX >= FIELD_WIDTH // 右にはみ出る
					) {
						continue
					}
					if (
						realY >= FIELD_HIGHT // 下にはみ出る
					) {
						return
					}
					const field = fields[realY][realX]

					// ぶつかったのが自分でないなら
					if (field) {
						// 下のフィールドが自分
						const isSelfCollision = activeMino
							.flat()
							.find(pos => pos.x === realX && pos.y === realY)

						if (!isSelfCollision) {
							console.log({ realX }, { realY }, 'ぶつかった')
							return
						}
					}
				}
			}

			dropPointY = iy1
		}
	}
	fn()

	const dropPoint = activeMino
		.map((_, iy) => _.map(v => ({ ...v, y: dropPointY + iy })))
		.map(_ => _.filter(v => v.value))
	return dropPoint
}

// 置くときは、その位置にactiveMinoのvalueを入れて、changeNextMino
// export const getDropPoint = (
// 	fields: Field[][],
// 	activeMino: ActiveMino
// ): ActiveMino => {
// 	// ミノを表示している部分で取得（activeMino）
// 	// const leftActiveMinoX = activeMino[0][0].x
// 	// const length = activeMino.length
// 	// const bottomActiveMinoY = activeMino[activeMino.length - 1][0].y

// 	if (!activeMino.length) return []

// 	let leftActiveMinoX = FIELD_WIDTH
// 	let rightActiveMinoX = 0
// 	let topActiveMinoY = FIELD_HIGHT
// 	let bottomActiveMinoY = 0
// 	for (let iy = 0; iy < activeMino.length; iy++) {
// 		for (let ix = 0; ix < activeMino[0].length; ix++) {
// 			const mino = activeMino[iy][ix]
// 			if (!mino.value) continue
// 			if (mino.x < leftActiveMinoX) leftActiveMinoX = mino.x
// 			if (mino.x > rightActiveMinoX) rightActiveMinoX = mino.x
// 			if (mino.y < topActiveMinoY) topActiveMinoY = mino.y
// 			if (mino.y > bottomActiveMinoY) bottomActiveMinoY = mino.y
// 		}
// 	}
// 	let height = bottomActiveMinoY - topActiveMinoY + 1

// 	console.log(
// 		{ leftActiveMinoX },
// 		{ rightActiveMinoX },
// 		{ topActiveMinoY },
// 		{ bottomActiveMinoY },
// 		{ height }
// 	)

// 	// dropPintYを見つける
// 	let dropPointY = bottomActiveMinoY

// 	for (let iy = bottomActiveMinoY; iy < FIELD_HIGHT; iy++) {
// 		for (let ix = leftActiveMinoX; ix <= rightActiveMinoX; ix++) {
// 			// ミノの話

// 			// フィールドの話
// 			if (ix < 0 || ix >= FIELD_WIDTH) continue // 横にはみ出たら無視する
// 			const field = fields[iy][ix]
// 			if (field) break

// 			if (ix === rightActiveMinoX) {
// 				dropPointY = iy
// 			}
// 		}
// 	}

// 	// 落下地点yが分かれば、activeMinoループしてy: y+iyして返す
// 	// activeMinoの一行が全てnullなら消してから処理する

// 	// const dropPoint = activeMino.map((_, iy) =>
// 	// 	_.map((v, ix) => ({ ...v, y: dropPointY - topActiveMinoY + 1 + iy }))
// 	// )
// 	const dropPoint = activeMino
// 		.map((_, iy) => _.map(v => ({ ...v, y: dropPointY - height + 1 + iy })))
// 		.map(_ => _.filter(v => v.value))

// 	console.log({ dropPointY }, dropPoint)
// 	return dropPoint
// }
