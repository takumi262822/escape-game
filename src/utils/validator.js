/**
 * レベルデータ．視点インデックス．暗証番号入力の形式チェックを行うバリデーションクラス。
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class Validator {
    static isValidLevel(level) {
        return level && typeof level === 'object' && typeof level.id === 'string' && typeof level.code === 'string';
    }

    static isValidViewIndex(index, viewsLength) {
        return Number.isInteger(index) && index >= 0 && index < viewsLength;
    }

    static isValidCodeInput(value) {
        return typeof value === 'string' && value.trim().length > 0;
    }
}
