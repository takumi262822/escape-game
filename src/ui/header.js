import { GameConstants } from '../constants/game-constants.js';

/**
 * 現在の部屋名と視点方角を画面上部ラベルに反映する UI クラス。
 * @author Takumi Harada
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
