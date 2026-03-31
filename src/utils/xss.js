/**
 * XSSProtection クラス
 * @author Takumi Harada
 * @date 2026-03-31
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
