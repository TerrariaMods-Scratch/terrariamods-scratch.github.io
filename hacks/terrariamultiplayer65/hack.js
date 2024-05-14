if (!window.multiplayer) {
    if (ReduxStore.getState().scratchGui.mode.hasEverEnteredEditor) {
        alert("Project has been modified, reload to use");
    } else {
        window.multiplayer = true;
        var ws;
        const server = "wss://terrariastampedserver.deno.dev";
        var open = true;

        function connect() {
            ws = new WebSocket(server);
            ws.onclose = () => {
                if (open) {
                    alert("Disconnected...\nAttempting to Reconnect...");
                    connect();
                }
            }
            ws.onopen = () => {
                ws.send(JSON.stringify({
                    type: "Connect",
                    id: window.location.pathname.match(/\d/g).join("")
                }));
            }
            ws.onmessage = message;
        }
        connect();

        const Stage = vm.runtime.getTargetForStage();
        const Setup = vm.runtime.getSpriteTargetByName("Setup");
        const Tools = vm.runtime.getSpriteTargetByName("Tools");
        const Light = vm.runtime.getSpriteTargetByName("Light");
        const Snapshots = vm.runtime.getSpriteTargetByName("Snapshots");
        const Player = vm.runtime.getSpriteTargetByName("Player");
        const Hair = vm.runtime.getSpriteTargetByName("Hair");
        const Body = vm.runtime.getSpriteTargetByName("Body");
        const Pants = vm.runtime.getSpriteTargetByName("Pants");
        const Items = vm.runtime.getSpriteTargetByName("Items");

        const dir = Player.lookupVariableByNameAndType("dir", "");
        const PlayerX = Stage.lookupVariableByNameAndType("PLAYER X", "");
        const PlayerY = Stage.lookupVariableByNameAndType("PLAYER Y", "");
        const ScrollX = Stage.lookupVariableByNameAndType("SCROLL_X", "");
        const ScrollY = Stage.lookupVariableByNameAndType("SCROLL_Y", "");

        const INV = Stage.lookupVariableByNameAndType("INV", "list");
        const PAINT = Stage.lookupVariableByNameAndType("PAINT", "list");
        vm.runtime.greenFlag();
        setTimeout(() => vm.runtime.stopAll(), 100);

        const players = {};
        const playerData = {};
        window.players = players;

        function renderPlayer(data) {
            if (!players[data.id]) {
                players[data.id] = {
                    pants: vm.renderer._allDrawables[vm.renderer.createDrawable("sprite")],
                    hair: vm.renderer._allDrawables[vm.renderer.createDrawable("sprite")],
                    item: vm.renderer._allDrawables[vm.renderer.createDrawable("sprite")],
                    body: vm.renderer._allDrawables[vm.renderer.createDrawable("sprite")]
                }
            }
            players[data.id].hair.skin = vm.renderer._allSkins[Hair.sprite.costumes[data.hair].skinId];
            players[data.id].body.skin = vm.renderer._allSkins[Body.sprite.costumes[data.body].skinId];
            players[data.id].pants.skin = vm.renderer._allSkins[Pants.sprite.costumes[data.pants].skinId];
            players[data.id].item.skin = vm.renderer._allSkins[Items.sprite.costumes[data.item].skinId];
            players[data.id].hair.updatePosition([Math.floor((data.x - ScrollX.value) * 8) - 240, Math.floor((data.y - ScrollY.value) * 8) - 169]);
            players[data.id].body.updatePosition([Math.floor((data.x - ScrollX.value) * 8) - 240, Math.floor((data.y - ScrollY.value) * 8) - 169]);
            players[data.id].pants.updatePosition([Math.floor((data.x - ScrollX.value) * 8) - 240, Math.floor((data.y - ScrollY.value) * 8) - 169]);
            players[data.id].item.updatePosition([Math.floor((data.x - ScrollX.value) * 8) - 240 + data.itemPos.x, Math.floor((data.y - ScrollY.value) * 8) - 169 + data.itemPos.y]);
            players[data.id].hair.updateScale(data.scale);
            players[data.id].body.updateScale(data.scale);
            players[data.id].pants.updateScale(data.scale);
            players[data.id].hair.updateEffect("brightness", data.brightness);
            players[data.id].body.updateEffect("brightness", data.brightness);
            players[data.id].pants.updateEffect("brightness", data.brightness);
            players[data.id].item.updateEffect("brightness", data.brightness);
            players[data.id].hair.updateVisible(data.visible);
            players[data.id].body.updateVisible(data.visible);
            players[data.id].pants.updateVisible(data.visible);
            players[data.id].item.updateVisible(data.itemVisible);
            players[data.id].item.updateDirection(data.itemDir);
            vm.renderer.setDrawableOrder(players[data.id].pants.id, Infinity, "sprite");
            vm.renderer.setDrawableOrder(players[data.id].hair.id, Infinity, "sprite");
            vm.renderer.setDrawableOrder(players[data.id].item.id, Infinity, "sprite");
            vm.renderer.setDrawableOrder(players[data.id].body.id, Infinity, "sprite");
        }

        function message(e) {
            const data = JSON.parse(e.data);
            if (data.type == "Connect") {
                if (data.response == "ok") {
                    alert("Connected to Server!");

                    setInterval(() => {
                        if (ReduxStore.getState().scratchGui.mode.hasEverEnteredEditor) {
                            open = false;
                            ws.close();
                            window.location.href = window.location.href.replace("/editor", "");
                        }
                    }, 1000);

                    //https://github.com/TurboWarp/scratch-vm/blob/develop/src/util/uid.js
                    const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~' +
                        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    const uid = function() {
                        const length = 20;
                        const soupLength = soup_.length;
                        const id = [];
                        for (let i = 0; i < length; i++) {
                            id[i] = soup_.charAt(Math.random() * soupLength);
                        }
                        return id.join('');
                    };
                    //https://github.com/TurboWarp/scratch-vm/blob/develop/src/util/uid.js

                    function newSpriteBlockID(sprite) {
                        var id = uid();
                        while (id in sprite.blocks._blocks) id = uid();
                        return id;
                    }

                    vm.addAddonBlock({
                        procedureCode: "LEVEL %s %s",
                        arguments: ["idx", "value"],
                        color: "#000000",
                        secondaryColor: "#00FF00",
                        callback: (args) => UpdateList("LEVEL", args.idx, args.value)
                    });
                    vm.addAddonBlock({
                        procedureCode: "WALL %s %s",
                        arguments: ["idx", "value"],
                        color: "#000000",
                        secondaryColor: "#00FF00",
                        callback: (args) => UpdateList("WALL", args.idx, args.value)
                    });
                    vm.addAddonBlock({
                        procedureCode: "WATER %s %s",
                        arguments: ["idx", "value"],
                        color: "#000000",
                        secondaryColor: "#00FF00",
                        callback: (args) => UpdateList("WATER", args.idx, args.value)
                    });
                    vm.addAddonBlock({
                        procedureCode: "LIGHT %s %s",
                        arguments: ["idx", "value"],
                        color: "#000000",
                        secondaryColor: "#00FF00",
                        callback: (args) => UpdateList("LIGHT", args.idx, args.value)
                    });
                    vm.addAddonBlock({
                        procedureCode: "INV %s %s",
                        arguments: ["idx", "value"],
                        color: "#000000",
                        secondaryColor: "#00FF00",
                        callback: (args) => UpdateChest(args.idx, args.value)
                    });
                    vm.addAddonBlock({
                        procedureCode: "Fetch World",
                        arguments: [],
                        color: "#000000",
                        secondaryColor: "#00FF00",
                        callback: () => ws.send(JSON.stringify({ type: "FetchWorld" }))
                    });

                    var ListUpdates = [];
                    function UpdateList(name, idx, value) {
                        Stage.lookupVariableByNameAndType(name, "list").value[idx - 1] = value;
                        ListUpdates.push({ name, idx, value });
                    }
                    function UpdateChest(idx, value) {
                        e
                        INV.value[idx - 1] = value;
                        var i = idx - 1;
                        if (i <= 150) return;
                        for (; i > 150 && !INV.value[i].toString().startsWith("chest"); i--) { }
                        const index = parseInt(INV.value[i].replace("chest-", ""));
                        if (index > 1000000) return;
                        ws.send(JSON.stringify({
                            type: "UpdateChest",
                            idx: idx - i - 1,
                            id: index,
                            value
                        }));
                    }
                    vm.addAddonBlock({
                        procedureCode: "Send Tick Update",
                        arguments: [],
                        color: "#000000",
                        secondaryColor: "#00FF00",
                        callback: () => {
                            ws.send(JSON.stringify({
                                type: "TickUpdate",
                                x: PlayerX.value,
                                y: PlayerY.value,
                                brightness: Body.effects.brightness,
                                scale: [(Body.direction / 90) * 100, 100],
                                hair: Hair.currentCostume,
                                body: Body.currentCostume,
                                pants: Pants.currentCostume,
                                item: Items.currentCostume,
                                visible: Body.visible,
                                itemVisible: Items.visible,
                                itemPos: {
                                    x: Items.x - Body.x,
                                    y: Items.y - Body.y
                                },
                                itemDir: Items.direction,
                                updates: ListUpdates
                            }));
                            ListUpdates = [];
                            Object.values(playerData).forEach(renderPlayer);
                        }
                    });

                    for (const target of vm.runtime.targets) {
                        const blocks = Object.values(target.blocks._blocks);
                        for (const block of blocks) {
                            if (block.opcode != "data_replaceitemoflist" || ["LEVEL", "WALL", "WATER", "LIGHT", "INV"].indexOf(block.fields.LIST.value) == -1) continue;
                            const newBlock = {
                                "id": newSpriteBlockID(target),
                                "opcode": "procedures_call",
                                "inputs": {
                                    "arg0": {
                                        "name": "arg0",
                                        "block": block.inputs.INDEX.block,
                                        "shadow": block.inputs.INDEX.shadow
                                    },
                                    "arg1": {
                                        "name": "arg1",
                                        "block": block.inputs.ITEM.block,
                                        "shadow": block.inputs.ITEM.shadow
                                    }
                                },
                                "fields": {},
                                "next": block.next,
                                "topLevel": block.topLevel,
                                "parent": block.id,
                                "shadow": block.shadow,
                                "x": block.x,
                                "y": block.y,
                                "mutation": {
                                    "tagName": "mutation",
                                    "children": [],
                                    "proccode": `${block.fields.LIST.value} %s %s`,
                                    "argumentids": "[\"arg0\",\"arg1\"]",
                                    "warp": "false"
                                }
                            };
                            target.blocks.getBlock(block.inputs.INDEX.block).parent = newBlock.id;
                            target.blocks.getBlock(block.inputs.INDEX.shadow).parent = newBlock.id;
                            target.blocks.getBlock(block.inputs.INDEX.block).parent = newBlock.id;
                            target.blocks.getBlock(block.inputs.INDEX.shadow).parent = newBlock.id;
                            block.next = newBlock.id;
                            block.fields.LIST.id = "null";
                            block.fields.LIST.value = "null";
                            block.inputs.INDEX.block = null;
                            block.inputs.INDEX.shadow = null;
                            block.inputs.ITEM.block = null;
                            block.inputs.ITEM.shadow = null;
                            target.blocks.createBlock(newBlock);
                        }
                    }

                    (() => {
                        Setup.blocks.deleteBlock(Object.values(Setup.blocks._blocks).find(e => e.opcode == "event_whenbroadcastreceived" && e.fields.BROADCAST_OPTION.value == "setup").id);
                        const broadcast = newSpriteBlockID(Setup);
                        const fetchWorld = newSpriteBlockID(Setup);
                        const hide = newSpriteBlockID(Setup);
                        const waitUntil = newSpriteBlockID(Setup);
                        const greater = newSpriteBlockID(Setup);
                        const length = newSpriteBlockID(Setup);
                        const zero = newSpriteBlockID(Setup);
                        const wait = newSpriteBlockID(Setup);
                        const sec = newSpriteBlockID(Setup);
                        const broadcastwait = newSpriteBlockID(Setup);
                        const illuminate = newSpriteBlockID(Setup);
                        [
                            {
                                "id": broadcast,
                                "opcode": "event_whenbroadcastreceived",
                                "inputs": {},
                                "fields": {
                                    "BROADCAST_OPTION": {
                                        "name": "BROADCAST_OPTION",
                                        "id": Stage.lookupVariableByNameAndType("setup", "broadcast_msg").id,
                                        "value": "setup",
                                        "variableType": "broadcast_msg"
                                    }
                                },
                                "next": fetchWorld,
                                "topLevel": true,
                                "parent": null,
                                "shadow": false
                            },
                            {
                                "id": fetchWorld,
                                "opcode": "procedures_call",
                                "inputs": {},
                                "fields": {},
                                "next": waitUntil,
                                "topLevel": false,
                                "parent": broadcast,
                                "shadow": false,
                                "mutation": {
                                    "tagName": "mutation",
                                    "children": [],
                                    "proccode": "Fetch World",
                                    "argumentids": "[]",
                                    "warp": "false"
                                }
                            },
                            {
                                "id": hide,
                                "opcode": "looks_hide",
                                "inputs": {},
                                "fields": {},
                                "next": null,
                                "topLevel": false,
                                "parent": wait,
                                "shadow": false
                            },
                            {
                                "id": waitUntil,
                                "opcode": "control_wait_until",
                                "inputs": {
                                    "CONDITION": {
                                        "name": "CONDITION",
                                        "block": greater,
                                        "shadow": null
                                    }
                                },
                                "fields": {},
                                "next": broadcastwait,
                                "topLevel": false,
                                "parent": fetchWorld,
                                "shadow": false
                            },
                            {
                                "id": greater,
                                "opcode": "operator_gt",
                                "inputs": {
                                    "OPERAND1": {
                                        "name": "OPERAND1",
                                        "block": length,
                                        "shadow": null
                                    },
                                    "OPERAND2": {
                                        "name": "OPERAND2",
                                        "block": zero,
                                        "shadow": zero
                                    }
                                },
                                "fields": {},
                                "next": null,
                                "topLevel": false,
                                "parent": waitUntil,
                                "shadow": false
                            },
                            {
                                "id": zero,
                                "opcode": "text",
                                "inputs": {},
                                "fields": {
                                    "TEXT": {
                                        "name": "TEXT",
                                        "value": "0"
                                    }
                                },
                                "next": null,
                                "topLevel": false,
                                "parent": greater,
                                "shadow": true
                            },
                            {
                                "id": length,
                                "opcode": "data_lengthoflist",
                                "inputs": {},
                                "fields": {
                                    "LIST": {
                                        "name": "LIST",
                                        "id": Stage.lookupVariableByNameAndType("LEVEL", "list").id,
                                        "value": "LEVEL",
                                        "variableType": "list"
                                    }
                                },
                                "next": null,
                                "topLevel": false,
                                "parent": greater,
                                "shadow": false
                            },
                            {
                                "id": broadcastwait,
                                "opcode": "event_broadcastandwait",
                                "inputs": {
                                    "BROADCAST_INPUT": {
                                        "name": "BROADCAST_INPUT",
                                        "block": illuminate,
                                        "shadow": illuminate
                                    }
                                },
                                "fields": {},
                                "next": null,
                                "topLevel": false,
                                "parent": waitUntil,
                                "shadow": false
                            },
                            {
                                "id": illuminate,
                                "opcode": "event_broadcast_menu",
                                "inputs": {},
                                "fields": {
                                    "BROADCAST_OPTION": {
                                        "name": "BROADCAST_OPTION",
                                        "id": Stage.lookupVariableByNameAndType("Load - Illuminate", "broadcast_msg").id,
                                        "value": "Load - Illuminate",
                                        "variableType": "broadcast_msg"
                                    }
                                },
                                "next": wait,
                                "topLevel": false,
                                "parent": broadcastwait,
                                "shadow": true
                            },
                            {
                                "id": wait,
                                "opcode": "control_wait",
                                "inputs": {
                                    "DURATION": {
                                        "name": "DURATION",
                                        "block": sec,
                                        "shadow": sec
                                    }
                                },
                                "fields": {},
                                "next": hide,
                                "topLevel": false,
                                "parent": broadcastwait,
                                "shadow": false
                            },
                            {
                                "id": sec,
                                "opcode": "math_positive_number",
                                "inputs": {},
                                "fields": {
                                    "NUM": {
                                        "name": "NUM",
                                        "value": "0.2"
                                    }
                                },
                                "next": null,
                                "topLevel": false,
                                "parent": wait,
                                "shadow": true
                            }
                        ].forEach(e => Setup.blocks.createBlock(e));
                    })();

                    (() => {
                        for (const id of Tools.blocks._scripts) {
                            const block = Tools.blocks.getBlock(id);
                            if (block.opcode == "event_whenbroadcastreceived" && block.fields.BROADCAST_OPTION.value == "final tick") Tools.blocks.deleteBlock(id);
                        }
                        for (const block of Object.values(Setup.blocks._blocks)) {
                            if (block.opcode == "sensing_keyoptions" && block.fields.KEY_OPTION.value == "g") Setup.blocks.deleteBlock(block.parent);
                        }
                        for (const block of Object.values(Snapshots.blocks._blocks)) {
                            if (block.opcode == "sensing_keyoptions" && block.fields.KEY_OPTION.value == "l") Snapshots.blocks.deleteBlock(block.parent);
                        }
                        for (const id of Light.blocks._scripts) {
                            const block = Light.blocks.getBlock(id);
                            if (block.opcode == "event_whenkeypressed" && block.fields.KEY_OPTION.value == "o") Light.blocks.deleteBlock(id);
                        }
                    })();

                    Object.defineProperty(Stage.lookupVariableByNameAndType("TIME"), "value", {
                        get: () => Math.round(((Date.now() - 1696991860000) / 1000) * 30),
                        set: value => { },
                    });

                    (() => {
                        const animate = newSpriteBlockID(Stage);
                        const update = newSpriteBlockID(Stage);
                        [
                            {
                                "id": animate,
                                "opcode": "event_whenbroadcastreceived",
                                "inputs": {},
                                "fields": {
                                    "BROADCAST_OPTION": {
                                        "name": "BROADCAST_OPTION",
                                        "id": Stage.lookupVariableByNameAndType("animate", "broadcast_msg").id,
                                        "value": "animate",
                                        "variableType": "broadcast_msg"
                                    }
                                },
                                "next": update,
                                "topLevel": true,
                                "parent": null,
                                "shadow": false
                            },
                            {
                                "id": update,
                                "opcode": "procedures_call",
                                "inputs": {},
                                "fields": {},
                                "next": null,
                                "topLevel": false,
                                "parent": animate,
                                "shadow": false,
                                "mutation": {
                                    "tagName": "mutation",
                                    "children": [],
                                    "proccode": "Send Tick Update",
                                    "argumentids": "[]",
                                    "warp": "false"
                                }
                            }
                        ].forEach(e => Stage.blocks.createBlock(e));
                    })();
                } else {
                    open = false;
                    ws.close();
                    alert("Failed to Connect to Server: Project Not Supported\nPlease use one of the following projects:\n322341152");
                }
            } else if (data.type == "TickUpdate") {
                for (const update of data.updates) {
                    Stage.lookupVariableByNameAndType(update.name, "list").value[update.idx - 1] = update.value;
                    if (!PAINT.value.indexOf(update.idx) > -1) PAINT.value.push(update.idx);
                }
                renderPlayer(data);
                playerData[data.id] = {
                    x: data.x,
                    y: data.y,
                    brightness: data.brightness,
                    scale: data.scale,
                    hair: data.hair,
                    body: data.body,
                    pants: data.pants,
                    item: data.item,
                    visible: data.visible,
                    itemVisible: data.itemVisible,
                    itemPos: data.itemPos,
                    itemDir: data.itemDir
                }
            } else if (data.type == "UpdateChest") {
                var idx = INV.value.indexOf(`chest-${data.id}`);
                if (idx == -1) {
                    idx = INV.value.length;
                    INV.value.push(`chest-${data.id}`);
                    for (var i = 0; i < 80; i++) INV.value.push("");
                }
                INV.value[idx + data.idx] = data.value;
            } else if (data.type == "PlayerQuit") {
                if (players[data.id]) {
                    vm.renderer.destroyDrawable(players[data.id].hair.id, "sprite");
                    vm.renderer.destroyDrawable(players[data.id].body.id, "sprite");
                    vm.renderer.destroyDrawable(players[data.id].pants.id, "sprite");
                    vm.renderer.destroyDrawable(players[data.id].item.id, "sprite");
                    delete players[data.id];
                }
            } else if (data.type == "WorldData") {
                Stage.lookupVariableByNameAndType("MAXX").value = data.world.MAXX;
                Stage.lookupVariableByNameAndType("MAXY").value = data.world.MAXY;
                Stage.lookupVariableByNameAndType("SEA LEVEL").value = 290;
                Stage.lookupVariableByNameAndType("UNDERGROUND").value = 275 * data.world.MAXX;
                Stage.lookupVariableByNameAndType("BRIGHT").value = 100;
                Stage.lookupVariableByNameAndType("BRIGHT SUN").value = 100;
                Stage.lookupVariableByNameAndType("MODE").value = "play";
                Stage.lookupVariableByNameAndType("LEVEL", "list").value = data.world.LEVEL;
                Stage.lookupVariableByNameAndType("LEVEL", "list").value = data.world.LEVEL;
                Stage.lookupVariableByNameAndType("WALL", "list").value = data.world.WALL;
                Stage.lookupVariableByNameAndType("WATER", "list").value = data.world.WATER;
                Stage.lookupVariableByNameAndType("LIGHT", "list").value = data.world.LIGHT;
                Stage.lookupVariableByNameAndType("INV", "list").value = [...Stage.lookupVariableByNameAndType("INV", "list").value.slice(0, 150), ...data.world.INV.slice(150)];
            }
        }
    }
}