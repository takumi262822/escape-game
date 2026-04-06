/**
 * LEVEL_ADVANCED 定義
 * @author Takumi Harada
 * @date 2026-03-31
 */
export const LEVEL_ADVANCED = {
    id: 'NORMAL',
    code: '931',
    msg: '中級：静寂の二連室。仕掛けを連鎖させよ。',
    startRoom: 'STUDY',
    rooms: {
        STUDY: {
            name: '書斎',
            views: [
                {
                    render: (s) => `<div style="border:2px solid #c5a059;padding:20px;">${s.flags.goalOpen ? '🔓 EXIT' : '🔒 EXIT'}</div>`,
                    action: (g) => g.state.flags.goalOpen ? g.clear() : g.say('電子ロック。物置の金庫を解き、電気を通せ。')
                },
                { render: () => '<div>▶ 廊下へ</div>', action: (g) => g.changeRoom('HALLWAY') },
                {
                    render: (s) => `<div style="font-size:50px;">${s.flags.deskOpen ? '📖' : '🗄️'}</div>`,
                    action: (g) => {
                        // デスクが既に開いている場合は中のコードを表示する
                        if (g.state.flags.deskOpen) return g.say('中に「931」と書かれた紙がある。');
                        // 手に油を持っている場合は錆びたデスクを開けてコードを入手する
                        if (g.state.activeItem === 'oil') {
                            g.state.flags.deskOpen = true;
                            g.say('油を差すと開いた！「脱出コード：931」');
                            g.render();
                        } else {
                            g.say('錆びついて開かない。油が必要だ。');
                        }
                    }
                },
                { render: () => '<div>📚 本棚</div>', action: (g) => g.say('日記がある。「物置の床下に予備のヒューズを隠した」') }
            ]
        },
        HALLWAY: {
            name: '廊下',
            views: [
                { render: () => '<div>◀ 書斎へ</div>', action: (g) => g.changeRoom('STUDY') },
                { render: () => '<div>▶ 物置へ</div>', action: (g) => g.changeRoom('STORAGE') },
                {
                    render: (s) => `<div style="font-size:60px;">${s.flags.powerOn ? '⚡' : '💥'}</div>`,
                    action: (g) => {
                        // 電源が既に復旧している場合は通電済みの旨を伝える
                        if (g.state.flags.powerOn) return g.say('電気は既に復旧している。');
                        // 手に絶縁テープを持っている場合は配線補修を試みる
                        if (g.state.activeItem === 'tape') {
                            // ヒューズも持っている場合はテープ補修＋ヒューズ交換で通電成功する
                            if (g.state.inventory.has('fuse')) {
                                g.state.flags.powerOn = true;
                                g.say('テープで補修しヒューズを交換した。通電成功！');
                                g.render();
                            } else {
                                g.say('テープで直したが、まだ電気が来ない。ヒューズが必要だ。');
                            }
                        } else {
                            g.say('配線が火花を散らしている。絶縁テープが必要だ。');
                        }
                    }
                },
                { render: (s) => s.inventory.has('oil') ? '<div>空のゴミ箱</div>' : '<div>🗑️ ゴミ箱</div>', action: (g) => g.getItem('oil', '🏺') }
            ]
        },
        STORAGE: {
            name: '物置',
            views: [
                { render: () => '<div>◀ 廊下へ</div>', action: (g) => g.changeRoom('HALLWAY') },
                {
                    render: (s) => (s.inventory.has('tape') && s.inventory.has('bar')) ? '<div>空の段ボール</div>' : '<div>📦 段ボール</div>',
                    action: (g) => {
                        // テープがまだインベントリにない場合は段ボールからテープを入手する
                        if (!g.state.inventory.has('tape')) {
                            g.getItem('tape', '巻');
                            g.say('段ボールから絶縁テープを見つけた。');
                        // テープはあるがバールがない場合は底からバールを入手する
                        } else if (!g.state.inventory.has('bar')) {
                            g.getItem('bar', '🔨');
                            g.say('底にバールが隠されていた！');
                        } else {
                            g.say('もう何も残っていない。');
                        }
                    }
                },
                {
                    render: (s) => `<div style="font-size:60px;">${s.flags.powerOn ? (s.flags.goalOpen ? '🔓' : '🔒') : '🌑'}</div>`,
                    action: (g) => {
                        // 電源未復旧の場合は暗くて操作できない旨を伝える
                        if (!g.state.flags.powerOn) return g.say('暗くて操作できない。まずは電気を通せ。');
                        // 金庫が既に開いている場合は解錠済みの旨を伝える
                        if (g.state.flags.goalOpen) return g.say('金庫は既に開いている。');
                        g.toggleModal(true);
                    }
                },
                {
                    render: (s) => `<div style="font-size:50px;">${s.flags.floorOpen ? '🕳️' : '🪵'}</div>`,
                    action: (g) => {
                        // 床下が既に開いている場合はもう何もない旨を伝える
                        if (g.state.flags.floorOpen) return g.say('床下にはもう何もない。');
                        // 手にバールを持っている場合は床板をこじ開けてヒューズを入手する
                        if (g.state.activeItem === 'bar') {
                            g.state.flags.floorOpen = true;
                            g.getItem('fuse', '🔋');
                            g.say('バールで床を剥がし、ヒューズを見つけた！');
                            g.render();
                        } else {
                            g.say('床板が浮いている。バールでこじ開けられそうだ。');
                        }
                    }
                }
            ]
        }
    }
};
