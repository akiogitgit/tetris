## テトリス

このURLから遊べます

https://svelte-tetris-ruby.vercel.app/

- 動作プラットフォーム: Windows
- 開発プラットフォーム: Windows
- 開発言語: HTML/CSS, JavaScript(TypeScript)
- 利用ライブラリ(フレームワーク): Svelte, Windi CSS

![CPT2306050842-331x593](https://github.com/akiogitgit/tetris/assets/88410576/91b433cd-83ec-4a7f-a69f-1b013ff751cd)

![CPT2306050849-332x597](https://github.com/akiogitgit/tetris/assets/88410576/4536e060-4693-43a2-bc44-743bf1f4375a)

![image](https://github.com/akiogitgit/tetris/assets/88410576/8e0c9007-d4d2-4c56-b273-ad8c7595fcd9)


## 変数・関数の説明

### +pageで定義している変数関数
変数
- fields
  - テトリスのマスを表示するフィールド
  - 型：　null | 'I' | 'O' | 'S' | 'Z' | 'J' | 'L' | 'T' （Field）が二次元配列で入る
- nextMinos
  - 次のミノを保持する変数
  - Field が三次元配列で入る
    - ミノ自体は二次元配列だから
- activeMino
  - 現在捜査しているミノを保持する変数
  - 型：　{ y: number; x: number; value: Field }[][] (ActiveMino)
    - y, xは左上を軸とした座標の位置、valueは見える場所は'I' | 'O' | 'S' | 'Z' | 'J' | 'L' | 'T'のどれかが入り、見えない場所は null が入る。
- dropPoint
  - 現在操作しているミノが落ちる位置を保持する変数
    - ゴーストブロック、ハードドロップで使う
  - 型：　ActiveMino
- isFinished
  - ゲームが終了したかを保持する変数
  - 型：　boolean
- isPaused
  - ゲームが止まっているかを保持する変数
  - 型：　boolean
- score
  - ゲームのスコア。1ライン消すと50点、2ラインで200点、3は450点、4は800点
  - 型：　number
- deletedLines
  - 消したラインの合計
  - 型：　number
- level
  - ゲームの難易度。1レベル上がる毎と累乗的に落下間隔が短くなる
  - 型：　number
- dropSpeed
  - ミノの落下速度
    - 初期値は0.8。レベル2で0.64
  - 型：　number

関数
- spawnMinoInField
  - ミノを出現させるのと、終了判定をする関数
    - ミノを初期位置に出現させる時、ミノを出現させる全てのマスの位置が埋まっていなければfieldsにセットする。
    - 一つでも埋まっていたらゲームオーバー
- changeNextMino
  - nextMinosの先頭を取得し、`getNextActiveMino`を実行し整形してactiveMinoに代入
  - nextMinosが2つ以下になったら、`getRandomMinos`を実行して補充する
  - `spawnMinoInField`を実行し、新しいactiveMinoを初期値にセットする
  - ミノが変わるのでdropPointを、`getDropPoint`を実行して更新
- deleteLine
  - `ableToDleleteLine`を実行して、消せるラインがなければ終了
  - 消した後のfieldsを更新
  - 消した行数を元に、score, deletedLines, level, dropSpeedを更新
  - `startGame`を実行し、落下間隔をdropSpeedに更新
- startGame
  - ミノを一定間隔で落下させるインターバル
  - 最初にこのインターバルをクリアする（インターバルの間隔を更新するため）
  - activeMinoが空なら`changeNextMino`を実行し終了
  - isFinished, isPausedなら終了
  - `ableToSlideDown`を実行し、activeMinoを一つ下に落下させることが出来るかをチェック
  - 落とせないなら、着地したということなので、`deleteLine`, `changeNextMino`を実行
  - 落とせるなら、fields, activeMinoを落とした後の状態に更新
- onSlideDown
  - ミノを一つ下に動かす関数
  - `ableToSlideDown`を実行して下に動かせるなら、fields, activeMinoを落とした後の状態に更新
- onMoveMino
  - 上の一つ下に動かす関数以外の一つ動かす関数の結果を元に、fields, activeMinoを更新する関数
  - 引数で{fields: Field[][]; activeMino: ActiveMino}を受け取りfields, activeMinoを落とした後の状態に更新
  - dropPointも更新
- onHardDrop
  - ハードドロップをする関数
  - `execHardDrop`を実行し、その時のfields, activeMinoを落とした後の状態に更新
  - ハードドロップはミノが着地するので、`deleteLine`, `changeNextMino`も実行する

Field, NextMinos, Scoreboard, KeyboardGuidsは+pageからの引数を表示しているだけ
### ControlPanelで定義している関数
関数
- handleKeydown
  - `<svelte:window on:keydown={handleKeydown} />`で押したキーを取得する
  - isFinished、isPausedのどちらかがtrueなら終了
  - キー操作
    - 押したキーが、右、左、上、下、Z、X、Spaceに応じて処理を実行
      - 右、左、下は移動
      - 上・Xは右回転、Zは左回転
      - Spaceはハードドロップ
      - pはPause
    - この結果がfalseでないなら、`onMoveMino`に結果を送る
- onClickMoveButton
  - ボタンを押したときの処理（下・Space・Pauseボタンを除く）
  - 上と同様に、isFinished、isPausedのどちらかがtrueなら終了
  - この結果がfalseでないなら、`onMoveMino`に結果を送る


## src下のファイルの説明
- components
  - ComtrolPanel
    - 引数
      - fields: Field[][]
      - isFinished: boolean
      - isPaused: boolean
      - activeMino: ActiveMino
      - onMoveMino: (v: {fields: Field[][]; activeMino: ActiveMino}) => void
      - onSlideDown: () => void
      - onHardDrop: () => void
    - 操作するボタン、キー操作を受け取るコンポーネント
  - Fields
    - 引数
      - fields: Field[][]
      - dropPoint: ActiveMino
    - テトリスのフィールドを表示
  - KeyboardGuide
    - PC時のキーボード操作の説明を表示
  - NextMinos
    - 引数
      - randomMinos: Field[][][]
    - 次に落ちてくるミノを2つ表示する
  - Scoreboard
    - 引数
      - level: number
      - deletedLines: number
      - score: number
    - レベル、消したライン数、スコアを表示
- routes
  - +layout
    - +pageをラップする
    - meta情報、画面のレイアウト、CSSのimportをする
  - +page
    - ページファイル。
    - ページタイトル、Fields、NextMino、ControlPanelやスコア、操作説明を表示する
  - game.ts
    - リバーシの純粋関数のロジックを定義
    - getPutAbleAllField、checkPutAbility、getReverseFields を定義
