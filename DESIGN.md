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

#### GameConstants (src/constants/game-constants.js)
| 定数 | 値 | 用途 |
|---|---|---|
| VIEWS | `['NORTH','EAST','SOUTH','WEST']` | 視点配列（循環インデックス基準） |
| ERROR_MS | `500` | 入力エラー演出のハイライト継続時間 (ms) |
| RELOAD_MS | `5000` | クリア演出後タイトル復帰までの待機時間 (ms) |

- CLEAR_MESSAGES:
  - `EASY:   '【初級踏破】 記憶の断片を回収した。'`
  - `NORMAL: '【中級完遂】 深淵の迷宮を突破した。'`
  - `HARD:   '【上級超越】 全ての因果を解き明かした。'`

- ITEM_HINTS (アイテム説明文):
  - `wrench:   '古いレンチだ。'`
  - `glasses:  'レンズに「2856」と見える。'`
  - `oil:      '機械油だ。'`
  - `tape:     '絶縁テープ。'`
  - `bar:      '重い鉄の棒。'`
  - `desk_key: '銀色の小さな鍵。'`

#### CodeDefinitions (src/constants/code-definitions.js)
- DIFFICULTY: `{ EASY: 'EASY', NORMAL: 'NORMAL', HARD: 'HARD' }`
- LEVEL_MAP: `{ EASY: LEVEL_BEGINNER, NORMAL: LEVEL_ADVANCED, HARD: LEVEL_ELITE }`

### 3.3 レベル定義

#### LEVEL_BEGINNER (src/levels/beginner-level.js)
| 項目 | 値 |
|---|---|
| id | `'EASY'` |
| code（脱出コード） | `'742'` |
| msg（導入文） | `'初級モード開始。探索を始めてください。'` |
| 構造 | 単一部屋、4 視点 (NORTH〜WEST) |

- 解法フロー:
  1. `driver (🪛)` を WEST の箱から取得する。
  2. SOUTH の額縁に driver を使うと `数字：742` が出現する。
  3. EAST の錠前に actions → toggleModal(true) でコード入力 `742` を解除する。
  4. 錠前が open になり EAST で `key (🗝️)` を取得する。
  5. NORTH の出口に key を装備した状態で使うと `clear()` が発動する。

#### LEVEL_ADVANCED (src/levels/advanced-level.js)
| 項目 | 値 |
|---|---|
| id | `'NORMAL'` |
| code（脱出コード） | `'931'` |
| msg（導入文） | `'中級：静寂の二連室。仕掛けを連鎖させよ。'` |
| startRoom | `'STUDY'` |
| 部屋 | STUDY（書斎）/ HALLWAY（廊下）/ STORAGE（物置） |

- 解法フロー:
  1. HALLWAY ゴミ箱から `oil (🏺)` を取得する。
  2. STORAGE 段ボールから `tape (巻)` と `bar (🔨)` を取得する。
  3. STORAGE 床板に bar を使い `fuse (🔋)` を取得する。
  4. HALLWAY 配線に tape + fuse で `powerOn = true`（通電）。
  5. STUDY 机に oil で `deskOpen = true` → `脱出コード：931` を確認。
  6. STORAGE 金庫が powerOn のときコード入力 `931` で `goalOpen = true`。
  7. STUDY 出口でクリア。

#### LEVEL_ELITE (src/levels/elite-level.js)
| 項目 | 値 |
|---|---|
| id | `'HARD'` |
| code（脱出コード） | `'5856'` |
| stone（石碑の数値） | `'3000'` |
| msg（導入文） | `'究極試練：五界の連鎖。全ての因果を解き明かした。'` |
| startRoom | `'HALL'` |
| 部屋 | HALL / GARDEN / LIBRARY / WORKSHOP / UNDERGROUND / SECRET |

- 解法フロー（コード生成: stone＋PC表示）:
  1. LIBRARY 棚から `old_key (🔑)` を取得する。
  2. GARDEN 物置に old_key を使い `oil (🛢️)` を取得する。
  3. WORKSHOP 機械に oil で `glasses (👓)` を取得し `machineFixed = true`。
  4. WORKSHOP に移動し `bar (🔨)` を取得する。
  5. UNDERGROUND に移動し bar で配電盤を開け `powerOn = true`。
  6. LIBRARY 本棚に oil で `leverFixed = true`、次に lever を引き地下へ通路開通 `pathLibrary = true`。
  7. LIBRARY 日記に glasses で `hintRead = true`（「中庭の数値＋PCコード」ヒント）。
  8. UNDERGROUND 設計図を読み `bluePrintRead = true`。
  9. WORKSHOP PC が powerOn のとき「管理コード：5856」を確認する。
  10. HALL 壁画に bar で条件（bluePrintRead + hintRead + powerOn）全満足 → `pathHall = true`。
  11. HALL から SECRET（隠し部屋）へ移動する。
  12. SECRET 金庫にコード入力 → stone(`3000`) + code(`5856`) → `goalOpen = true`。
  13. HALL 出口でクリア。
  - 補足: SECRET の小窓では「石碑の 3000 が見える」ヒントが表示される。

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

## 6. 入力検証 / セキュリティ実装詳細

### 6.1 Validator クラス

#### 6.1.1 isValidLevel
- 実装:
  ```
  level && typeof level === 'object'
  && typeof level.id === 'string'
  && typeof level.code === 'string'
  ```
- 用途: start() でレベル定義オブジェクトが必要キーを持つか確認する

#### 6.1.2 isValidViewIndex
- 実装: `Number.isInteger(index) && index >= 0 && index < viewsLength`
- 用途: 視点切替時に配列外参照を防ぐ

#### 6.1.3 isValidCodeInput
- 実装: `typeof value === 'string' && value.trim().length > 0`
- 用途: unlock() で空入力のコードを拒否する

### 6.2 XSSProtection クラス

#### 6.2.1 sanitize
- 変換テーブル:
  - `&` → `&amp;`
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `"` → `&quot;`
  - `'` → `&#x27;`
- 実装パターン: `/[&<>"']/g` を map 引きで置換
- 用途: say() メソッドからナレーション文字列を表示する前に必ず経由する
- 分岐:
  - a. value が string でない場合: 変換せずそのまま返す
- 制約: プレイ状態はメモリのみで保持し、永続化は行わない

## 7. DOM セレクター一覧

### 7.1 EscapeGameController が取得する DOM
| id | 役割 |
|---|---|
| `title-screen` | タイトル画面コンテナ（is-hidden で非表示） |
| `object-container` | 調査対象を差し替えるメインビュー |
| `room-label` | ヘッダーへ部屋名・方角を表示する |
| `narrator` | ナレーションテキストを表示する |
| `dial-overlay` | コード入力モーダル（is-active で表示） |
| `code-input` | コード入力 input 要素 |
| `clear-overlay` | クリア演出オーバーレイ |
| `clear-message` | クリア文言を差し込む要素 |
| `btn-left` | 視点を左（-1）に回転するボタン |
| `btn-right` | 視点を右（+1）に回転するボタン |
| `btn-menu` | メニューへ戻るボタン |
| `code-unlock` | コード確認ボタン |
| `code-close` | モーダルを閉じるボタン |

### 7.2 クラスセレクター
| class | 役割 |
|---|---|
| `.diff-btn` | 難易度選択ボタン（`data-level` に `EASY / NORMAL / HARD` を持つ） |
| `.item-slot` | 所持品スロット（`data-key` にアイテムキーを保持する） |
| `.prop` | 各視点の調査対象 DOM に付与するクラス |
| `.is-hidden` | タイトル画面や演出要素の非表示制御 |
| `.is-active` | コード入力モーダルの表示制御 |
| `.selected` | 選択中の所持品スロットを強調する |
| `.input-error` | コード入力エラー時のハイライト演出 |
