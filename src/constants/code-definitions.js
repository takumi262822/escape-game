import { LEVEL_BEGINNER } from '../levels/beginner-level.js';
import { LEVEL_ADVANCED } from '../levels/advanced-level.js';
import { LEVEL_ELITE } from '../levels/elite-level.js';

/**
 * CodeDefinitions クラス
 * @author Takumi Harada
 * @date 2026-03-31
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
