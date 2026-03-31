# 設計書: Escape Game Portfolio

## 1. 目的
- 開発目的: 脱出ゲームを題材に、画面状態と謎解き進行のクラス分離を示す。
- 評価してほしい点: Main中心の構成、UI部品化、検証/サニタイズ分離。

## 2. 画面構成・遷移
- 画面一覧:
  - タイトル/難易度選択 (`index.html`)
  - ゲーム画面（各難易度）
  - クリア表示
- 遷移:
  - タイトル -> 難易度開始
  - ルーム遷移（LEFT/RIGHT）
  - 謎解除 -> フラグ更新 -> クリア

## 3. クラス設計
| クラス | 責務 | 主なメソッド | 依存 |
|---|---|---|---|
| Main | 初期化と全体制御 | init | GameController, Header |
| GameController | ゲーム進行管理 | start, handleAction, updateState | CodeDefinitions, UIComponents |
| Header | ヘッダーUI制御 | init | DOM |
| UIComponents | モーダル・共通部品 | showModal, renderInventory | DOM |
| Validator | 入力/データ検証 | isValidLevel など | 定数 |
| XSSProtection | 表示データの安全化 | sanitize | DOM |

## 4. データ設計
- 定数: `src/constants/game-constants.js`
- コード定義: `src/constants/code-definitions.js`
- レベル定義: `src/levels/*.js`
- 永続化: 基本なし（プレイ中メモリ管理）

## 5. 非機能
- 命名規則: ファイル kebab-case、クラス PascalCase。
- 品質ゲート: `npm run lint`, `npm test`, GitHub Actions CI。
- 対応環境: Chrome / Edge 最新版推奨。
- 既知制約: ビルドツールなし（理解容易性優先）。

## 6. 今後改善
- シナリオ分岐のデータ駆動化。
- ルーム遷移の回帰テスト追加。

## 7. 提出チェックリスト
- [ ] 起動手順を第三者が再現できる
- [ ] lint/test が通る
- [ ] 謎解除フローと状態更新を説明できる
- [ ] 既知制約を説明できる
