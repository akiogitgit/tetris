<script lang="ts">
	import {
		ableToMoveRight,
		ableToMoveDown,
		ableToMoveLeft,
		ableToRotateRight,
		ableToRotateLeft
	} from '../routes/game'

	import Icon from '@iconify/svelte'
	import IconArrowLeft from '@iconify-icons/fa6-solid/arrow-left'
	import IconArrowDown from '@iconify-icons/fa6-solid/arrow-down'
	import IconRotate from '@iconify-icons/fa6-solid/rotate-right'
	import type { ActiveMino, Field } from '../routes/+page.svelte'

	export let isFinished: boolean
	export let fields: Field[][]
	export let activeMino: ActiveMino
	export let onMoveMino: (v: {
		fields: Field[][]
		activeMino: ActiveMino
	}) => void

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
			onMoveMino(res)
		}
	}

	const onClickMoveButton =
		(
			func: (
				fields: Field[][],
				activeMino: ActiveMino
			) =>
				| false
				| {
						fields: Field[][]
						activeMino: ActiveMino
				  }
		) =>
		() => {
			const res = func(fields, activeMino)
			if (!!res) {
				onMoveMino(res)
			}
		}
</script>

<!-- ボタン、キーボード操作 -->
<svelte:window on:keydown={handleKeydown} />

<div>
	<div class="text-center">
		<button on:click={onClickMoveButton(ableToRotateLeft)}>
			<Icon
				icon={IconRotate}
				height={40}
				width={40}
				class="border-black border-2 p-1"
			/>
		</button>
	</div>

	<div>
		<button on:click={onClickMoveButton(ableToMoveLeft)}>
			<Icon
				icon={IconArrowLeft}
				height={40}
				width={40}
				class="border-black border-2 p-1"
			/>
		</button>

		<button on:click={onClickMoveButton(ableToMoveDown)}>
			<Icon
				icon={IconArrowDown}
				height={40}
				width={40}
				class="border-black border-2 p-1"
			/>
		</button>
		<button on:click={onClickMoveButton(ableToMoveRight)}>
			<Icon
				icon={IconArrowLeft}
				height={40}
				width={40}
				rotate={90}
				class="border-black border-2 p-1"
			/>
		</button>
	</div>
</div>
