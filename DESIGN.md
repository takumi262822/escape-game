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

### 3.2 定数・レベル定義

定数の具体値は `docs/定数定義書.adoc`、レベル定義・識別子の種別値は `docs/コード定義書.adoc` を参照すること。

## 4. 設計方針

### 4.1 状態の一元管理

EscapeGameController が level / room / view / inventory / activeItem / flags を一元管理する。各操作（移動・調査・使用・解除）はコントローラーの state を変化させ、render() で画面を再描画する。

### 4.2 データ主導のレベル設計

レベル定義ファイル（levels/ 以下）が「部屋構造・調査対象・アイテム定義・脱出コード」を保持し、コントローラーはデータを解釈するのみ。新ステージの追加はレベルファイルの追加と CodeDefinitions への 1 行追記で完結する。

### 4.3 入力検証

Validator.isValidLevel() がレベルデータの整合性を検証し、不正データ時は「準備中」メッセージを表示して起動を停止する。視点インデックスと脱出コード文字列も同クラスで検証する。

### 4.4 XSS 対策

ナレーション・調査テキストの DOM 挿入には textContent を使用し、xss.js の XSSProtection.escape() を経由することで動的文字列の安全性を確保する。

## 5. 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| README.md | プロジェクト概要・実行手順 |
| SCREEN-OVERVIEW.md | 画面構成・遷移・UI 説明 |
| docs/機能設計書.adoc | クラス・メソッド・分岐単位の詳細仕様 |
| docs/コード定義書.adoc | 識別子・種別コードの定義 |
| docs/定数定義書.adoc | 定数値・設定値一覧 |
