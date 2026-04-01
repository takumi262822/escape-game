/**
 * XSSProtection クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * XSSProtection クラス
 * 目的: XSS対策を担当し表示データを安全化する
 * 入力: ユーザー入力値・表示対象文字列
 * 処理: 危険文字のエスケープや正規化を行う
 * 出力: 安全化された文字列
 * 補足: DOM反映前に本クラスを経由する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class XSSProtection {
    static sanitize(value) {
        if (typeof value !== 'string') {
            return value;
        }
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        };
        return value.replace(/[&<>"']/g, (char) => map[char] || char);
    }
}
