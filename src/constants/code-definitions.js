import { LEVEL_BEGINNER } from '../levels/beginner-level.js';
import { LEVEL_ADVANCED } from '../levels/advanced-level.js';
import { LEVEL_ELITE } from '../levels/elite-level.js';

/**
 * 難易度コード（EASY/NORMAL/HARD）と各レベルデータの対応表を定義し、
 * 指定コードからレベル定義を返すクラス。
 * @author Takumi Harada
 */
/**
 * 定数概要:
 * - DIFFICULTY は難易度選択と内部判定で使うコード値
 * - LEVEL_MAP は難易度コードと各レベル定義の対応表
 * - getLevelByDifficulty は選択コードから対象レベルデータを返す
 */
export class CodeDefinitions {
    static DIFFICULTY = Object.freeze({
        EASY: 'EASY',
        NORMAL: 'NORMAL',
        HARD: 'HARD'
    });

    static LEVEL_MAP = Object.freeze({
        EASY: LEVEL_BEGINNER,
        NORMAL: LEVEL_ADVANCED,
        HARD: LEVEL_ELITE
    });

    static getLevelByDifficulty(difficulty) {
        return this.LEVEL_MAP[difficulty] || null;
    }
}
