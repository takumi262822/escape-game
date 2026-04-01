/**
 * GameConstants クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * GameConstants クラス
 * 目的: アプリ全体で再利用する定数・コード定義を管理する
 * 入力: なし（静的参照）
 * 処理: 定数を用途別に定義し参照しやすく整理する
 * 出力: 画面制御や判定で使用する不変値
 * 補足: 変更時は参照側ロジックの影響を確認する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class GameConstants {
    static VIEWS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    static ERROR_MS = 500;
    static RELOAD_MS = 5000;

    static CLEAR_MESSAGES = Object.freeze({
        EASY: '【初級踏破】 記憶の断片を回収した。',
        NORMAL: '【中級完遂】 深淵の迷宮を突破した。',
        HARD: '【上級超越】 全ての因果を解き明かした。'
    });

    static ITEM_HINTS = Object.freeze({
        wrench: '古いレンチだ。',
        glasses: 'レンズに「2856」と見える。',
        oil: '機械油だ。',
        tape: '絶縁テープ。',
        bar: '重い鉄の棒。',
        desk_key: '銀色の小さな鍵。'
    });
}
