/**
 * HTML 特殊文字を安全なエンティティに変換し、XSS を防ぐサニタイズクラス。
 * DOM 反映前に必ず経由する。
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class XSSProtection {
    static sanitize(value) {
        // 文字列型以外の値が渡された場合はそのまま返す
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
