import { LEVEL_BEGINNER } from '../levels/beginner-level.js';
import { LEVEL_ADVANCED } from '../levels/advanced-level.js';
import { LEVEL_ELITE } from '../levels/elite-level.js';

/**
 * CodeDefinitions クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * CodeDefinitions クラス
 * 目的: アプリ全体で再利用する定数・コード定義を管理する
 * 入力: なし（静的参照）
 * 処理: 定数を用途別に定義し参照しやすく整理する
 * 出力: 画面制御や判定で使用する不変値
 * 補足: 変更時は参照側ロジックの影響を確認する
 * @author Takumi Harada
 * @date 2026-04-01
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
