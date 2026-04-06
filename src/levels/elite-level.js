/**
 * LEVEL_ELITE 定義
 * @author Takumi Harada
 * @date 2026-03-31
 */
export const LEVEL_ELITE = {
    id: 'HARD',
    code: '5856',
    stone: '3000',
    msg: '究極試練：五界の連鎖。全ての遺物を導け。',
    startRoom: 'HALL',
    rooms: {
        HALL: {
            name: '中央ホール',
            views: [
                {
                    render: (s) => s.flags.goalOpen ? '🔓 EXIT' : '🔒 EXIT',
                    action: (g) => g.state.flags.goalOpen ? g.clear() : g.say('五つの因果が解かれぬ限り、門は開かぬ。')
                },
                { render: () => '▶ 図書室へ', action: (g) => g.changeRoom('LIBRARY') },
                { render: () => '▼ 作業場へ', action: (g) => g.changeRoom('WORKSHOP') },
                {
                    render: (s) => s.flags.pathHall ? '🕳️ 隠し通路' : '🖼️ 西の壁画',
                    action: (g) => {
                        // 隐し通路が既に開通済みの場合はそのまま秘密の部屋に移動する
                        if (g.state.flags.pathHall) return g.changeRoom('SECRET');
                        // 手に持っているアイテムがバールの場合は連鎖条件を順に確認する
                        if (g.state.activeItem === 'bar') {
                            // 設計図をまだ読んでいない場合は延期メッセージを表示
                            if (!g.state.flags.bluePrintRead) return g.say('どこを叩けばいいか分からない。構造のヒントがあれば…。');
                            // 日記のヒントをまだ読んでいない場合は穎蹏のないメッセージを表示
                            if (!g.state.flags.hintRead) return g.say('ここを壊すことに何の意味があるのだろうか。確信が持てない。');
                            // 電源がまだ復旧していない場合は暗くて打てない旨を伝える
                            if (!g.state.flags.powerOn) return g.say('暗くて狙いが定まらない。まずは明かり（電源）を。');
                            g.state.flags.pathHall = true;
                            g.say('すべての因果が重なり、壁が崩れ去った！');
                            g.render();
                        } else {
                            g.changeRoom('GARDEN');
                        }
                    }
                }
            ]
        },
        GARDEN: {
            name: '中庭',
            views: [
                { render: () => '▲ ホールへ戻る', action: (g) => g.changeRoom('HALL') },
                { render: () => '🗿 古い石碑', action: (g) => g.say(`石碑には「${LEVEL_ELITE.stone}」と刻まれている。`) },
                { render: () => '⛲ 枯れた噴水', action: (g) => g.say('今は水が止まっている。') },
                {
                    render: (s) => s.inventory.has('oil') ? '🔓 開いた物置' : '🔒 施錠された物置',
                    action: (g) => {
                        if (g.state.inventory.has('oil')) return g.say('ここはもう空だ。');
                        if (g.state.activeItem === 'old_key') {
                            g.getItem('oil', '🛢️');
                        } else {
                            g.say('頑丈な南京錠がかかっている。');
                        }
                    }
                }
            ]
        },
        LIBRARY: {
            name: '図書室',
            views: [
                { render: () => '▲ ホールへ戻る', action: (g) => g.changeRoom('HALL') },
                {
                    render: (s) => s.inventory.has('old_key') ? '📖 本棚 (調査済)' : '🔑 隙間の鍵',
                    action: (g) => {
                        // 古い鍵が既にインベントリにある場合は空の旨を表示する（LIBRARY）
                        if (g.state.inventory.has('old_key')) return g.say('ここはもう空だ。');
                        g.getItem('old_key', '🔑');
                    }
                },
                {
                    render: (s) => s.flags.pathLibrary ? '🕳️ 地下への道' : '📘 重厚な本棚',
                    action: (g) => {
                        // 地下への道が既に開通済みの場合はそのまま地下室に移動する
                        if (g.state.flags.pathLibrary) return g.changeRoom('UNDERGROUND');
                        // レバー修理済みの場合は棚をスライドして道を開通する
                        if (g.state.flags.leverFixed) {
                            g.state.flags.pathLibrary = true;
                            g.say('修理済みのレバーを引き、棚がスライドした！');
                            g.render();
                        // 手に油を持っている場合は錆びついたレバーに油を差す
                        } else if (g.state.activeItem === 'oil') {
                            g.state.flags.leverFixed = true;
                            g.say('油を差すと、錆びついたレバーが動くようになった。');
                        } else {
                            g.say('レバーが錆びついて動かない。');
                        }
                    }
                },
                {
                    render: () => '📚 古い日記',
                    action: (g) => {
                        // 特殊眼鏡を持っている場合は日記の隠しメッセージを完全解読する
                        if (g.state.activeItem === 'glasses') {
                            g.state.flags.hintRead = true;
                            g.say('特殊な眼鏡で見ると「中庭の数値＋PCのコードが鍵」と読めた！');
                        } else {
                            g.say('文字がかすれて読めない。');
                        }
                    }
                }
            ]
        },
        WORKSHOP: {
            name: '作業場',
            views: [
                { render: () => '▲ ホールへ戻る', action: (g) => g.changeRoom('HALL') },
                {
                    render: (s) => s.flags.powerOn ? '🖥️ 起動中のPC' : '🕶️ 電源切',
                    action: (g) => {
                        // PCの電源が入っていない場合は操作不能の旨を伝える
                        if (!g.state.flags.powerOn) return g.say('電源が入っていない。地下室を確認しよう。');
                        g.say(`画面に「管理コード：${LEVEL_ELITE.code}」と表示されている。`);
                    }
                },
                {
                    render: (s) => s.inventory.has('bar') ? '📦 作業台 (空)' : '🔨 鉄のバール',
                    action: (g) => {
                        // 鉄のバールが既にインベントリにある場合は空の旨を伝える
                        if (g.state.inventory.has('bar')) return g.say('ここはもう空だ。');
                        g.getItem('bar', '🔨');
                    }
                },
                {
                    render: (s) => s.flags.machineFixed ? '⚙️ 稼働中の機械' : '🛠️ 謎の機械',
                    action: (g) => {
                        // 眼鏡が既にインベントリにある場合は修理済みの旨を伝える
                        if (g.state.inventory.has('glasses')) return g.say('すでに修理済みだ。快調に動いている。');
                        // 手にアイテムが油の場合は機械を修理して眼鏡を入手する
                        if (g.state.activeItem === 'oil') {
                            g.state.flags.machineFixed = true;
                            g.getItem('glasses', '👓');
                        } else {
                            g.say('油が切れていて動かない。');
                        }
                    }
                }
            ]
        },
        UNDERGROUND: {
            name: '地下室',
            views: [
                { render: () => '▲ 図書室へ戻る', action: (g) => g.changeRoom('LIBRARY') },
                {
                    render: (s) => s.flags.powerOn ? '⚡ 配電盤 (ON)' : '⚡ 配電盤 (封印)',
                    action: (g) => {
                        // 電源が既に復旧している場合は通電済みの旨を伝える
                        if (g.state.flags.powerOn) return g.say('すでに通電している。');
                        // 手にバールを持っている場合は鉄格子をこじ開けて電源を復旧する
                        if (g.state.activeItem === 'bar') {
                            g.state.flags.powerOn = true;
                            g.say('バールで鉄格子をこじ開け、電源を復旧させた！');
                        } else {
                            g.say('鉄格子が邪魔で触れない。');
                        }
                    }
                },
                {
                    render: () => '📜 ホールの設計図',
                    action: (g) => {
                        g.state.flags.bluePrintRead = true;
                        g.say('「西の壁画は脆い」。確かな情報を得た。');
                    }
                },
                { render: () => '🕸️ 貯蔵棚', action: (g) => g.say('埃がひどい。') }
            ]
        },
        SECRET: {
            name: '隠し部屋',
            views: [
                { render: () => '▶ ホールへ戻る', action: (g) => g.changeRoom('HALL') },
                {
                    render: (s) => s.flags.goalOpen ? '🔓 黄金の金庫' : '🔒 黄金の金庫',
                    action: (g) => {
                        // ゴール解放済みの場合は既に空の旨を伝えてモーダルを開かない
                        if (g.state.flags.goalOpen) return g.say('既に中身は空だ。');
                        g.toggleModal(true);
                    }
                },
                { render: () => '🏺 古い壺', action: (g) => g.say('底に大きく「＋」と刻まれている。') },
                { render: () => '🪟 小さな窓', action: (g) => g.say(`石碑の「${LEVEL_ELITE.stone}」が見える。`) }
            ]
        }
    }
};
