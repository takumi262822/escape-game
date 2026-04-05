/**
 * 視点中の調査対象やインベントリ表示に使う DOM 部品を生成・更新する共通 UI クラス。
 * @author Takumi Harada
 * @date 2026/3/31
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
