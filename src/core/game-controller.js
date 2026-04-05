/**
 * Game progress (puzzle answer / flag management) controller class
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { GameConstants } from '../constants/game-constants.js';
import { CodeDefinitions } from '../constants/code-definitions.js';
import { Validator } from '../utils/validator.js';
import { XSSProtection } from '../utils/xss.js';
import { Header } from '../ui/header.js';
import { Footer } from '../ui/footer.js';
import { UIComponents } from '../ui/components.js';
import { StyleManager } from '../styles/style-manager.js';

/**
 * 脱出ゲームの進行全体を制御するクラス。
 * 難易度選択・部屋移動・謎解き判定・クリア演出を統括する。
 * @author Takumi Harada
 */
export class EscapeGameController {
    // --- DOMノード参照・状態変数の初期化 ---
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
        new Footer().setYear();
        this.init();
    }

    // --- ゲーム状態を初期値にリセットする ---
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

    // --- 難易度選択・方向ボタンのイベントバインド ---
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

    // --- 選択した難易度データでゲームを開始する ---
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

    // --- 指定の部屋へ移動し、画面を再描画 ---
    changeRoom(key) {
        this.state.room = key;
        this.state.view = 0;
        this.say(`${this.state.level.rooms[key].name}へ移動した。`);
        this.render();
    }

    // --- 現在部屋内の視点を切り替える ---
    move(dir) {
        this.state.view = (this.state.view + dir + GameConstants.VIEWS.length) % GameConstants.VIEWS.length;
        this.render();
    }

    // --- ナレーターエリアにウィンドウテキストを表示 ---
    say(text) {
        this.dom.narrator.textContent = XSSProtection.sanitize(text);
    }

    // --- コード入力モーダルの表示 / 非表示切り替え ---
    toggleModal(visible) {
        StyleManager.toggleClass(this.dom.modal, 'is-active', visible);
        if (visible) {
            this.dom.input.focus();
        }
    }

    // --- 現在の部屋・視点に合わせたオブジェクトを描画 ---
    render() {
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

    // --- アイテムをインベントリに追加し、スロットにアイコンを表示 ---
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

    // --- インベントリスロットのクリック：選択・調査切り替え ---
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

    // --- アイテムのヒントをナレーターに表示 ---
    inspect(key) {
        this.say(`【調査】: ${GameConstants.ITEM_HINTS[key] || '特に変わったところはない。'}`);
    }

    // --- モーダルのコードと安全に遊冒コードを照合---
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

    // --- ゲームクリアエフェクトを表示し、トップに戻る ---
    clear() {
        this.dom.clearMsg.textContent = GameConstants.CLEAR_MESSAGES[this.state.level.id] || '';
        StyleManager.addClass(this.dom.clear, 'is-active');
        setTimeout(() => {
            StyleManager.removeClass(this.dom.clear, 'is-active');
            this.toTop();
        }, GameConstants.RELOAD_MS);
    }

    // --- ティトル画面に戻り、スロット・状態をリセット ---
    toTop() {
        StyleManager.removeClass(this.dom.title, 'is-hidden');
        UIComponents.resetSlots();
        this.resetState();
        this.say('運命を選択せよ。');
    }
}
