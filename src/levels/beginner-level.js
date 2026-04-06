/**
 * LEVEL_BEGINNER 定義
 * @author Takumi Harada
 * @date 2026-03-31
 */
export const LEVEL_BEGINNER = {
    id: 'EASY',
    code: '742',
    msg: '初級モード開始。探索を始めてください。',
    views: [
        {
            html: '<div style="width:100px;height:150px;border:2px solid #c5a059;display:flex;align-items:center;justify-content:center;">EXIT</div>',
            onAction: (g) => {
                // 手持ちアイテムが鍵の場合は扉を解錠してクリア演出に進む
                g.state.activeItem === 'key' ? g.clear() : g.say('扉は閉ざされている。')
            }
        },
        {
            render: (s) => `<div style="font-size:60px;">${s.flags.open ? '🔓' : '🔒'}</div>`,
            onAction: (g) => {
                // ゴール解錠フラグが立っている場合はインベントリに鍵を追加しモーダルを出さない
                g.state.flags.open ? g.getItem('key', '🗝️') : g.toggleModal(true)
            }
        },
        {
            render: (s) => `<div style="width:120px;height:120px;border:5px solid #c5a059;display:flex;align-items:center;justify-content:center;">${s.flags.art ? '数字：742' : '🖼️'}</div>`,
            onAction: (g) => {
                // 手持ちアイテムがドライバーの場合は絵画を取り外して数字を露出させる
                if (g.state.activeItem === 'driver') {
                    g.state.flags.art = true;
                    g.say('絵画を外した。');
                    g.render();
                } else {
                    g.say(g.state.flags.art ? '数字が刻まれている。' : 'ネジで固定されている。');
                }
            }
        },
        {
            html: '<div style="font-size:60px;">🧰</div>',
            onAction: (g) => {
                // ドライバーが既にインベントリにある場合は空の箱の旨を伝える
                if (g.state.inventory.has('driver')) {
                    g.say('空の箱だ。');
                } else {
                    g.getItem('driver', '🪛');
                }
            }
        }
    ]
};
