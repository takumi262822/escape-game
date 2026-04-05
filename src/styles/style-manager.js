/**
 * CSS クラスの追加・削除・切替を提供する静的ユーティリティクラス。
 * タイトル非表示やモーダル表示など画面遷移の稼動として使用する。
 * @author Takumi Harada
 * @date 2026/3/31
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
