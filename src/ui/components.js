/**
 * UIComponents クラス（共通部品クラス）
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * UIComponents クラス
 * 目的: UI部品の生成・更新を担当する
 * 入力: 表示データ・DOM要素・操作イベント
 * 処理: 画面要素を生成/更新し必要なイベントを接続する
 * 出力: 更新されたUI表示
 * 補足: ビジネスロジックは別クラスに分離する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class UIComponents {
    static createPropElement(viewData, state, onAction) {
        const prop = document.createElement('div');
        prop.className = 'prop';
        prop.innerHTML = viewData.render ? viewData.render(state) : (viewData.html || '');
        prop.addEventListener('click', onAction);
        return prop;
    }

    static clearAndAppend(container, child) {
        container.innerHTML = '';
        container.appendChild(child);
    }

    static getInventorySlots() {
        return Array.from(document.querySelectorAll('.item-slot'));
    }

    static getEmptySlot() {
        return this.getInventorySlots().find((slot) => !slot.dataset.key) || null;
    }

    static clearSlotSelection() {
        this.getInventorySlots().forEach((slot) => slot.classList.remove('selected'));
    }

    static resetSlots() {
        this.getInventorySlots().forEach((slot) => {
            slot.textContent = '';
            slot.classList.remove('selected');
            delete slot.dataset.key;
        });
    }
}
