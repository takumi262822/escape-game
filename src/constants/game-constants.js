/**
 * GameConstants クラス
 * @author Takumi Harada
 * @date 2026-03-31
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
