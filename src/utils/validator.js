/**
 * Validator クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * Validator クラス
 * 目的: 入力検証を担当し判定ルールを統一する
 * 入力: フォーム入力値・データオブジェクト
 * 処理: 形式/範囲/必須条件を検証して真偽値を返す
 * 出力: 検証結果（boolean）
 * 補足: 画面側でエラー表示制御と組み合わせて利用する
 * @author Takumi Harada
 * @date 2026-04-01
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
