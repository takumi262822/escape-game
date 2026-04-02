# Escape Game Portfolio

企業提出向けに整備した脱出ゲームです。ES Modules とクラス分割により、責務を明確化しています。

## 1. 採用担当向けサマリー

- 目的: フロントエンド実装力とリファクタリング力を短時間で確認できる提出物
- 想定閲覧時間: 5-10分
- 見てほしい点: クラス分割、共通部品化、入力検証、安全な表示

## 2. 作成者情報

- 作成者: Takumi Harada
- 作成日: 2026-03-31
- ドキュメント最終更新日: 2026-03-31

## 3. ディレクトリ構成

```text
脱出ゲーム/
	index.html
	src/
		core/
		constants/
		levels/
		styles/
		ui/
		utils/
```

## 4. 実行方法

`type="module"` を利用しているため、`file://` 直開きではなくローカルサーバー経由で実行してください。

```powershell
cd C:\テスト\脱出ゲーム
python -m http.server 5503
```

ブラウザで `http://localhost:5503/index.html` を開きます。

## 5. 品質チェック（Lint / Test）

```powershell
cd C:\テスト\脱出ゲーム
npm install
npm run lint
npm run test
```

まとめて実行する場合:

```powershell
npm run check
```

CI: `.github/workflows/ci.yml`

### テスト方針

- `tests/core.test.js` でレベル定義、XSS 対策、難易度解決の3点を押さえ、進行に直結する基礎仕様を保護しています。
- テスト名は日本語に統一し、どの仕様を守るテストかがコードレビュー時にも分かりやすい形にしています。
- 謎解き演出の体験確認は手動、入力検証や定義解決のような再利用ロジックは自動テスト、という分担です。

## 6. 関連文書

- SCREEN-OVERVIEW.md: 画面構成、探索導線、UI の見せ方
- DESIGN.md: メイン制御、謎解き進行、レベル定義、主要分岐の説明

## 7. 5分評価ガイド

1. タイトル画面で難易度を選択
2. 画面遷移（LEFT/RIGHT）とインベントリ操作を確認
3. 暗号入力モーダルの解除と進行フラグ更新を確認
4. レベルクリア時の演出表示を確認
5. `src/core/game-controller.js` と `src/ui/components.js` を確認

## 8. 実装の工夫

- Main / Header / StyleManager / Validator / XSS をクラス分離
- コード定義を `constants` に集約して拡張容易性を確保
- 画面部品を `ui/components.js` に集約して重複を削減

## 9. 対応環境・既知の制約

- 推奨ブラウザ: Chrome / Edge の最新安定版
- スマホ表示: 主要画面はレスポンシブ対応
- 既知の制約: ビルドツール無し構成（理解容易性を優先）

## 10. 今後の改善

- レベル進行のシナリオテスト追加

## 11. 提出チェックリスト

- [ ] 起動手順が再現できる
- [ ] `npm run lint` / `npm test` が通る
- [ ] 主要導線（遷移・解除・クリア演出）が動作する
- [ ] README の評価ガイドに沿って説明できる
