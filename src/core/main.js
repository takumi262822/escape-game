import { EscapeGameController } from './game-controller.js';

/**
 * EscapeGameController を起動するエントリーポイントクラス。
 * DOMContentLoaded で init() を実行する。
 * @author Takumi Harada
 */
export class Main {
    constructor() {
        this.controller = null;
    }

    init() {
        this.controller = new EscapeGameController();
    }
}
