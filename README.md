## テトリス

このURLから遊べます

https://svelte-tetris-ruby.vercel.app/

- 動作プラットフォーム: Windows
- 開発プラットフォーム: Windows
- 開発言語: HTML/CSS, JavaScript(TypeScript)
- 利用ライブラリ(フレームワーク): Svelte, Windi CSS


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
  - NextMino
    - 引数
      - randomMinos: Field[][][]
    - 次に落ちてくるミノを2つ表示する
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
