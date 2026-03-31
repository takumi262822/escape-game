/**
 * StyleManager クラス
 * @author Takumi Harada
 * @date 2026-03-31
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
