# 設計書: Escape Game Portfolio

## 1. 文書概要

### 1.1 目的
本書は Escape Game Portfolio の実装設計書である。画面構成や演出の説明は SCREEN-OVERVIEW.md に分離し、本書ではゲーム進行、部屋遷移、アイテム管理、入力検証の実装をクラス単位・メソッド単位・主要分岐単位で整理する。

### 1.2 対象範囲
- ゲーム起動と難易度開始
- 部屋移動、視点切替、調査対象描画
- コード入力解除、所持品管理、クリア演出
- レベル定義、定数、入力検証、XSS 対策

### 1.3 対象外
- サーバーサイド保存
- マルチエンド分岐の外部データ化
- 音声演出や 3D 表示
- プレイヤーアカウント管理

## 2. システム構成

### 2.1 モジュール構成
| 区分 | ファイル | 役割 |
|---|---|---|
| エントリー | src/main.js | Main を生成しアプリを起動する |
| 起動制御 | src/core/main.js | EscapeGameController の生成責務を持つ |
| 進行制御 | src/core/game-controller.js | 難易度開始、移動、解除、クリアを統括する |
| 定数 | src/constants/game-constants.js | 視点配列、演出時間、クリア文言、アイテムヒントを管理する |
| 定義 | src/constants/code-definitions.js | 難易度とレベルデータの対応を管理する |
| UI | src/ui/header.js | 部屋名と方角のヘッダー表示を更新する |
| UI | src/ui/components.js | 調査対象 DOM、インベントリ UI の共通操作を提供する |
| スタイル | src/styles/style-manager.js | class 付け外しを抽象化する |
| 検証 | src/utils/validator.js | レベル定義、視点インデックス、コード入力を検証する |
| セキュリティ | src/utils/xss.js | ナレーション等の文字列を安全化する |

### 2.2 起動シーケンス
1. index.html が src/main.js を module として読み込む。
2. src/main.js が Main を生成し init() を呼ぶ。
3. Main.init() が EscapeGameController を生成する。
4. EscapeGameController.init() が難易度選択、移動、入力ダイアログ、所持品イベントを登録する。
5. 難易度選択後に start() が呼ばれ、レベルデータを元に探索画面へ遷移する。

## 3. データ設計

### 3.1 ゲーム状態
| 項目 | 型 | 内容 |
|---|---|---|
| level | object \| null | 現在のレベル定義 |
| room | string | 現在の部屋キー |
| view | number | 現在視点インデックス |
| inventory | Set | 所持アイテムキー |
| activeItem | string \| null | 選択中アイテム |
| flags | object | 謎解き進行フラグ |

### 3.2 主な定数
- GameConstants.VIEWS: NORTH, EAST, SOUTH, WEST
- GameConstants.ERROR_MS: 入力エラー演出時間
- GameConstants.RELOAD_MS: クリア演出後の復帰時間
- GameConstants.CLEAR_MESSAGES: 難易度別クリア文言
- GameConstants.ITEM_HINTS: アイテム調査文言

## 4. 詳細設計

### 4.1 Main クラス

#### 4.1.1 constructor
- 役割: controller 参照を null で初期化する。

#### 4.1.2 init
- I/F:
  - 入力: なし
  - 出力: 初期化済み EscapeGameController
- 処理:
  1. EscapeGameController を生成する。
  2. 以後の進行制御を controller へ委譲する。

### 4.2 EscapeGameController クラス

#### 4.2.1 constructor
- I/F:
  - 入力: title-screen、object-container、room-label、narrator などの DOM
  - 出力: 初期化済み controller
- 処理:
  1. resetState() で内部状態を初期化する。
  2. 主要 DOM をまとめて取得する。
  3. Header を生成する。
  4. init() を呼びイベント登録する。

#### 4.2.2 resetState
- I/F:
  - 入力: なし
  - 出力: 初期化済み state オブジェクト
- 処理:
  1. level、room、view、inventory、activeItem、flags を初期値へ戻す。

#### 4.2.3 init
- I/F:
  - 入力: .diff-btn、btn-left、btn-right、btn-menu、code-unlock、code-close、item-slot
  - 出力: 探索操作のイベント登録
- 処理:
  1. 難易度ボタンから CodeDefinitions.getLevelByDifficulty() を呼ぶ。
  2. 左右移動、タイトル復帰、解除ダイアログ操作を登録する。
  3. インベントリスロット選択を登録する。

#### 4.2.4 start
- I/F:
  - 入力: levelData
  - 出力: プレイ開始状態
- 処理:
  1. Validator.isValidLevel() でレベル定義を検証する。
  2. resetState() で前回状態を初期化する。
  3. 現在レベル、開始部屋、導入メッセージを設定する。
  4. タイトル画面を隠し render() を実行する。
- 分岐:
  - a. レベル定義が不正な場合: 準備中メッセージを表示し終了する。
  - b. startRoom が未設定の場合: ROOT を初期部屋にする。

#### 4.2.5 changeRoom
- I/F:
  - 入力: 次部屋キー
  - 出力: room、view の更新と再描画
- 処理:
  1. 現在部屋キーを更新する。
  2. 視点を 0 に戻す。
  3. 移動メッセージを出して render() する。

#### 4.2.6 move
- I/F:
  - 入力: dir
  - 出力: view 更新
- 処理:
  1. GameConstants.VIEWS の範囲で view を循環更新する。
  2. render() を呼び、同じ部屋内の視点のみ切り替える。

#### 4.2.7 say
- 役割: XSSProtection.sanitize() を通したメッセージを narrator へ表示する。

#### 4.2.8 toggleModal
- I/F:
  - 入力: visible
  - 出力: ダイアログ開閉状態
- 処理:
  1. dial-overlay の is-active を切り替える。
  2. 表示時は code-input に focus する。

#### 4.2.9 render
- I/F:
  - 入力: level.rooms、room、view、state
  - 出力: object-container、room-label の更新
- 処理:
  1. 現在レベルと現在部屋を取得する。
  2. 部屋内 view があればその視点データを使う。
  3. Header.update() で部屋名と方角を更新する。
  4. UIComponents.createPropElement() で調査対象 DOM を作る。
  5. clearAndAppend() で画面差し替えを行う。
- 分岐:
  - a. level が未設定の場合: 描画しない。
  - b. currentRoom がある場合: rooms 配下の view を使う。
  - c. currentRoom がない場合: 直下の views を使う。
  - d. viewData.action がある場合: action(this) を実行する。
  - e. action がなく onAction がある場合: onAction(this) を実行する。

#### 4.2.10 getItem
- I/F:
  - 入力: item key、icon
  - 出力: inventory、slot 表示更新
- 処理:
  1. 同一アイテム所持済みなら終了する。
  2. 空スロットを取得する。
  3. inventory に追加し、スロットへ icon と key を設定する。
  4. 取得メッセージを出して render() する。
- 分岐:
  - a. 既に所持済みの場合: 重複取得しない。
  - b. 空スロットが無い場合: 追加しない。

#### 4.2.11 handleSlot
- I/F:
  - 入力: クリックされた slot
  - 出力: activeItem 更新または inspect 実行
- 処理:
  1. slot の key を取得する。
  2. 既に選択中のアイテムなら inspect() を呼ぶ。
  3. それ以外は選択状態をクリアして新しい activeItem を設定する。
  4. スロットへ selected を付けて render() する。
- 分岐:
  - a. key が無いスロット: 何もしない。
  - b. 同じ key を再クリック: 調査モードに入る。

#### 4.2.12 inspect
- 役割: ITEM_HINTS を参照し、所持アイテムの説明を narrator へ表示する。

#### 4.2.13 unlock
- I/F:
  - 入力: code-input の値
  - 出力: flags 更新、モーダル制御、エラー演出
- 処理:
  1. Validator.isValidCodeInput() で空入力を弾く。
  2. 正解コードと比較する。
  3. 一致時は goalOpen と open を true にし、モーダルを閉じて render() する。
  4. 不一致時は input-error を一時付与する。
- 分岐:
  - a. 入力が空の場合: 入力要求メッセージを出して終了する。
  - b. 正解時: ロック解除ルートへ進む。
  - c. 不正解時: エラー演出のみ行う。

#### 4.2.14 clear
- I/F:
  - 入力: 現在難易度 ID
  - 出力: clear-overlay 表示後トップ復帰
- 処理:
  1. 難易度別クリア文言を表示する。
  2. clear-overlay を表示する。
  3. 一定時間後に overlay を閉じて toTop() を呼ぶ。

#### 4.2.15 toTop
- I/F:
  - 入力: なし
  - 出力: タイトル画面表示、状態初期化
- 処理:
  1. title-screen の is-hidden を外す。
  2. UIComponents.resetSlots() で所持品 UI を初期化する。
  3. resetState() を実行する。
  4. 初期メッセージを表示する。

### 4.3 CodeDefinitions クラス

#### 4.3.1 DIFFICULTY
- 役割: EASY、NORMAL、HARD の内部コードを固定化する。

#### 4.3.2 LEVEL_MAP
- 役割: 各難易度コードと各レベル定義モジュールの対応表を提供する。

#### 4.3.3 getLevelByDifficulty
- I/F:
  - 入力: difficulty
  - 出力: 対応する level 定義または null
- 分岐:
  - a. 対応するコードが存在する場合: レベル定義を返す。
  - b. 存在しない場合: null を返す。

### 4.4 Validator / UIComponents / StyleManager

#### 4.4.1 Validator.isValidLevel
- 役割: レベル定義の存在と必要項目を検証する。

#### 4.4.2 Validator.isValidCodeInput
- 役割: 暗号入力の空値を防ぐ。

#### 4.4.3 UIComponents.createPropElement
- 役割: 調査対象の DOM を生成し、行動イベントを結び付ける。

#### 4.4.4 UIComponents.getEmptySlot / resetSlots / clearAndAppend
- 役割: 所持品 UI と描画コンテナを補助する。

#### 4.4.5 StyleManager.addClass / removeClass / toggleClass
- 役割: 画面状態変化を class 操作へ集約する。

## 5. 非機能要件
- 実行環境: Chrome / Edge 最新版、ローカルサーバー経由
- 品質ゲート: npm run lint、npm test、GitHub Actions CI
- 制約: プレイ状態はメモリのみで保持し、永続化は行わない
