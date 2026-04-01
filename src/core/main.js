import { EscapeGameController } from './game-controller.js';

/**
 * Main クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * Main クラス
 * 目的: アプリ/ゲームの進行制御を担当する
 * 入力: 初期データ・現在状態・ユーザー操作
 * 処理: 初期化・分岐・状態更新を実行する
 * 出力: 進行更新された画面状態
 * 補足: 各下位クラスの責務を束ねる
 * @author Takumi Harada
 * @date 2026-04-01
 */
/**
 * 処理概要:
 * - 初期化処理: EscapeGameController を生成してゲーム開始準備を行う
 * - 進行処理: エントリーポイントとして画面ロード時の起動順序を単純化する
 * - 出力処理: Controller 初期化後のゲーム画面へ制御を委譲する
 */
export class Main {
    constructor() {
        this.controller = null;
    }

    init() {
        this.controller = new EscapeGameController();
    }
}
