import { GameConstants } from '../constants/game-constants.js';

/**
 * Header クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
export class Header {
    constructor(labelElement) {
        this.labelElement = labelElement;
    }

    update(roomName, viewIndex) {
        if (!this.labelElement) return;
        this.labelElement.textContent = `${roomName} : ${GameConstants.VIEWS[viewIndex]}`;
    }
}
