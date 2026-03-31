/**
 * Validator クラス
 * @author Takumi Harada
 * @date 2026-03-31
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
