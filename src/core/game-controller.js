import { GameConstants } from '../constants/game-constants.js';
import { CodeDefinitions } from '../constants/code-definitions.js';
import { Validator } from '../utils/validator.js';
import { XSSProtection } from '../utils/xss.js';
import { Header } from '../ui/header.js';
import { UIComponents } from '../ui/components.js';
import { StyleManager } from '../styles/style-manager.js';

/**
 * EscapeGameController クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
export class EscapeGameController {
    constructor() {
        this.resetState();
        this.dom = {
            title: document.getElementById('title-screen'),
            container: document.getElementById('object-container'),
            label: document.getElementById('room-label'),
            narrator: document.getElementById('narrator'),
            modal: document.getElementById('dial-overlay'),
            input: document.getElementById('code-input'),
            clear: document.getElementById('clear-overlay'),
            clearMsg: document.getElementById('clear-message')
        };
        this.header = new Header(this.dom.label);
        this.init();
    }

    resetState() {
        this.state = {
            level: null,
            room: '',
            view: 0,
            inventory: new Set(),
            activeItem: null,
            flags: {}
        };
    }

    init() {
        document.querySelectorAll('.diff-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const lv = btn.dataset.level;
                const level = CodeDefinitions.getLevelByDifficulty(lv);
                this.start(level);
            });
        });

        document.getElementById('btn-left').addEventListener('click', () => this.move(-1));
        document.getElementById('btn-right').addEventListener('click', () => this.move(1));
        document.getElementById('btn-menu').addEventListener('click', () => this.toTop());
        document.getElementById('code-unlock').addEventListener('click', () => this.unlock());
        document.getElementById('code-close').addEventListener('click', () => this.toggleModal(false));
        document.querySelectorAll('.item-slot').forEach((slot) => {
            slot.addEventListener('click', () => this.handleSlot(slot));
        });
    }

    start(levelData) {
        if (!Validator.isValidLevel(levelData)) {
            this.say('準備中の難易度です。');
            return;
        }
        this.resetState();
        this.state.level = levelData;
        this.state.room = levelData.startRoom || 'ROOT';
        StyleManager.addClass(this.dom.title, 'is-hidden');
        this.say(levelData.msg);
        this.render();
    }

    changeRoom(key) {
        this.state.room = key;
        this.state.view = 0;
        this.say(`${this.state.level.rooms[key].name}へ移動した。`);
        this.render();
    }

    move(dir) {
        this.state.view = (this.state.view + dir + GameConstants.VIEWS.length) % GameConstants.VIEWS.length;
        this.render();
    }

    say(text) {
        this.dom.narrator.textContent = XSSProtection.sanitize(text);
    }

    toggleModal(visible) {
        StyleManager.toggleClass(this.dom.modal, 'is-active', visible);
        if (visible) {
            this.dom.input.focus();
        }
    }

    render() {
        const level = this.state.level;
        if (!level) return;

        const currentRoom = level.rooms ? level.rooms[this.state.room] : null;
        const viewData = currentRoom ? currentRoom.views[this.state.view] : level.views[this.state.view];
        const roomName = currentRoom ? currentRoom.name : 'ROOM';

        this.header.update(roomName, this.state.view);

        const prop = UIComponents.createPropElement(viewData, this.state, () => {
            if (viewData.action) viewData.action(this);
            else if (viewData.onAction) viewData.onAction(this);
        });
        UIComponents.clearAndAppend(this.dom.container, prop);
    }

    getItem(key, icon) {
        if (this.state.inventory.has(key)) return;
        const slot = UIComponents.getEmptySlot();
        if (!slot) return;

        this.state.inventory.add(key);
        slot.textContent = icon;
        slot.dataset.key = key;
        this.say(`${icon} を手に入れた！`);
        this.render();
    }

    handleSlot(slot) {
        const key = slot.dataset.key;
        if (!key) return;

        if (this.state.activeItem === key) {
            this.inspect(key);
            return;
        }

        UIComponents.clearSlotSelection();
        this.state.activeItem = key;
        StyleManager.addClass(slot, 'selected');
        this.render();
    }

    inspect(key) {
        this.say(`【調査】: ${GameConstants.ITEM_HINTS[key] || '特に変わったところはない。'}`);
    }

    unlock() {
        const code = this.dom.input.value.trim();
        if (!Validator.isValidCodeInput(code)) {
            this.say('コードを入力してください。');
            return;
        }

        if (code === this.state.level.code) {
            this.state.flags.goalOpen = true;
            this.state.flags.open = true;
            this.toggleModal(false);
            this.say('ロック解除！');
            this.render();
            return;
        }

        StyleManager.addClass(this.dom.input, 'input-error');
        setTimeout(() => StyleManager.removeClass(this.dom.input, 'input-error'), GameConstants.ERROR_MS);
    }

    clear() {
        this.dom.clearMsg.textContent = GameConstants.CLEAR_MESSAGES[this.state.level.id] || '';
        StyleManager.addClass(this.dom.clear, 'is-active');
        setTimeout(() => {
            StyleManager.removeClass(this.dom.clear, 'is-active');
            this.toTop();
        }, GameConstants.RELOAD_MS);
    }

    toTop() {
        StyleManager.removeClass(this.dom.title, 'is-hidden');
        UIComponents.resetSlots();
        this.resetState();
        this.say('運命を選択せよ。');
    }
}
