import { EscapeGameController } from './game-controller.js';

/**
 * Main クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
export class Main {
    constructor() {
        this.controller = null;
    }

    init() {
        this.controller = new EscapeGameController();
    }
}
