/**
 * StyleManager クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * StyleManager クラス
 * 目的: 画面演出・スタイル関連の処理を担当する
 * 入力: 対象DOM・操作イベント
 * 処理: 視覚効果の初期化と更新を行う
 * 出力: 演出が反映されたUI状態
 * 補足: 効果ごとにメソッドを分離して保守性を高める
 * @author Takumi Harada
 * @date 2026-04-01
 */
/**
 * 処理概要:
 * - 共通処理: DOM 要素への class 追加、削除、切替を静的メソッドで提供する
 * - 画面制御: タイトル非表示やモーダル表示など見た目の状態遷移を補助する
 * - 出力処理: Controller 側から簡潔にスタイル更新を呼び出せるようにする
 */
export class StyleManager {
    static addClass(element, className) {
        element?.classList.add(className);
    }

    static removeClass(element, className) {
        element?.classList.remove(className);
    }

    static toggleClass(element, className, force) {
        element?.classList.toggle(className, force);
    }
}
