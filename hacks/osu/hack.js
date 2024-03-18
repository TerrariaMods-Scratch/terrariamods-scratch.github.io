const inject = (async () => {
    window.osuHackInjected = true;
    const vm = window.vm || (() => {
        const app = document.querySelector("#app");
        return app[Object.keys(app).find(value => value.startsWith("__reactContainer"))].child.stateNode.store.getState().scratchGui.vm;
    })();
    await eval(await (await fetch("https://raw.githubusercontent.com/Stuk/jszip/main/dist/jszip.min.js")).text());
    await eval(await (await fetch("https://raw.githubusercontent.com/pvorb/node-md5/master/dist/md5.min.js")).text());
    const deserializeSound = function(sound, runtime, data, fileName) {
        return new Promise(async (resolve, reject) => {
            const storage = runtime.storage;
            if (!storage) {
                console.warn('No storage module present; cannot load sound asset: ', fileName);
                return reject(null);
            }
            const dataFormat = sound.dataFormat.toLowerCase() === "mp3" ? storage.DataFormat.MP3 : storage.DataFormat.WAV;
            let asset = await storage.createAsset(
                storage.AssetType.Sound,
                dataFormat,
                data,
                null,
                true
            );
            sound.asset = asset;
            sound.assetId = asset.assetId;
            sound.md5 = `${asset.assetId}.${asset.dataFormat}`;
            resolve(sound);
        });
    };
    const deserializeCostume = function(costume, runtime, data, fileName) {
        return new Promise(async (resolve, reject) => {
            const storage = runtime.storage;
            if (!storage) {
                console.warn('No storage module present; cannot load costume asset: ', fileName);
                return reject(null);
            }
            let asset = await storage.createAsset(
                storage.AssetType.Costume,
                storage.DataFormat.PNG,
                data,
                null,
                true
            );
            asset.assetType = {
                runtimeFormat: "png"
            }
            costume.asset = asset;
            costume.assetId = asset.assetId;
            costume.md5 = `${asset.assetId}.${asset.dataFormat}`;
            resolve(costume);
        });
    };
    const isOnline = {};
    try {
        isOnline.direct = (await fetch("https://osu.direct/api/search")).ok;
    } catch (e) {
        isOnline.direct = false;
    }
    try {
        isOnline.chimu = (await fetch("https://api.chimu.moe/v1/search")).ok;
    } catch (e) {
        isOnline.chimu = false;
    }
    try {
        isOnline.nerinyan = (await fetch("https://api.nerinyan.moe/health")).ok;
    } catch (e) {
        isOnline.nerinyan = false;
    }
    try {
        isOnline.cheesegull = (await fetch("https://api.chimu.moe/cheesegull/search")).ok;
    } catch (e) {
        isOnline.cheesegull = false;
    }

    //sprites
    const Stage = vm.runtime.getTargetForStage();
    const AudioFiles = vm.runtime.getSpriteTargetByName("Audio Files");
    const Background = vm.runtime.getSpriteTargetByName("Background");
    const UI = vm.runtime.getSpriteTargetByName("UI");
    const SFX = vm.runtime.getSpriteTargetByName("SFX");
    const HitObject = vm.runtime.getSpriteTargetByName("Hit Object");

    //variables
    const selectedMenuSong = Stage.lookupVariableByNameAndType("~selectedMenuSong");
    const _mode = Stage.lookupVariableByNameAndType("_mode");
    const _mod_auto = Stage.lookupVariableByNameAndType("_mod_auto");
    const _mod_autopilot = Stage.lookupVariableByNameAndType("_mod_autopilot");
    const _game_hasEnded = Stage.lookupVariableByNameAndType("_game_hasEnded");
    const _game_hasFailed = Stage.lookupVariableByNameAndType("_game_hasFailed");
    const _timer = Stage.lookupVariableByNameAndType("_timer");

    //lists
    const beatmap_artist = Stage.lookupVariableByNameAndType("beatmap_artist", "list");
    const beatmap_audio = Stage.lookupVariableByNameAndType("beatmap_audio", "list");
    const beatmap_bg = Stage.lookupVariableByNameAndType("beatmap_bg", "list");
    const beatmap_creator = Stage.lookupVariableByNameAndType("beatmap_creator", "list");
    const beatmap_data = Stage.lookupVariableByNameAndType("beatmap_data", "list");
    const beatmap_ID = Stage.lookupVariableByNameAndType("beatmap_ID", "list");
    const beatmap_imported = Stage.lookupVariableByNameAndType("beatmap_imported", "list");
    const beatmap_leaderboards = Stage.lookupVariableByNameAndType("beatmap_leaderboards", "list");
    const beatmap_localOffset = Stage.lookupVariableByNameAndType("beatmap_localOffset", "list");
    const beatmap_objectCount = Stage.lookupVariableByNameAndType("beatmap_objectCount", "list");
    const beatmap_onlineIndex = Stage.lookupVariableByNameAndType("beatmap_onlineIndex", "list");
    const beatmap_setID = Stage.lookupVariableByNameAndType("beatmap_setID", "list");
    const beatmap_starRating = Stage.lookupVariableByNameAndType("beatmap_starRating", "list");
    const beatmap_thumbnail = Stage.lookupVariableByNameAndType("beatmap_thumbnail", "list");
    const beatmap_title = Stage.lookupVariableByNameAndType("beatmap_title", "list");
    const beatmap_version = Stage.lookupVariableByNameAndType("beatmap_version", "list");
    const chartSortedIndex = Stage.lookupVariableByNameAndType("chartSortedIndex", "list");
    const hitObject_endTime = Stage.lookupVariableByNameAndType("hitObject_endTime", "list");

    //custom
    const customSFX = Stage.lookupOrCreateList("CustomSFX", "CustomSFX");
    const SoundsForSFX = [
        "menuclick.wav",
        "menu-play-click.wav",
        "menu-options-click.wav",
        "menu-exit-click.wav",
        "menu-back-click.wav",
        "menu-import-click.wav",
        "menu-charts-click.wav",
        "select-expand.wav",
        "check-on.wav",
        "check-off.wav",
        "click-short.wav",
        "click-short-confirm.wav",
        "click-close.wav",
        "combobreak.wav",
        "failsound.wav",
        "applause.wav",
        "welcome.wav",
        "seeya.wav",
        "sectionpass.wav",
        "sectionfail.wav",
        "spinnerbonus.wav"
    ];
    const SoundsForHitObject = [
        "normal-hitnormal.wav",
        "normal-hitwhistle.wav",
        "normal-hitfinish.wav",
        "normal-hitclap.wav",
        "normal-slidertick.wav",
        "normal-sliderslide.wav",
        "normal-sliderwhistle.wav",
        "soft-hitnormal.wav",
        "soft-hitwhistle.wav",
        "soft-hitfinish.wav",
        "soft-hitclap.wav",
        "soft-slidertick.wav",
        "soft-sliderslide.wav",
        "soft-sliderwhistle.wav",
        "drum-hitnormal.wav",
        "drum-hitwhistle.wav",
        "drum-hitfinish.wav",
        "drum-hitclap.wav",
        "drum-slidertick.wav",
        "drum-sliderslide.wav",
        "drum-sliderwhistle.wav"
    ];

    //https://github.com/TurboWarp/scratch-vm/blob/develop/src/util/uid.js
    const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const uid = function () {
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

    function cloneInput(id, parent, sprite) {
        const block = JSON.parse(JSON.stringify(sprite.blocks.getBlock(id)));
        block.id = newSpriteBlockID(sprite);
        block.parent = parent;
        const clonedBlocks = [block];
        Object.values(block.inputs).forEach(e => {
            if (e.block) {
                var [id, blocks] = cloneInput(e.block, block.id, sprite);
                e.block = id;
                clonedBlocks.push(...blocks);
            }
            if (e.shadow) {
                var [id, blocks] = cloneInput(e.shadow, block.id, sprite);
                e.shadow = id;
                clonedBlocks.push(...blocks);
            }
        });
        return [block.id, clonedBlocks];
    }

    function patchAudio(sprite) {
        Object.values(sprite.blocks._blocks).filter(e => e.opcode == "sound_play").forEach(block => {
            const ids = {
                "ifelse": newSpriteBlockID(sprite),
                "contains": newSpriteBlockID(sprite),
                "join1": newSpriteBlockID(sprite),
                "song1": newSpriteBlockID(sprite),
                "setID1": newSpriteBlockID(sprite),
                "sortIDX1": newSpriteBlockID(sprite),
                "selectedSong1": newSpriteBlockID(sprite),
                "play": newSpriteBlockID(sprite),
                "join2": newSpriteBlockID(sprite),
                "song2": newSpriteBlockID(sprite),
                "setID2": newSpriteBlockID(sprite),
                "sortIDX2": newSpriteBlockID(sprite),
                "selectedSong2": newSpriteBlockID(sprite)
            };
            if (block.parent) {
                const parent = sprite.blocks.getBlock(block.parent);
                if (parent.next == block.id) parent.next = ids.ifelse;
                else Object.values(parent.inputs).forEach(input => {
                    if (input.block == block.id) input.block = ids.ifelse;
                });
            }
            if (block.next) {
                const next = sprite.blocks.getBlock(block.next);
                next.parent = ids.ifelse;
            }
            const clone1 = cloneInput(block.inputs.SOUND_MENU.block, ids.join1, sprite);
            const clone2 = cloneInput(block.inputs.SOUND_MENU.block, ids.join2, sprite);
            clone1[1].forEach(block => sprite.blocks.createBlock(block));
            clone2[1].forEach(block => sprite.blocks.createBlock(block));
            [
                {
                    "id": ids.ifelse,
                    "opcode": "control_if_else",
                    "inputs": {
                        "CONDITION": {
                            "name": "CONDITION",
                            "block": ids.contains
                        },
                        "SUBSTACK": {
                            "name": "SUBSTACK",
                            "block": ids.play
                        },
                        "SUBSTACK2": {
                            "name": "SUBSTACK2",
                            "block": block.id
                        }
                    },
                    "fields": {},
                    "next": block.next,
                    "topLevel": false,
                    "parent": block.parent,
                    "shadow": false
                },
                {
                    "id": ids.contains,
                    "opcode": "data_listcontainsitem",
                    "inputs": {
                        "ITEM": {
                            "name": "ITEM",
                            "block": ids.join1,
                            "shadow": null
                        }
                    },
                    "fields": {
                        "LIST": {
                            "name": "LIST",
                            "id": customSFX.id,
                            "value": customSFX.name,
                            "variableType": "list"
                        }
                    },
                    "next": null,
                    "topLevel": false,
                    "parent": ids.ifelse,
                    "shadow": false
                },
                {
                    "id": ids.join1,
                    "opcode": "operator_join",
                    "inputs": {
                        "STRING1": {
                            "name": "STRING1",
                            "block": clone1[0],
                            "shadow": clone1[0]
                        },
                        "STRING2": {
                            "name": "STRING2",
                            "block": ids.setID1,
                            "shadow": null
                        }
                    },
                    "fields": {},
                    "next": null,
                    "topLevel": false,
                    "parent": ids.contains,
                    "shadow": false
                },
                {
                    "id": ids.setID1,
                    "opcode": "data_itemoflist",
                    "inputs": {
                        "INDEX": {
                            "name": "INDEX",
                            "block": ids.sortIDX1,
                            "shadow": null
                        }
                    },
                    "fields": {
                        "LIST": {
                            "name": "LIST",
                            "id": beatmap_setID.id,
                            "value": beatmap_setID.name,
                            "variableType": "list"
                        }
                    },
                    "next": null,
                    "topLevel": false,
                    "parent": ids.join1,
                    "shadow": false
                },
                {
                    "id": ids.sortIDX1,
                    "opcode": "data_itemoflist",
                    "inputs": {
                        "INDEX": {
                            "name": "INDEX",
                            "block": ids.selectedSong1,
                            "shadow": null
                        }
                    },
                    "fields": {
                        "LIST": {
                            "name": "LIST",
                            "id": chartSortedIndex.id,
                            "value": chartSortedIndex.name,
                            "variableType": "list"
                        }
                    },
                    "next": null,
                    "topLevel": false,
                    "parent": ids.setID1,
                    "shadow": false
                },
                {
                    "id": ids.selectedSong1,
                    "opcode": "data_variable",
                    "inputs": {},
                    "fields": {
                        "VARIABLE": {
                            "name": "VARIABLE",
                            "id": selectedMenuSong.id,
                            "value": selectedMenuSong.name,
                            "variableType": ""
                        }
                    },
                    "next": null,
                    "topLevel": false,
                    "parent": ids.sortIDX1,
                    "shadow": false
                },
                {
                    "id": ids.play,
                    "opcode": "sound_play",
                    "inputs": {
                        "SOUND_MENU": {
                            "name": "SOUND_MENU",
                            "block": ids.join2,
                            "shadow": null
                        }
                    },
                    "fields": {},
                    "next": null,
                    "topLevel": false,
                    "parent": ids.ifelse,
                    "shadow": false
                },
                {
                    "id": ids.join2,
                    "opcode": "operator_join",
                    "inputs": {
                        "STRING1": {
                            "name": "STRING1",
                            "block": clone2[0],
                            "shadow": clone2[0]
                        },
                        "STRING2": {
                            "name": "STRING2",
                            "block": ids.setID2,
                            "shadow": null
                        }
                    },
                    "fields": {},
                    "next": null,
                    "topLevel": false,
                    "parent": ids.play,
                    "shadow": false
                },
                {
                    "id": ids.setID2,
                    "opcode": "data_itemoflist",
                    "inputs": {
                        "INDEX": {
                            "name": "INDEX",
                            "block": ids.sortIDX2,
                            "shadow": null
                        }
                    },
                    "fields": {
                        "LIST": {
                            "name": "LIST",
                            "id": beatmap_setID.id,
                            "value": beatmap_setID.name,
                            "variableType": "list"
                        }
                    },
                    "next": null,
                    "topLevel": false,
                    "parent": ids.join2,
                    "shadow": false
                },
                {
                    "id": ids.sortIDX2,
                    "opcode": "data_itemoflist",
                    "inputs": {
                        "INDEX": {
                            "name": "INDEX",
                            "block": ids.selectedSong2,
                            "shadow": null
                        }
                    },
                    "fields": {
                        "LIST": {
                            "name": "LIST",
                            "id": chartSortedIndex.id,
                            "value": chartSortedIndex.name,
                            "variableType": "list"
                        }
                    },
                    "next": null,
                    "topLevel": false,
                    "parent": ids.setID2,
                    "shadow": false
                },
                {
                    "id": ids.selectedSong2,
                    "opcode": "data_variable",
                    "inputs": {},
                    "fields": {
                        "VARIABLE": {
                            "name": "VARIABLE",
                            "id": selectedMenuSong.id,
                            "value": selectedMenuSong.name,
                            "variableType": ""
                        }
                    },
                    "next": null,
                    "topLevel": false,
                    "parent": ids.sortIDX2,
                    "shadow": false
                }
            ].forEach(block => sprite.blocks.createBlock(block));
            block.parent = ids.contains;
            block.next = null;
        });
    }
    function patchGameLogic() {
        Object.values(UI.blocks._blocks).filter(e => e.opcode == "event_broadcast_menu" && e.fields.BROADCAST_OPTION.value == "sfx_menu-play-click").map(e => UI.blocks.getBlock(e.parent)).filter(e => {
            var block = e;
            while (block.parent) block = UI.blocks.getBlock(block.parent);
            if (block.opcode != "procedures_definition") return false;
            block = UI.blocks.getBlock(block.inputs.custom_block.block);
            if (block.opcode != "procedures_prototype") return false;
            if (block.mutation.proccode == "tick_retry_game" || block.mutation.proccode == "tick_exit_game") return true;
        }).forEach(block => {
            const parent = UI.blocks.getBlock(block.parent);
            if (parent.opcode == "control_if") {
                const id = newSpriteBlockID(UI);
                parent.inputs.SUBSTACK.block = id;
                block.parent = id;
                UI.blocks.createBlock({
                    "id": id,
                    "opcode": "sound_stopallsounds",
                    "inputs": {},
                    "fields": {},
                    "next": block.id,
                    "topLevel": false,
                    "parent": parent.id,
                    "shadow": false
                });
            }
        });
        patchAudio(SFX);
        patchAudio(HitObject);
    }
    patchGameLogic();

    Object.defineProperty(this, "br", {
        get: () => document.createElement("br")
    });

    function search(query) {
        return new Promise(async resolve => {
            var response;
            var maps = [];
            if (isOnline.direct) {
                try {
                    response = await fetch("https://osu.direct/api/search?mode=0&amount=50&query=" + encodeURIComponent(query));
                    if (response.ok) maps.push(...(await (response).json()));
                    resolve(maps);
                } catch (e) { }
            }
            if (isOnline.chimu) {
                try {
                    response = await fetch("https://api.chimu.moe/v1/search?mode=0&amount=50&query=" + encodeURIComponent(query));
                    if (response.ok) maps.push(...(await (response).json()).data.map(map => {
                        map.SetID = map.SetId;
                        return map;
                    }));
                } catch (e) { }
            }
            if (isOnline.nerinyan) {
                try {
                    response = await fetch("https://api.nerinyan.moe/search?mode=0&s=ranked,qualified,loved,1,2,4&ps=50&q=" + encodeURIComponent(query));
                    if (response.ok) maps.push(...(await (response).json()).map(map => {
                        map.Title = map.title;
                        map.SetID = map.id;
                        map.Artist = map.artist;
                        map.Creator = map.creator;
                        return map;
                    }));
                } catch (e) { }
            }
            if (isOnline.cheesegull) {
                try {
                    response = await fetch("https://api.chimu.moe/cheesegull/search?mode=0&amount=50&query=" + encodeURIComponent(query));
                    if (response.ok) maps.push(...(await (response).json()));
                } catch (e) { }
            }
            resolve(maps);
        });
    }

    function getOSZ(id) {
        return new Promise(async resolve => {
            var response;
            if (isOnline.direct) {
                try {
                    response = await fetch("https://osu.direct/api/d/" + id);
                    if (response.ok) {
                        response = await (response).arrayBuffer();
                        try {
                            console.error(JSON.parse(new TextDecoder().decode(response)));
                        }
                        catch(e) {
                            return resolve(response);
                        }
                    }
                } catch(e) {
                    console.error(e);
                }
            }
            if (isOnline.chimu) {
                try {
                    response = await fetch("https://api.chimu.moe/v1/download/" + id);
                    if (response.ok) return resolve(await (response).arrayBuffer());
                } catch(e) {
                    console.error(e);
                }
            }
            if (isOnline.nerinyan) {
                try {
                    response = await fetch("https://api.allorigins.win/raw?url=https://api.nerinyan.moe/d/" + id);
                    if (response.ok) return resolve(await (response).arrayBuffer());
                } catch(e) {
                    console.error(e);
                }
            }
        });
    }

    const app = document.querySelector("canvas");
    const overlay = document.createElement("div");
    overlay.classList.add("osuOverlay");
    overlay.innerText = "Loading...";
    overlay.hidden = true;
    app.parentElement.insertBefore(overlay, app);
    function beatmap(map) {
        const container = document.createElement("div");
        container.classList.add("osuItemContainer");
        const img = new Image();
        console.log(map);
        console.log(map.SetID);
        img.src = `https://assets.ppy.sh/beatmaps/${map.SetID}/covers/list.jpg`;
        img.onerror = () => {
            img.src = "https://osu.ppy.sh/assets/images/default-bg.7594e945.png";
        }
        // const audio = document.createElement("audio");
        // audio.controls = true;
        // audio.hidden = true;
        // const load = document.createElement("a");
        // load.innerText = "Load Sample Audio";
        // load.onclick = () => {
        //     const source = document.createElement("source");
        //     source.src = "https://kitsu.moe/api/preview/" + map.SetID;
        //     source.type = "audio/mp3";
        //     audio.appendChild(source);
        //     audio.hidden = false;
        //     load.remove();
        // }
        const title = document.createElement("div");
        title.classList.add("osuTitle");
        title.innerText = map.Title;
        const artist = document.createElement("div");
        artist.classList.add("osuArtist");
        artist.innerText = "by " + map.Artist;
        const creator = document.createElement("div");
        creator.innerText = "mapped by " + map.Creator;
        const info = document.createElement("info");
        info.classList.add("osuInfo");
        const add = document.createElement("button");
        add.classList.add("osuAdd");
        add.innerText = "Add Map";
        add.onclick = async () => {
            vm.runtime.stopAll();
            overlay.innerText = "Loading...\nFetching .osz File";
            overlay.hidden = false;
            try {
                var osz = await getOSZ(map.SetID);
                overlay.innerText = "Loading...\nReading .osz File";
                osz = await new JSZip().loadAsync(osz);
                const osu = (await Object.values(osz.files).find(e => e.name.endsWith(".osu")).async("text")).replaceAll("\r", "").split("\n");
                console.log(osz);
                const audioName = osu.find(e => e.startsWith("AudioFilename:")).replace("AudioFilename:", "").trim();
                overlay.innerText = "Loading...\nAdding Audio";
                await addAudio(
                    AudioFiles,
                    await osz.file(audioName).async("Uint8Array"),
                    map.SetID
                );
                overlay.innerText = "Loading...\nAdding SFX";
                for (let name of SoundsForSFX) {
                    if (osz.file(name) && !customSFX.value.includes(name.split(".")[0] + map.SetID)) {
                        await addAudio(
                            SFX,
                            await osz.file(name).async("Uint8Array"),
                            name.split(".")[0] + map.SetID
                        );
                        customSFX.value.push(name.split(".")[0] + map.SetID);
                    }
                }
                for (let name of SoundsForHitObject) {
                    if (osz.file(name) && !customSFX.value.includes(name.split(".")[0] + map.SetID)) {
                        await addAudio(
                            HitObject,
                            await osz.file(name).async("Uint8Array"),
                            name.split(".")[0] + map.SetID
                        );
                        customSFX.value.push(name.split(".")[0] + map.SetID);
                        await addAudio(
                            HitObject,
                            await osz.file(name).async("Uint8Array"),
                            name.split(".")[0] + "2" + map.SetID
                        );
                        customSFX.value.push(name.split(".")[0] + "2" + map.SetID);
                    }
                }
                overlay.innerText = "Loading...\nAdding Background";
                const bgName = osu.find(e => e.indexOf("0,0,\"") > -1 && e.indexOf("\",0,0") > -1);
                if (bgName) var bg = "data:image/jpg;base64," + await osz.file(bgName.replace("0,0,\"", "").replace("\",0,0", "").trim()).async("base64");
                else var bg = "data:image/png;base64,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";
                let dataURL = await cropImageToStage(await loadImage(bg));
                await addCostume(
                    Background,
                    new Uint8Array(await (await fetch(dataURL)).arrayBuffer()),
                    map.SetID,
                    dataURL
                );
                await osz.forEach(async (name, file) => {
                    if (name.endsWith(".osu")) {
                        overlay.innerText = "Loading...\nFetching Beatmap";
                        var beatmap = (await file.async("text")).replaceAll("\r", "");
                        var BeatmapID = beatmap.split("\n").find(e => e.startsWith("BeatmapID:")).replace("BeatmapID:").trim();
                        overlay.innerText = "Loading...\nParsing Beatmap";
                        const beatmapData = {};
                        var key = "";
                        beatmap.split("\n").forEach(e => {
                            if (e.startsWith("[")) {
                                beatmapData[e.trim()] = [];
                                key = e.trim();
                                console.log(key);
                            } else if (beatmapData[key]) beatmapData[key].push(e);
                        });
                        beatmap_artist.value.push(map.Artist);
                        beatmap_audio.value.push(map.SetID.toString());
                        beatmap_bg.value.push(map.SetID.toString());
                        beatmap_creator.value.push(map.Creator);
                        beatmap_data.value.push(packBeatmap(beatmapData));
                        beatmap_ID.value.push(BeatmapID);
                        beatmap_imported.value.push("1");
                        beatmap_leaderboards.value.push("0");
                        beatmap_localOffset.value.push("0");
                        let objectCount = [0, 0, 0, 0];
                        beatmapData["[HitObjects]"].forEach(e => {
                            var e = parseInt(e.split(",")[3]).toString(2);
                            while (e.length < 8) e = "0" + e;
                            var type = 0;
                            if (e[0] == 1) type = 128;
                            if (e[4] == 1) type = 8;
                            if (e[6] == 1) type = 2;
                            if (e[7] == 1) type = 1;
                            if (type == 1) objectCount[1]++;
                            else if (type == 2) objectCount[2]++;
                            else if (type == 8) objectCount[3]++;
                        });
                        objectCount[0] = objectCount[1] + objectCount[2] + objectCount[3];
                        beatmap_objectCount.value.push(objectCount.join(","));
                        beatmap_onlineIndex.value.push("0");
                        beatmap_setID.value.push(map.SetID);
                        beatmap_starRating.value.push(getBeatmapStarRatings(beatmap));
                        beatmap_thumbnail.value.push(map.SetID.toString());
                        beatmap_title.value.push(map.Title);
                        beatmap_version.value.push(beatmapData["[Metadata]"].find(e => e.startsWith("Version:")).replace("Version:", "").trim());
                    }
                });
                overlay.innerText = "Loading...\nDone!";
                setTimeout(() => {
                    vm.runtime.greenFlag();
                    overlay.hidden = true;
                }, 1000);
            } catch (e) {
                overlay.innerText = "Loading...\nError:" + e;
                alert("Error:\n" + e);
                setTimeout(() => {
                    vm.runtime.greenFlag();
                    overlay.hidden = true;
                }, 1000);
            }
        }
        container.appendChild(img);
        info.appendChild(title);
        info.appendChild(artist);
        info.appendChild(creator);
        container.appendChild(info);
        container.appendChild(add);
        return container;
    }

    function addAudio(sprite, uint8array, SetID) {
        return new Promise(async resolve => {
            const md5 = MD5(uint8array);
            await vm.addSound(await deserializeSound({
                assetId: md5,
                data: null,
                dataFormat: "mp3",
                format: undefined,
                md5: md5 + ".mp3",
                name: SetID.toString()
            },
                vm.runtime,
                uint8array,
                md5 + ".mp3"
            ),
                sprite.id
            );
            resolve();
        });
    }

    function addCostume(sprite, uint8array, SetID, dataURL) {
        return new Promise(async resolve => {
            const md5 = MD5(uint8array);
            let img = await loadImage(dataURL);
            const w = img.width,
                h = img.height;
            await vm.addCostume(
                md5 + ".png",
                await deserializeCostume({
                    assetId: md5,
                    data: null,
                    dataFormat: "png",
                    format: undefined,
                    md5: md5 + ".png",
                    name: SetID.toString(),
                    bitmapResolution: 1,
                    rotationCenterX: w / 2,
                    rotationCenterY: h / 2,
                    size: [w, h]
                },
                    vm.runtime,
                    uint8array,
                    md5 + ".jpg",
                ),
                sprite.id
            );
            resolve();
        });
    }
    const style = document.createElement("style");
    style.innerHTML = `
    @font-face{
        font-family:Torus;
        src:url(data:@file/vnd.ms-opentype;base64,T1RUTwAMAIAAAwBAQ0ZGIDNj1eUAABIYAACou0dERUYXxBE1AAC61AAAAJBHUE9TEMEb5QAAu2QAADdwR1NVQp5unCkAAPLUAAAO0k9TLzJpT4QhAAAJ9AAAAGBjbWFwVTA8tgAADgQAAAP0aGVhZA3OTnkAAADUAAAANmhoZWEGcwVlAAAJ0AAAACRobXR4r1dNdAAAAQwAAAjEbWF4cAIxUAAAAADMAAAABm5hbWX6wabQAAAKVAAAA61wb3N0/7gAMgAAEfgAAAAgAABQAAIxAAAAAQAAAAEAAB63WCxfDzz1AAMD6AAAAADWF4VjAAAAANYXhWP+jf83A/sDnAAAAAMAAgAAAAAAAAONAFcCaAAbAmgAGwJoABsCaAAbAmgAGwJoABsCaAAbAmgAGwJoABsCaAAbAmgAGwJoABsCaAAbAmgAGwJoABsCaAAbAmgAGwJoABsCaAAbAmgAGwJoABsCaAAbAmgAGwJoABsCaAAbAmgAGwJoABsCaAAbAmgAGwJoABsDbQAAA5MAAAJRAEICYwBCAmMAPgKnAC8CpwAvAqcALwKnAC8CpwAvAogAQgKTAEICugAgAsQAIAKIAEICkwBCAroAIALEACACDABCAg4AQgKEAC8CDABCAg4AQgKEAC8CDABCAg4AQgKEAC8CDABCAg4AQgKEAC8CDABCAg4AQgKEAC8CDABCAg4AQgKEAC8CDABCAg4AQgKEAC8CDABCAg4AQgKEAC8CDABCAg4AQgKEAC8CDABCAg4AQgKEAC8B8QBCAfEAQgHxAEICxAAvArQALwLEAC8CtAAvAsQALwK0AC8CxAAvArQALwK6AEIC2ABCAroAQgEDAEYBQgAgAQMAJAFCACABA//lAUIABAED//gBQgAXAQP//QFCABwBAwBDAUIAIAEDACMBQgAgAQMAFwFCACABAwATAUIAIAED//8BQgAeAUkAHAFJABwCYABCAnYAQgJgAEICdgBCAgAAQgIAAEICAABCAgAAQgIAAEICPAAfAt8AKwKdAEICnQBCAp0AQgKdAEICnQBCAp0AQgL8AC8C/AAvAvwALwL8AC8C/AAvAvwALwL8AC8C/AAvAvwALwL8AC8C/AAvBCEALwQkAC8CRQBCAlwAQgIkAEICVwBCAvwALwL8AC8CaQBCAnkAQgJpAEICeQBCAmkAQgJ5AEICaQBCAnkAQgI7ACgCOwAoAjsAKAI7ACgCOwAoAmMAPgI8ABwCbwAcAjwAHAJvABwCPAAcAm8AHAI8ABwCbwAcAjwAHAJvABwCjQA+Ao0APgKNAD4CjQA+Ao0APgKNAD4CjQA+Ao0APgKNAD4CjQA+Ao0APgJkAB0CZwAdA3UAHQN2AB0DdQAdA3YAHQN1AB0DdgAdA3UAHQN2AB0DdQAdA3YAHQJLACkCRQApAkkALAJJACwCSQAsAkkALAJJACwCSQAsAkkALAJJACwCSQAsAkkALAJDACoCQwAqAkMAKgJDACoCXgAlAl0AJQJdACUCXgAlAl0AJQJdACUCXgAlAl0AJQJdACUCXgAlAl0AJQJdACUCXgAlAl0AJQJdACUCXgAlAl0AJQJdACUCXgAlAl0AJQJdACUCXgAlAl0AJQJeACUCXQAlAl0AJQJeACUCXQAlAl0AJQO0ACUDwAAlAl4AOAJdADgCGgAlAhoAJQIaACUCGgAlAhoAJQJeACUCXQAlAlMAJQLhACUC5wAlAq8AJQKuACUCKQAlAjYAJQI2ACUCKQAlAjYAJQI2ACUCKQAlAjYAJQI2ACUCKQAlAjYAJQI2ACUCKQAlAjYAJQI2ACUCKQAlAjYAJQI2ACUCKQAlAjYAJQI2ACUCKQAlAjYAJQI2ACUCKQAlAjYAJQI2ACUCKQAlAjYAJQI2ACUBtAAgAbMAPAJSACUCZgAlAlIAJQJmACUCUgAlAmYAJQJSACUCZgAlAj4AOAJiAAkA8wA0AOYAOADmABUA5v/WAOb/6QDm/+4A5gA0AOYAFADmAAgA8wAKAOb/8AD//9oA9v/aAPb/2gHxADgCEgA4AfEAOAISADgA7QA8AO0AGQFzADwA7QAyAbIAPAErAAQDJAA4AxoAOALuADgCPQA4Aj4AOAI9ADgCPgA4Aj0AOAI+ADgCPQA4Aj4AOAI9ADgCPgA4Aj0AOAI+ADgCVQAlAlUAJQJVACUCVQAlAlUAJQJVACUCVQAlAlUAJQJVACUCVQAlAlUAJQO+ACUDywAlAl4AOAJdADgCXQA4Al0AOAJeACUCXQAlAZoAOAGaADgBmgA4AZoAOAHcACEB3AAhAdwAIQHcACEB3AAhAjIAOAGvACABjgA4Aa8AIAGOADgBwQAgAY4AOAGvACABjgA4Aa8AIAGOADgCRgA4AkcAOAJGADgCRwA4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MDJBYWN1dGUuc3MwMUFicmV2ZS5zczAxQWJyZXZlLnNzMDJBYnJldmVBY2lyY3VtZmxleC5zczAxQWRpZXJlc2lzLnNzMDJBZGllcmVzaXMuc3MwMUFjaXJjdW1mbGV4LnNzMDJBZ3JhdmUuc3MwMUFtYWNyb24uc3MwMUFtYWNyb24uc3MwMkFtYWNyb25BZ3JhdmUuc3MwMkFvZ29uZWsuMDAxQW9nb25la0FyaW5nLnNzMDJBcmluZy5zczAxQW9nb25lay5zczAyQXRpbGRlLnNzMDFBRS5zczAxQXRpbGRlLnNzMDJCLnNzMDFCLnNzMDJDZG90YWNjZW50Q2FjdXRlQ2Nhcm9uRXRoLnNzMDFEY2Fyb25ELnNzMDFEY2Fyb24uc3MwMURjcm9hdC5zczAxRGNyb2F0RS5zczAxRWFjdXRlLnNzMDFFLnNzMDJFYWN1dGUuc3MwMkVicmV2ZS5zczAyRWJyZXZlLnNzMDFFYnJldmVFY2Fyb25FY2Fyb24uc3MwMUVjYXJvbi5zczAyRWNpcmN1bWZsZXguc3MwMUVjaXJjdW1mbGV4LnNzMDJFZGllcmVzaXMuc3MwMUVkaWVyZXNpcy5zczAyRWRvdGFjY2VudC5zczAyRWRvdGFjY2VudEVkb3RhY2NlbnQuMDAxRWdyYXZlLnNzMDFFbWFjcm9uLnNzMDFFbWFjcm9uRWdyYXZlLnNzMDJFbWFjcm9uLnNzMDJFb2dvbmVrLnNzMDJFb2dvbmVrLnNzMDFFb2dvbmVrRi5zczAxR2JyZXZlRy5zczAxRi5zczAyR2JyZXZlLnNzMDF1bmkwMTIyR2RvdGFjY2VudHVuaTAxMjIuc3MwMUdkb3RhY2NlbnQuc3MwMUguc3MwMUhiYXJJLnNzMDFJYWN1dGUuc3MwMUlicmV2ZUlicmV2ZS5zczAxSWNpcmN1bWZsZXguc3MwMUlkb3RhY2NlbnQuc3MwMUlkaWVyZXNpcy5zczAxSWRvdGFjY2VudElncmF2ZS5zczAxSW1hY3Jvbi5zczAxSW1hY3JvbklvZ29uZWtJb2dvbmVrLnNzMDFJdGlsZGVJdGlsZGUuc3MwMXVuaTAwQTQwMzAxdW5pMDEzNksuc3MwMXVuaTAxMzYuc3MwMUxjYXJvbkxhY3V0ZXVuaTAxM0JMZG90TmFjdXRlTmNhcm9udW5pMDE0NUVuZ09icmV2ZU8uc3MwMU9odW5nYXJ1bWxhdXRPbWFjcm9uT0Uuc3MwMVRob3JuLnNzMDFRLnNzMDFQLnNzMDFSYWN1dGUuc3MwMVIuc3MwMVJhY3V0ZVJjYXJvblJjYXJvbi5zczAxdW5pMDE1NnVuaTAxNTYuc3MwMVNhY3V0ZXVuaTAyMThTY2VkaWxsYXVuaTFFOUVULnNzMDFUYmFyLnNzMDFUY2Fyb24uc3MwMVRiYXJUY2Fyb251bmkwMTYydW5pMDE2Mi5zczAxdW5pMDIxQS4wMDF1bmkwMjFBVWJyZXZlVWh1bmdhcnVtbGF1dFVtYWNyb25VcmluZ1VvZ29uZWtVdGlsZGVWLnNzMDFXLnNzMDFXY2lyY3VtZmxleC5zczAxV2NpcmN1bWZsZXhXYWN1dGUuc3MwMVdhY3V0ZVdncmF2ZS5zczAxV2dyYXZlV2RpZXJlc2lzV2RpZXJlc2lzLnNzMDFYLnNzMDFZYWN1dGUuc3MwMVkuc3MwMVljaXJjdW1mbGV4WWNpcmN1bWZsZXguc3MwMVlkaWVyZXNpcy5zczAxWWdyYXZlLnNzMDFZZ3JhdmVaZG90YWNjZW50WmFjdXRlYS5zczAyYS5zczAxYWFjdXRlLnNzMDFhYnJldmUuc3MwMWFicmV2ZWFhY3V0ZS5zczAyYWNpcmN1bWZsZXguc3MwMWFjaXJjdW1mbGV4LnNzMDJhYnJldmUuc3MwMmFkaWVyZXNpcy5zczAyYWRpZXJlc2lzLnNzMDFhbWFjcm9uLnNzMDFhZ3JhdmUuc3MwMmFncmF2ZS5zczAxYW1hY3JvbmFtYWNyb24uc3MwMmFvZ29uZWsuc3MwMWFvZ29uZWthcmluZy5zczAxYXRpbGRlLnNzMDJhdGlsZGUuc3MwMWFyaW5nLnNzMDJhZS5zczAxYi5zczAxY2RvdGFjY2VudGNhY3V0ZWNjYXJvbmRjYXJvbmQuc3MwMWRjcm9hdGRjcm9hdC5zczAxZGNhcm9uLnNzMDFlLnNzMDFlLnNzMDJlYWN1dGUuc3MwMWVicmV2ZS5zczAxZWJyZXZlZWFjdXRlLnNzMDJlY2Fyb25lYnJldmUuc3MwMmVjYXJvbi5zczAxZWNpcmN1bWZsZXguc3MwMWVjaXJjdW1mbGV4LnNzMDJlY2Fyb24uc3MwMmVkaWVyZXNpcy5zczAyZWRpZXJlc2lzLnNzMDFlZG90YWNjZW50LnNzMDFlZG90YWNjZW50LnNzMDJlZG90YWNjZW50ZWdyYXZlLnNzMDFlbWFjcm9uLnNzMDFlbWFjcm9uZW1hY3Jvbi5zczAyZWdyYXZlLnNzMDJlb2dvbmVrLnNzMDJlb2dvbmVrLnNzMDFlb2dvbmVrZy5zczAxZ2JyZXZlZi5zczAxdW5pMDEyM3VuaTAxMjMuc3MwMWdicmV2ZS5zczAxZ2RvdGFjY2VudGdkb3RhY2NlbnQuc3MwMWhiYXJpYnJldmVpLmxvY2xUUktpbWFjcm9udW5pMDIzN2l0aWxkZWlvZ29uZWt1bmkwMDZBMDMwMXVuaTAxMzd1bmkwMTM3LnNzMDFsYWN1dGVrLnNzMDF1bmkwMTNDbGNhcm9ubGRvdG0uc3MwMW0uc3MwMm5hY3V0ZW4uc3MwMW5jYXJvbnVuaTAxNDZuYWN1dGUuc3MwMW5jYXJvbi5zczAxdW5pMDE0Ni5zczAxZW5nbnRpbGRlLnNzMDFlbmcuc3MwMW9icmV2ZW8uc3MwMW9odW5nYXJ1bWxhdXRvbWFjcm9udGhvcm4uc3MwMXAuc3MwMW9lLnNzMDFyY2Fyb25yYWN1dGVxLnNzMDF1bmkwMTU3c2FjdXRlc2NlZGlsbGF0LnNzMDF1bmkwMjE5dGNhcm9uLnNzMDF0Y2Fyb250YmFyLnNzMDF0YmFydW5pMDIxQi5zczAxdW5pMDIxQnVuaTAxNjMuc3MwMXVuaTAxNjN1YWN1dGUuc3MwMXUuc3MwMXVicmV2ZS5zczAxdWJyZXZldWNpcmN1bWZsZXguc3MwMXVkaWVyZXNpcy5zczAxdWh1bmdhcnVtbGF1dHVtYWNyb251aHVuZ2FydW1sYXV0LnNzMDF1Z3JhdmUuc3MwMXVtYWNyb24uc3MwMXVvZ29uZWsuc3MwMXVvZ29uZWt1cmluZ3V0aWxkZS5zczAxdXJpbmcuc3MwMXV0aWxkZXdhY3V0ZS5zczAxdy5zczAxd2FjdXRld2RpZXJlc2lzLnNzMDF3Y2lyY3VtZmxleC5zczAxd2NpcmN1bWZsZXh3ZGllcmVzaXN3Z3JhdmV4LnNzMDF3Z3JhdmUuc3MwMXguc3MwMnkuc3MwMnkuc3MwMXlhY3V0ZS5z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ADAB6gC7AekAvAC9AL4B6wHsAI0AvwCOAe0AMQHwAJ0B7gAyAe8AMwHyAfMB8QH0AfUB9gH3ADQB+ADAAfoB+QH7ADUB/AH/Af0CAAH+AgECAgIEAgMANgDBAgUAwgDDAMQCBgIHAgkCCAIKADcCCwA4AgwCEAIPAg4CDQITAhQCEgIRADkCFQA6AhcAxQIWAhgCGQDGAhoCHAIbADsCHgDHAh0AQgIgAh8AyAIhAiQCIwIiAicAyQIlAiYAygIpAigAywIsAisCLQIqAi4CMAIvAMwCMQI0AM0CMwIyAJACNQBDAjYARAI4AjkAzgI3AEUCOwCnAjoCPgI8Aj0ARgI/AkAAzwJBAkQCQwJCAkYCRQJHAkoA0AJIAkkA0QJMAksCTwJNAk4A0gJQAlQCUgJRAlMCVwJWAlUARwJaAEgCWAJZAl0CWwJcAl4CXwBJAmAASgCRANMCYQDUANUCYgDWAmMCZgJlAEsCZAJnAEwCawJoAmkATQJqAm0CbAJuAJIATgJvAnAATwJyAnECdQJzAnYCdAJ3AngCegDXAnkAUAJ8ANgCewDZANoA2wJ9An4AkwDcAJQCgQBRAoAAogJ/AFIChABTAoMCggKFAFQChgDdAocCiQCVAFUCiAKNAowCiwKKApECkAKPAo4AVgKTAN4CkgKVApQA3wKWAOAClwDhApsCmAKaApkCnAKeAp0CnwKhAqICoABXAFgCpAKlAqMCqAKnAqkCpgKqAqwAWQKrAq0AWgKvAq4A4gKwArQCswKyArEA4wK2ArcCtQK4AroAWwK5AOQCvQK8ArsCvgBtAG4AiwCPABEAEgATABQAFQAWABcAGAAZABoCwAK/AsECwgBjAJsAngCjAA8ADQAbABwAeQACAGAAIAB7AHIAdAALAAQAEAA9AAkACgBcAF4APAA+AA4AbwCJAEAAdQB2AGkAdwBBAAgAagB4AGsAbAADAGgAAQBhAGcABQLDAGUAYgBkAAwApgCoAJ8AHgAfAB0AnABfAJcCxAAGAHoAIQAHAHMAZgCqAKUAmQChAF0AoABwAHEAPwLGAsUCxwLKAsgCyQLLAs0CzgLMAtACzwLRAtIC0wB9AtUC1ACBAIgAhQB+AIMAggB8AIYAgACHAIQAfwLWAjECAAEA1gDhAPgBBwEdATwBXQGoAesCKQJcAosCugLRAvMDFwMtA04D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2wv/AsFAAP8At2ZmEgv7gvsT9wL4+PcCAQv7GXb3JvcAC/QddKVoC4pTn/MaC3KeaB8LB690pGhodHJnHgv7IvefAf8AKaj2CwZooXKurqGkrh4L/wDWD1w7HQsGpXqcc3R6enEeC/iQFUZbbWlzH4UL/wDVwAA7HQv3u/cDCwAAAQAAAAwAAABAAIAAAgAIAAEAWwABAF0AgQABAIMA/QABAP8BTwABAVIBsQABAfEB8wABAgICAgABAhICIAADADYABQAOABYAHgAmAC4AAQAEAAEBhwABAAQAAQGHAAEABAABAYcAAQAEAAEBSgABAAQAAQFHAAIAAQGyAbYAAAACAAICEgIdAAICHgIfAAEAAQAAAAoA2gKqAAJERkxUAA5sYXRuAB4ABAAAAAD//wADAAAACwAWADoACUFaRSAARkNBVCAAUkNSVCAAXktBWiAAak1PTCAAdk5MRCAAglJPTSAAjlRBVCAAmlRSSyAApgAA//8AAwABAAwAFwAA//8AAwACAA0AGAAA//8AAwADAA4AGQAA//8AAwAEAA8AGgAA//8AAwAFABAAGwAA//8AAwAGABEAHAAA//8AAwAHABIAHQAA//8AAwAIABMAHgAA//8AAwAJABQAHwAA//8AAwAKABUAIAAha2VybgDIa2VybgDQa2VybgDYa2VybgDga2VybgDoa2VybgDwa2VybgD4a2VybgEAa2VybgEIa2VybgEQa2VybgEYbWFyawEgbWFyawEobWFyawEwbWFyawE4bWFyawFAbWFyawFIbWFyawFQbWFyawFYbWFyawFgbWFyawFobWFyawFwbWttawF4bWttawGAbWttawGIbWttawGQbWttawGYbWttawGgbWttawGobWttawGwbWttawG4bWttawHAbWttawHIAAAAAgAAAAEAAAACAAAAAQAAAAIAAAABAAAAAgAAAAEAAAACAAAAAQAAAAIAAAABAAAAAgAAAAEAAAACAAAAAQAAAAIAAAABAAAAAgAAAAEAAAACAAAAAQAAAAIAAgADAAAAAgACAAMAAAACAAIAAwAAAAIAAgADAAAAAgACAAMAAAACAAIAAwAAAAIAAgADAAAAAgACAAMAAAACAAIAAwAAAAIAAgADAAAAAgACAAMAAAACAAQABQAAAAIABAAFAAAAAgAEAAUAAAACAAQABQAA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//IAAP/s//L/9AAAAAAAAAAA/9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/q//V/9j/uv/qAAD/2P/m//T/4gAA//L/6P/sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/7AAAAAAAAP/+AAAAAAAA//D/8P/w/+P/6AAAAAAAAAAAAAAAAAAAAAAAAAAA/8L/6P/Y/7oAAP/YAAAAAAAAAAAAAAAAAAAAAAAAAAD/7AAAAAD/8AAAAAD/4v/iAAAAAAAAAAAAAAAAAAAAAP+6//D/9v/Y//4AAAAA//D//v/yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2AAAAAAAAP/mAAAAAP/kAAAAAP/sAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAP/yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/87/9AAA/+IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/YAAAAAAAAAAAAAAAAAAAAAP/B//T/3P/OAAD/3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU//8AAAAA/+D/4gAAAAAAAAAAAAAAAAAAAAD/zgAAAAAAAAAAAAAAAAAAAAAAAP/wAAAAAAAAAAAAAAAAAAAAAAAA/+IAAAAAAAAAAAAAAAAAAP/6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8QAAAAA/+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/OAAAAAP/iAAAAAAAA/+sAAAAA/+8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFnwABAAAIJAgmAACAAUAAP/S/8T/7AAAAAAAAAAAAAD/5gACFmAABAAAIPAhPAAKABkAAP/2/87/1gAU/84AHgAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9j/7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/wf/O/8//4QAAAAAAAP/s/+IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/1P+l/64AAP+aAAAAAP/sAAAAAAAU/+z/4v/i/+z/4gAAAAAAAAAAAAAAAAAAAAAAAAAA/8T/4gAA/+IAUAAUAAAAKAAUAAAAAAAA/+IAAP/iACgAFAAUAAAAAAAAAAAAAAAA/+IAAAAAAAAAAAAAAAD/1/+qAAD/iAAAAAAAAAAAAAAAAAAAAAD/7AAAAAAAAAAAAAD/zgAAAAAAAAAAAAAAAP+t/4X/1/9qAAAAAP/+AAD/+wAA/+IAAAAA/9z/7P+4AAAAAP/iABQAAAAAAAAAAP/Y/7j/sAAA/8MAAAAAAAD/2AAAAB7//QAAAAD/7P/X/8T/xAACFIwABAAAIMggzAABAAsAAP/Y/9j/7P/i/87/2P/Y/+L/7P/iAAEUbBR2AAMADABKAA8AAQBkAAEAagABAHAAAQBwAAEAdgABAHwAAQB8AAEAggABAIgAAQCOAAEAlAABAJoAAABYAAAAXgACAKAABABoAG4ApAB0AIAAegCGAIwApACSAJ4AmAAB/3UAAAAB/1j//gAB/1YCjAAB/5oCjAAB/3sCjAAB/yoCjAAB/1ECjAAB/zoCjAAB/3UCjAAB/0sCjAAB/zcCjAAB/6MCjAAB/6IACgABASMATAABATUCQAABAUEATAABAjAAVgABAUECQAABASAAAAABASACjAABASMAAAABAgwACgABASMB9AABAAAAAAABE3gTjgADAAwASgAPAAIKWgACCmAAAgpmAAIKZgACCmwAAgpyAAIKcgACCngAAgp+AAIKhAACCooAAgqQAAAKSAAACk4AAQpUAawKWApeCmQKWApeCmQKWApeCmQKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmoKWApeCmQKWApeCmQKWApeCmQKWApeCnAKWApeCnAKWApeCnAKWApeCnYKWApeCnYKWApeCnYKfAqCCogKjgqUCpoKoBCmCqYKrBCmCrIKuBCmCqYKvhCmCsQKvhCmCsoKvhCmCsoK0BCmCsQKvhCmCsoK1hCmCtwK4hCmCugK7hCmCvQK+hCmCwAK1hCmCwYK4hCmCwwK7hCmCvQK+hCmCwALEgsYCx4LJAsqCzALNgs8C0ILEgsYC0gLJAsqC04LNgs8C1QLEgsYC0gLJAsqC04LNgs8C1QLEgsYC0gLJAsqC04LNgs8C1QLEgsYC0gLJAsqC04LNgs8C1QLEgsYC0gLJAsqC04LNgs8C1QLEgsYC0gLJAsqC04LNgs8C1QLEgsYC0gLJAsqC04LNgs8C1QLEgsYC0gLJAsqC04LNgs8C1QLEgsYCx4LJAsqCzALNgs8C0ILWhCmC2ALWhCmC2ALWhCmC2ALZhCmC2wLchCmC3gLZhCmC34LchCmC4QLihCmC2wLkBCmC3gLZhCmC34LchCmC4QLZhCmC5YLnBCmC6ILqAuuC7QLugvAC8YLqAuuC8wLugvAC9ILqAuuC8wLugvAC9ILqAuuC8wLugvAC9ILqAuuC8wLugvAC9ILqAuuC8wLugvAC9ILqAuuC8wLugvAC9ILqAuuC8wLugvAC9ILqAuuC7QLugvAC8YLqAuuC9gLugvAC94L5BCmC+oL5BCmC/AL9hCmC/wMAhCmDAgMDhCmC/wMFBCmDAgMGhCmDCAMGhCmDCYMGhCmDCAMLBCmDCAMGhCmDCAMMhCmDDgMPhCmC2wMRBCmDEoMRBCmDFAMRBCmDFAMVhCmDEoMRBCmC1QMXAxiDGgMXAxiDGgMXAxiDG4MXAxiDG4MXAxiDG4MXAxiDG4MXAxiDG4MXAxiDG4MXAxiDG4MXAxiDGgMXAxiDHQMegyADIYMjAySDJgMnhCmDKQMqhCmDLAMthCmDLwMnhCmDKQMXAxiDGgMXBCmDGgMwhCmDMgMzhCmDNQMwhCmDNoMzhCmDOAMwhCmDNoMzhCmDOAM5hCmDMgM7BCmDNQM8hCmDPgM8hCmDP4M8hCmDP4NBBCmDPgNChCmDPgKuBCmCqYNEBCmDRYNHBCmDNQNEBCmDRYNHBCmDNQNEBCmDSINHBCmDOANKBCmDRYNLhCmDNQNNBCmDRYNOhCmDNQNQA1GDUwNQA1GDVINQA1GDVINQA1GDVINQA1GDVINQA1GDVINQA1GDVINQA1GDVINQA1GDUwNQA1GDVgNQA1GDV4NZBCmDWoKWBCmCmQNcBCmDXYNfBCmDYINcBCmDYgNfBCmDY4NcBCmDYgNfBCmDY4NcBCmDYgNfBCmDY4NcBCmDYgNfBCmDY4NlBCmCugNmhCmCtwNoBCmDaYNoBCmDaYNoBCmDawNoBCmDawNoBCmDawNoBCmDawNoBCmDawNoBCmDawNoBCmDawNoBCmDawNlBCmCugNlBCmCwwNlBCmCwwNlBCmCwwNsg24Db4NxA3KDdANxA3WDdwNsg24DeINxA3KDegNxA3WDe4Nsg24DeINxA3KDegNxA3WDe4Nsg24DeINxA3KDegNxA3WDe4Nsg24DeINxA3KDegNxA3WDe4Nsg24DeINxA3KDegNxA3WDe4Nsg24DeINxA3KDegNxA3WDe4Nsg24Db4NxA3KDdANsg24DfQNxA3KDfoNxA3WDgANsg24DgYNxA3KDgwNxA3WDhIOGA4eDiQOGA4qDiQNxBCmDdwKrBCmDjALJBCmDjYLJBCmDjwLJBCmDjwOQhCmDjYLJBCmDjwMnhCmDb4KrBCmDjAMnhCmDb4KrBCmDjAMnhCmDb4KrBCmDjAOSA5ODjYOVA5aDmAOVA5mDmwOSA5ODjwOVA5aDgwOVA5mDnIOSA5ODjwOVA5aDgwOVA5mDnIOSA5ODjwOVA5aDgwOVA5mDnIOSA5ODjwOVA5aDgwOVA5mDnIOSA5ODjwOVA5aDgwOVA5mDnIOSA5ODjwOVA5aDgwOVA5mDnIOSA5ODjwOVA5aDgwOVA5mDnIOSA5ODjwOVA5aDgwOVA5mDnIOSA5ODjYOVA5aDmAOVA5mDmwOeBCmDn4OhBCmDooOVBCmDpAMqhCmDpYOVBCmDpwMqhCmDqIOVBCmDpwMqhCmDqIOVBCmDpwMqhCmDqIOVBCmDpAMMhCmDqgOrhCmEKYOtA66DsAOtA66DsYOtA66DsYOtA66DsYOtA66DsYOtA66DsYOtA66DsYOtA66DsYOrhCmEKYOtA66DswO0hCmDtgO0hCmDtgO0hCmDt4O5BCmDuoLWhCmDvAO9hCmDuoO/BCmDvAPAhCmDwgPAhCmDw4PAhCmDwgPFBCmDwgPAhCmDwgPGhCmDyAPJhCmDywPMhCmDzgPPhCmD0QOVBCmDpAOVBCmDpAOVBCmDpwOVBCmDpwOVBCmDpwOVBCmDpwPShCmDpAPShCmDpAOVBCmD1AOVBCmD1AKoA9WDmAKoA9WDmAKoA9WDgwKoA9WDgwKoA9WDgwKoA9WDgwKoA9WDgwKoA9WDgwKoA9WDgwKoA9WD1wKoA9WD2IPaA9uD3QPeg+AD4YNxBCmDjAKrBCmDb4MwhCmD1wMwhCmD1wMnhCmDb4KrBCmDjAPjBCmD5IPjBCmD5gPjBCmD5gPnhCmD5IPpBCmD6oPpBCmD7APpBCmD7APthCmD6oPvBCmD6oNmhCmD8IPyBCmD84P1BCmD9oPyBCmD84P1BCmD9oPyBCmD84P1BCmD9oP4BCmD84P5hCmD9oP7BCmD84P8hCmD9oNHA/4D/4NoBAEEAoNHA/4EBANoBAEEBYNHA/4EBANoBAEEBYNHA/4EBANoBAEEBYNHA/4EBANoBAEEBYNHA/4EBANoBAEEBYNHA/4EBANoBAEEBYNHA/4EBANoBAEEBYNHA/4D/4NoBAEEAoNHA/4EBwNoBAEECINHA/4ECgNoBAEEC4QNBCmEDoQQBCmEEYQTBCmEFIQQBCmEFgQTBCmEF4QQBCmEFgQTBCmEF4QQBCmEFgQTBCmEF4QQBCmEFgQTBCmEF4QZBCmEGoQcBCmEHYQfBCmEIINoBCmEAoNoBCmEAoOSBCmEIgNoBCmEBYNoBCmEBYOSBCmEI4NoBCmEBYNoBCmEBYOSBCmEI4NoBCmEBYNoBCmEBYOSBCmEI4NoBCmEBYNoBCmEBYOSBCmEI4QlBCmEJoQlBCmEKAQlBCmEKAQlBCmEKAAAf91AAAAAf9Y//4AAf+iAAoAAf9WAowAAf+aAowAAf97AowAAf8qAowAAf9RAowAAf86AowAAf91AowAAf9LAowAAf83AowAAf+jAowAAQE0AAAAAQI0AAsAAQE0Ao0AAQE0AyEAAQE0AyIAAQE1AyEAAQG4AAAAAQMsAAsAAQG4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AZIAEwGTAZMAEgGcAZ4AGwGfAa0AEgGuAbEAHAGyAbYABwG5AbkAFAG6AboACwG7AbsAGQG8AbwAKAG9Ab0AJAG+Ab4ALAG/Ab8AFAHBAcEAIwHCAcIACQHLAcsAGAHMAcwAFwHNAc0AKwHOAc4ALgHPAc8AGAHSAdIADAHWAdYADgHYAdgADwHZAdkABgHgAeIACAHkAeUAFwHmAeYADQHnAecADgHoAegADQHpAekADgHqAeoAKgHrAesALQHsAewAKgHtAe0ALQHwAfAAEAHzAfMAHQH3AfcABAIFAgUAAQIGAgYACgIJAgkAAQIKAgsADgACADUA1gDYAAkA8wD0AAMA9QD2AAoA9wD7AAEA/AD9AAIA/wEAABMBAQECAAQBAwEgAAMBIQEiAAQBIwEqAAUBKwEsAAkBLQEyAAcBNAE0AAcBNwE3AAcBOAE6AAUBOwE8AAgBQQFBABMBQwFDAAoBRQFFAAkBSAFPAAkBUAFRAAUBUgFTAAkBVAFWAAoBWAFeAAoBXwFgAAMBYQFkAAoBZwFpAAsBawFrAAwBbQFtAAwBcAFwAAYBcQF6AA0BewF7AA4BfQF9AA4BfwF/AA4BgQGBAA4BgwGDAA4BhQGFAA4BhwGHAA4BiQGJAA4BiwGPAA4BkQGSAA8BkwGTAA4BnAGeABABnwGgABEBogGjABEBpQGmABEBqAGpABEBqwGsABEBrgGxABIBsgGyAAQBswGzAAcBtQG1AAcB9QH1AAQAAgBdAAEAHgAMAB8AHwAPACAAIAAMACQAKAAQACsALAAFAC8AMAAFADMAMwAQADYANgAQADkAOQAQADwAPAAQAD8APwAQAEIAQgAQAEUARQAQAEsASwAQAE4ATgAQAFIAWQAQAHEAcQAOAHwAfAAFAIQAhgAQAIgAkAAQAJUAlgAQAKUArgABALoAxQACAMYAxwAnAMgA0QADANIA1QAoANYA9AALAPcBIAALASEBIQAFASIBIgAYASMBKgALASsBKwAYASwBLAAFAS0BMgAWATQBNAAWATcBNwAWATgBOgAXATsBPAAYAT8BPwAYAUEBQQAYAUMBRAAYAUUBRQAZAUYBRwAaAUgBSAAZAUkBSQAaAUoBUwAZAVQBVgALAVgBYAALAWEBYgAaAWUBZgALAWcBaQAZAWsBawAdAW0BbQAdAXABcAAYAXEBcQAI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BG5zczAxBHRzczAxBHpzczAxBIBzczAxBIZzczAxBIxzczAxBJJzczAxBJhzczAxBJ5zczAyBKRzczAyBKpzczAyBLBzczAyBLZzczAyBLxzczAyBMJzczAyBMhzczAyBM5zczAyBNRzczAyBNpzczAyBOBzdXBzBOZzdXBzBOxzdXBzBPJzdXBzBPhzdXBzBP5zdXBzBQRzdXBzBQpzdXBzBRBzdXBzBRZzdXBzBRxzdXBzBSIAAAACAAAAAQAAAAIAAAABAAAAAgAAAAEAAAACAAAAAQAAAAIAAAABAAAAAgAAAAEAAAACAAAAAQAAAAIAAAABAAAAAgAAAAEAAAACAAAAAQAAAAIAAAABAAAAAQACAAAAAQACAAAAAQACAAAAAQACAAAAAQACAAAAAQACAAAAAQACAAAAAQACAAAAAQACAAAAAQACAAAAAQACAAAAAQANAAAAAQANAAAAAQANAAAAAQANAAAAAQANAAAAAQANAAAAAQANAAAAAQANAAAAAQANAAAAAQANAAAAAQANAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQALAAAAAQAEAAAAAQAKAAAAAQAHAAAAAQAGAAAAAQADAAAAAQAFAAAAAQAIAAAAAQAJAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAQAAAAAQAQAAAAAQAQAAAAAQAQAAAAAQAQAAAAAQAQAAAAAQAQAAAAAQAQAAAAAQAQAAAAAQAQAAAAAQAQAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQASAAAAAQASAAAAAQASAAAAAQASAAAAAQASAAAAAQASAAAAAQASAAAAAQASAAAAAQASAAAAAQASAAAAAQASAAAAAQAMAAAAAQAMAAAAAQAMAAAAAQAMAAAAAQAMAAAAAQAMAAAAAQAMAAAAAQAMAAAAAQAMAAAAAQAMAAAAAQAMABcAMAA4AEAASgBUAF4AZgBuAHYAfgCGAI4AlgCeAKYAsAC4AMAAyADQANgA4ADoAAEAAAABAgoAAwAAAAECygAGAAAAAgCwAMIABgAAAAIAzADeAAYAAAACAOYA+gABAAAAAQEEAAEAAAABAQoAAQAAAAEBEAABAAAAAQEOAAEAAAABAQwAAQAAAAEBCgABAAAAAQEIAAEAAAABAQYABAAAAAEBBAAGAAAAAgEoAToABAAAAAEBQgABAAAAAQFwAAEAAAABAW4AAQAAAAEBbAABAAAAAQPcAAEAAAABA9oABAAAAAED3AABAAAAAQPyAAMAAAABA/gAAQQAAAEAAAATAAMAAAABA+YAAgP4A+4AAQAAABMAAwABA+wAAQPyAAAAAQAAABQAAwABA+YAAQPsAAAAAQAAABQAAwAAAAID4APmAAED4AABAAAAFQADAAAAAgPYA9IAAQPYAAEAAAAVAAIDygAEAKMArQFvAXkAAgO8AAQAowCtAW8BeQABA7oABgABA7QABgABA64ABgABA6gABgABA6IABgABA6IACQABA6YAAgAKACAAAgAGAA4ByAADAdgBuwHJAAMB2AG9AAEABAHKAAMB2AG9AAMAAQOCAAEDjAAAAAEAAAAWAAMAAQNwAAEDggAAAAEAAAAWAAEDeAABAAgABQAMABQAHAAiACgBswADASEBLQG0AAMBIQE/AbIAAgEhAbUAAgEtAbYAAgE/AAEDSAABAAEDQgABAAEEVAACAAIEsgBhABgAIAAqACwALgAwAEUAUwBVAFcAWQBbAF4AYABiAGQAZgBoAGoAbABuAHAAcgB0AHYAkACSAJQAlgCYAJoAnACeAKMApgCoAKoAuwC9AL8AwQDDAMUAxwDJAMsAzQDPANEA7AD0APYA/QEAAQIBIgEkASYBKAEqATwBPgFJAUsBTQFPAVEBUwFgAWIBZAFmAW8BcgF0AXYBegF8AX4BgAGCAYQBhgGIAYoBjAGOAZABkwGVAZcBmQGbAcMBxAHFAcYAAQSwADQAbgB2AHwAggCIAI4AlACaAKAApgCsALIAuAC+AMQAygDQANYA3ADiAOgA7gD0APwBAgEIAQ4BFAEaASABJgEsATIBOAE+AUQBSgFQAVYBXAFiAWgBbgF0AXoBgAGGAYwBkgGYAZ4BpAADAbcAAgADAAIABQAGAAIACAAJAAIACwAMAAIADgAPAAIAEQASAAIAFAAVAAIAGgAbAAIAHQAeAAIAIgAjAAIAMgAzAAIANQA2AAIAOAA5AAIAOwA8AAIAPgA/AAIAQQBCAAIARwBIAAIASgBLAAIATQBOAAIAUABRAAIBuACFAAIArQCsAAMBtwDXANgAAgDaANsAAgDdAN4AAgDgAOEAAgDjAOQAAgDmAOcAAgDpAOoAAgDuAO8AAgDxAPIAAgEEAQUAAgEHAQgAAgEKAQsAAgENAQ4AAgEQAREAAgETARQAAgEWARcAAgEZARoAAgEcAR0AAgEfASAAAgEuATMAAgE5AToAAgFGAUcAAgG4AVUAAgF5AXgAAgGdAZ4AAgGgAaEAAgGjAaQAAgGmAacAAgGpAaoAAgGsAa0AAQA8AAEAAgNsAAIAcgE6AAEDagACAAoAFAABAAQAewACAdQAAQAEAUMAAgHUAAIDVAAEAbcBuAG3AbgAAQACAS0BOAACAAECEgIdAAAAAQACAh8CIAABAAEBLwABAAEBOAABAAEAXwABAAEAcQABAAEBPwABAAEB1AABAAEAdwABAAQAogCrAW4BdwABAAEBLQACAAEBugG9AAAAAQACAboBvAACAAEBuQHCAAAAAQACAAEA1gABAAIAhAFUAAEAAQEhAAEAigABAAQABwAKAA0AEAATABkAHAAfACEAKQArAC0ALwAxADQANwA6AD0AQABGAEkATABPAFIAVABWAFgAWgBdAF8AYQBjAGUAZwBpAGsAbQBvAHMAdQCEAI8AkQCTAJUAlwCZAJsAnQClAKcAqQCrALoAvAC+AMAAwgDEAMYAyADKAMwAzgDQANYA2QDcAN8A4gDlAOgA6wDtAPAA8wD1APwA/wEBAQMBBgEJAQwBDwESARUBGAEbAR4BIQEjASUBJwEpATsBPQFFAUgBSgFMAU4BUAFSAVQBXwFhAWMBZQFxAXMBdQF3AXkBewF9AX8BgQGDAYUBhwGJAYsBjQGPAZIBlAGWAZgBmgGcAZ8BogGlAagBqwABADAAAQAEAAcACgANABAAEwAWABkAHAAhADEANAA3ADoAPQBAAEMARgBJAEwATwDWANkA3ADfAOIA5QDoAO0A8AEDAQYBCQEMAQ8BEgEVARgBGwEeAUUBnAGfAaIBpQGoAasAAQBhABYAHwApACsALQAvAEMAUgBUAFYAWABaAF0AXwBhAGMAZQBnAGkAawBtAG8AcQBzAHUAjwCRAJMAlQCXAJkAmwCdAKIApQCnAKkAugC8AL4AwADCAMQAxgDIAMoAzADOANAA6wDzAPUA/AD/AQEBIQEjASUBJwEpATsBPQFIAUoBTAFOAVABUgFfAWEBYwFlAW4BcQFzAXUBeQF7AX0BfwGBAYMBhQGHAYkBiwGNAY8BkgGUAZYBmAGaAboBuwG8Ab0AAQA0AAEABAAHAAoADQAQABMAGQAcACEAMQA0ADcAOgA9AEAARgBJAEwATwCEAKsA1gDZANwA3wDiAOUA6ADtAPABAwEGAQkBDAEPARIBFQEYARsBHgEtATgBRQFUAXcBnAGfAaIBpQGoAasAAQACAHEBOAABAAIAdwE/AAEABAABAIQA1gFUAAA=)
    }
    .osuContainer {
        position: fixed;
        z-index: 999;
        width: 750px;
        height: 100%;
        background: #111;
        transition: height 1s, width 1s;
        overflow-x: hidden;
        overflow-y: hidden;
    }
    .osuInnerContainer {
        width: 500px;
        height: 100%;
        overflow-y: auto;
    }
    .osuItemContainer {
        margin: 5px;
        flex: none;
        width: calc(100% - 10px);
        border-radius: 9px;
        background-color: hsl(200, 10%, 30%);
        position: relative;
        width: 472px;
        height: 130px;
    }
    .osuItemContainer img {
        border-radius: 9px;
        width: 100px;
        height: 100px;
        position: absolute;
        left: 0px;
        top: 0px;
        object-fit: cover;
    }
    .osuInfo {
        width: 380px;
        height: 90px;
        background-color: #394246;
        border-radius: 9px;
        right: 0px;
        top: 0px;
        position: absolute;
        padding: 4px 10px 6px;
    }
    .osuContainer * {
        color: #fff;
        font-weight: 600;
        font-family: Torus,Inter,"Helvetica Neue",Tahoma,Arial,"Hiragino Kaku Gothic ProN",Meiryo,"Microsoft YaHei","Apple SD Gothic Neo",sans-serif;
    }
    .osuTitle {
        font-size: 18px;
        text-shadow: 0 1px 3px rgba(0,0,0,.75);
    }
    .osuArtist {
        text-shadow: 0 1px 3px rgba(0,0,0,.75);
        font-size: 14px;
    }
    .osuAdd {
        width: 100%;
        height: 30px;
        font-height: 12px;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        position: absolute;
        background: none;
        border: none;
    }
    .osuSearch {
        background-color: hsl(200, 10%, 20%);
        border: none;
        padding: 0px;
        width: 450px;
        height: 30px;
        vertical-align: bottom;
        left: 50px;
        top: 0;
        position: absolute;
    }
    .osuOptionsHeader {
        background-color: hsl(200, 10%, 20%);
        border: none;
        width: 250px;
        height: 30px;
        vertical-align: bottom;
        left: 500px;
        top: 0;
        position: absolute;
    }
    .osuOptionsContainer {
        width: 250px;
        left: 500px;
        top: 30px;
        position: absolute;
    }
    .osuToggle {
        background-color: hsl(200, 10%, 20%);
        border: 1px solid hsl(200, 10%, 20%);
        width: 50px;
        height: 30px;
        vertical-align: bottom;
    }
    .osuOverlay {
        z-index: 998;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #000;
        color: #fff;
        text-align: center;
        justify-content: center;
        font-weight: 600;
        font-family: Torus,Inter,"Helvetica Neue",Tahoma,Arial,"Hiragino Kaku Gothic ProN",Meiryo,"Microsoft YaHei","Apple SD Gothic Neo",sans-serif;
    }
    .osuCheckbox {
        appearance: none;
        -webkit-appearance: none;
        width: 30px;
        height: 15px;
        background: none;
        border: 2px solid #e67f7f;
        border-radius: 7.5px;
        outline: none;
    }
    .osuCheckbox:checked {
        background-color: #ffaaaa;
    }
    `;
    document.head.appendChild(style);
    const container = document.createElement("div");
    container.classList.add("osuContainer");
    const innerContainer = document.createElement("div");
    innerContainer.classList.add("osuInnerContainer");
    const toggle = document.createElement("button");
    toggle.classList.add("osuToggle");
    toggle.innerText = "⏶";
    const input = document.createElement("input");
    input.classList.add("osuSearch");
    input.placeholder = "Search Beatmaps";
    input.addEventListener("keypress", async e => {
        if (e.key == "Enter") {
            [...innerContainer.children].forEach(e => e.remove());
            maps = await search(input.value);
            console.log(maps);
            maps.forEach(map => innerContainer.appendChild(beatmap(map)));
        }
    });
    input.addEventListener("change", async () => {
        [...innerContainer.children].forEach(e => e.remove());
        maps = await search(input.value);
        console.log(maps);
        maps.forEach(map => innerContainer.appendChild(beatmap(map)));
    });
    toggle.onclick = () => {
        if (toggle.innerText == "⏶") {
            toggle.innerText = "⏷";
            container.style.width = "50px";
            container.style.height = toggle.offsetHeight + "px";
        } else {
            toggle.innerText = "⏶";
            container.style.width = "750px";
            container.style.height = "100%";
        }
    }
    const optionsHeader = document.createElement("span");
    optionsHeader.classList.add("osuOptionsHeader");
    optionsHeader.innerText = "Options";
    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("osuOptionsContainer");
    const hideCursor = document.createElement("input");
    hideCursor.checked = true;
    hideCursor.type = "checkbox"
    hideCursor.classList.add("osuCheckbox");
    const hideCursorText = document.createElement("span");
    hideCursorText.innerText = "Show Computer Cursor";
    hideCursorText.classList.add("osuTitle");
    optionsContainer.appendChild(hideCursor);
    optionsContainer.appendChild(hideCursorText);
    container.appendChild(toggle);
    container.appendChild(input);
    container.appendChild(innerContainer);
    container.appendChild(optionsHeader);
    container.appendChild(optionsContainer);
    maps = await search("");
    maps.forEach(map => innerContainer.appendChild(beatmap(map)));
    document.body.insertBefore(container, document.body.firstChild);

    setInterval(updateCursor, 100);

    function updateCursor() {
        vm.renderer.canvas.style.cursor =
        (!hideCursor.checked && !(_mode.value == "gameplay" && (_mod_auto.value == "1" || _mod_autopilot.value == "1") && _game_hasEnded.value == "0" && _timer.value < hitObject_endTime.value.slice(-1) && _game_hasFailed.value == "0")) ?
        "none" :
        "default"
    }

    function packBeatmap(data) {
        const keys = {
            "[General]": [
                "AudioFilename",
                "AudioLeadIn",
                "PreviewTime",
                "Countdown",
                "SampleSet",
                "StackLeniency",
                "Mode",
                "LetterboxInBreaks",
                "UseSkinSprites",
                "OverlayPosition",
                "SkinPreference",
                "EpilepsyWarning",
                "CountdownOffset",
                "SpecialStyle",
                "WidescreenStoryboard",
                "SamplesMatchPlaybackRate"
            ],
            "[Editor]": [
                "Bookmarks",
                "DistanceSpacing",
                "BeatDivisor",
                "GridSize",
                "TimelineZoom"
            ],
            "[Metadata]": [
                "Title",
                "TitleUnicode",
                "Artist",
                "ArtistUnicode",
                "Creator",
                "Version",
                "Source",
                "Tags",
                "BeatmapID",
                "BeatmapSetID"
            ],
            "[Difficulty]": [
                "HPDrainRate",
                "CircleSize",
                "OverallDifficulty",
                "ApproachRate",
                "SliderMultiplier",
                "SliderTickRate"
            ],
            "[Colours]": [
                "Combo1 ",
                "Combo2 ",
                "Combo3 ",
                "Combo4 ",
                "Combo5 ",
                "Combo6 ",
                "Combo7 ",
                "Combo8 ",
                "SliderTrackOverride ",
                "SliderBorder "
            ]
        }
        const defaults = {
            "[General]": [
                "",
                "0",
                "-1",
                "1",
                "Normal",
                "0.7",
                "0",
                "0",
                "0",
                "NoChange",
                "",
                "0",
                "0",
                "0",
                "0",
                "0"
            ],
            "[Editor]": [
                "",
                "1",
                "4",
                "64",
                "3"
            ],
            "[Colours]": [
                "255,142,165",
                "255,169,187",
                "",
                "",
                "",
                "",
                "",
                "",
                "16,16,16",
                "192,192,192"
            ]
        }
        const beatmap = {};
        Object.keys(defaults).forEach(key => {
            beatmap[key] = {};
            for (var i = 0; i < defaults[key].length; i++) {
                beatmap[key][keys[key][i]] = defaults[key][i];
            }
        });
        Object.keys(data).forEach(key => {
            if (key in keys) {
                if (!(key in beatmap)) beatmap[key] = {};
                data[key].map(e => e.replaceAll("\r", "")).forEach(e => {
                    if (e) beatmap[key][e.split(":")[0].trim()] = e.split(":")[1].trim();
                });
            } else beatmap[key] = data[key];
        });
        var currentCode = "osu file format v14";
        currentCode += ";;[General]";
        keys["[General]"].forEach(e => {
            if (beatmap["[General]"][e] != "") currentCode += `;${e}:${beatmap["[General]"][e]}`;
        });
        currentCode += ";;[Editor]";
        keys["[Editor]"].forEach(e => {
            if (beatmap["[Editor]"][e] != "") currentCode += `;${e}:${beatmap["[Editor]"][e]}`;
        });
        currentCode += ";;[Metadata]";
        keys["[Metadata]"].forEach(e => {
            if (beatmap["[Metadata]"][e] != "") currentCode += `;${e}:${beatmap["[Metadata]"][e]}`;
        });
        currentCode += ";;[Difficulty]";
        var Difficulty = [];
        keys["[Difficulty]"].forEach(e => {
            if (beatmap["[Difficulty]"][e] != "") {
                Difficulty.push(beatmap["[Difficulty]"][e]);
                currentCode += `;${e}:${beatmap["[Difficulty]"][e]}`;
            }
        });
        currentCode += ";;[Events]";
        beatmap["[Events]"].forEach(e => {
            if (e != "") currentCode += ";" + e;
        });
        currentCode += ";;[TimingPoints]";
        beatmap["[TimingPoints]"].forEach(e => {
            if (e != "") currentCode += ";" + e;
        });
        currentCode += ";;;[Colours]";
        keys["[Colours]"].forEach(e => {
            if (beatmap["[Colours]"][e] != "") currentCode += `;${e}:${beatmap["[Colours]"][e]}`;
        });
        currentCode += ";;[HitObjects]";
        beatmap["[HitObjects]"].forEach(e => {
            if (e != "") currentCode += ";" + e;
        });
        currentCode += ";";
        return currentCode;
    }

    function loadImage(src) {
        return new Promise(resolve => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
        });
    }

    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");

    function cropImageToStage(img) {
        const s = Math.max(480 / img.width, 360 / img.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, (480 - img.width * s) / 2, (360 - img.height * s) / 2, img.width * s, img.height * s);
        return canvas.toDataURL();
    }
});
(async () => {
    if (window.osuHackInjected) return;
    if (window.location.origin == "https://scratch-hacks.terrariamodsscr.repl.co" || window.location.origin == "https://terrariamods-scratch.github.io") alert("Drag the link into your bookmarks/favorites bar\nClick it when on osu! Full Remake");
    else if (window.location.pathname.match(/(\d+)/)[0] == "613688710") inject();
    else if ((await (await fetch("https://trampoline.turbowarp.org/proxy/projects/" + window.location.pathname.match(/(\d+)/)[0])).json()).remix.parent == 613688710) inject();
    else alert("Wrong Project");
})();

//Modified version of
//https://www.npmjs.com/package/osu-sr-calculator
getBeatmapStarRatings = (() => {
    class Beatmap {
        constructor() {
            this.Version = 0;
            this.StackLeniency = 0;
            this.Difficulty = {
                HPDrainRate: 0,
                CircleSize: 0,
                OverallDifficulty: 0,
                ApproachRate: 0,
                SliderMultiplier: 0,
                SliderTickRate: 0
            }
            this.HitObjects = [];
            this.TimingPoints = [];
            this.DifficultyTimingPoints = [];
        }
    }
    class Vector2 {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        add(vector) {
            return new Vector2(this.x + vector.x, this.y + vector.y);
        }
        subtract(vector) {
            return new Vector2(this.x - vector.x, this.y - vector.y);
        }
        scale(scaleFactor) {
            return new Vector2(this.x * scaleFactor, this.y * scaleFactor);
        }
        divide(divideFactor) {
            if (divideFactor === 0)
                throw new Error("Attempt to divide vector by 0");
            return new Vector2(this.x / divideFactor, this.y / divideFactor);
        }
        dot(vector) {
            return this.x * vector.x + this.y * vector.y;
        }
        length() {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        }
        lengthSquared() {
            return Math.pow(this.length(), 2);
        }
        distance(vector) {
            const x = this.x - vector.x;
            const y = this.y - vector.y;
            const dist = x * x + y * y;
            return Math.sqrt(dist);
        }
        clone() {
            return new Vector2(this.x, this.y);
        }
        normalize() {
            const length = this.length();
            this.x /= length;
            this.y /= length;
        }
        almostEquals(vec2, acceptableDifference) {
            function checkNumbers(value1, value2) {
                return Math.abs(value1 - value2) <= acceptableDifference;
            }
            return checkNumbers(this.x, vec2.x) && checkNumbers(this.y, vec2.y);
        }
    }
    class Precision {
        static almostEqualsNumber(value1, value2, acceptableDifference = this.FLOAT_EPSILON) {
            return Math.abs(value1 - value2) <= acceptableDifference;
        }
        static almostEqualsVector(vec1, vec2, acceptableDifference = this.FLOAT_EPSILON) {
            return this.almostEqualsNumber(vec1.x, vec2.x, acceptableDifference) && this.almostEqualsNumber(vec1.y, vec2.y, acceptableDifference);
        }
    }
    Precision.FLOAT_EPSILON = 1e-3;
    const HitType = {
        Normal: 1,
        Slider: 2,
        NewCombo: 4,
        Spinner: 8,
        ComboSkip1: 16,
        Comboskip2: 32,
        ComboSkip3: 64,
        Hold: 128
    }
    const PathType = {
        Catmull: 0,
        Bezier: 1,
        Linear: 2,
        PerfectCurve: 3
    }
    function getCircleSize(mods) {
        if (mods.indexOf("HR") > -1)
            return Math.min(this.beatmap.Difficulty.CircleSize * 1.3, 10);
        if (mods.indexOf("EZ") > -1)
            return this.beatmap.Difficulty.CircleSize * 0.5;
        return this.beatmap.Difficulty.CircleSize;
    }
    class PathApproximator {
        constructor() {
            this.bezier_tolerance = 0.25;
            this.catmull_detail = 50;
            this.circular_arc_tolerance = 0.1;
        }
        approximateBezier(controlPoints) {
            let output = [];
            let count = controlPoints.length;
            if (count === 0)
                return output;
            let subdivisionBuffer1 = [];
            let subdivisionBuffer2 = [];
            for (let i = 0; i < count; i++) {
                subdivisionBuffer1.push(new Vector2(0, 0));
            }
            for (let i = 0; i < count * 2 - 1; i++) {
                subdivisionBuffer2.push(new Vector2(0, 0));
            }
            let toFlatten = [];
            let freeBuffers = [];
            const deepCopy = [];
            controlPoints.forEach(c => {
                deepCopy.push(new Vector2(c.x, c.y));
            });
            toFlatten.push(deepCopy);
            let leftChild = subdivisionBuffer2;
            while (toFlatten.length > 0) {
                let parent = toFlatten.pop();
                if (this.bezierIsFlatEnough(parent)) {
                    this.bezierApproximate(parent, output, subdivisionBuffer1, subdivisionBuffer2, count);
                    freeBuffers.push(parent);
                    continue;
                }
                let rightChild = [];
                if (freeBuffers.length > 0)
                    rightChild = freeBuffers.pop();
                else {
                    for (let i = 0; i < count; i++) {
                        rightChild.push(new Vector2(0, 0));
                    }
                }
                this.bezierSubdivide(parent, leftChild, rightChild, subdivisionBuffer1, count);
                for (let i = 0; i < count; i++) {
                    parent[i] = leftChild[i];
                }
                toFlatten.push(rightChild);
                toFlatten.push(parent);
            }
            output.push(controlPoints[count - 1]);
            return output;
        }
        approximateCatmull(controlPoints) {
            let result = [];
            for (let i = 0; i < controlPoints.length - 1; i++) {
                const v1 = i > 0 ? controlPoints[i - 1] : controlPoints[i];
                const v2 = controlPoints[i];
                const v3 = i < controlPoints.length - 1 ? controlPoints[i + 1] : v2.add(v2).subtract(v1);
                const v4 = i < controlPoints.length - 2 ? controlPoints[i + 2] : v3.add(v3).subtract(v2);
                for (let c = 0; c < this.catmull_detail; c++) {
                    result.push(this.catmullFindPoint(v1, v2, v3, v4, c / this.catmull_detail));
                    result.push(this.catmullFindPoint(v1, v2, v3, v4, (c + 1) / this.catmull_detail));
                }
            }
            return result;
        }
        approximateCircularArc(controlPoints) {
            const a = controlPoints[0];
            const b = controlPoints[1];
            const c = controlPoints[2];
            const aSq = (b.subtract(c)).lengthSquared();
            const bSq = (a.subtract(c)).lengthSquared();
            const cSq = (a.subtract(b)).lengthSquared();
            if (Precision.almostEqualsNumber(aSq, 0) || Precision.almostEqualsNumber(bSq, 0) || Precision.almostEqualsNumber(cSq, 0))
                return [];
            const s = aSq * (bSq + cSq - aSq);
            const t = bSq * (aSq + cSq - bSq);
            const u = cSq * (aSq + bSq - cSq);
            const sum = s + t + u;
            if (Precision.almostEqualsNumber(sum, 0))
                return [];
            const centre = (a.scale(s).add(b.scale(t)).add(c.scale(u))).divide(sum);
            const dA = a.subtract(centre);
            const dC = c.subtract(centre);
            const r = dA.length();
            const thetaStart = Math.atan2(dA.y, dA.x);
            let thetaEnd = Math.atan2(dC.y, dC.x);
            while (thetaEnd < thetaStart) {
                thetaEnd += 2 * Math.PI;
            }
            let dir = 1;
            let thetaRange = thetaEnd - thetaStart;
            let orthoAtoC = c.subtract(a);
            orthoAtoC = new Vector2(orthoAtoC.y, -orthoAtoC.x);
            if (orthoAtoC.dot(b.subtract(a)) < 0) {
                dir = -dir;
                thetaRange = 2 * Math.PI - thetaRange;
            }
            const amountPoints = 2 * r <= this.circular_arc_tolerance ? 2 : Math.max(2, Math.ceil(thetaRange / (2 * Math.acos(1 - this.circular_arc_tolerance / r))));
            let output = [];
            for (let i = 0; i < amountPoints; i++) {
                const fract = i / (amountPoints - 1);
                const theta = thetaStart + dir * fract * thetaRange;
                const o = new Vector2(Math.cos(theta), Math.sin(theta)).scale(r);
                output.push(centre.add(o));
            }
            return output;
        }
        approximateLinear(controlPoints) {
            return controlPoints;
        }
        bezierIsFlatEnough(controlPoints) {
            for (let i = 1; i < controlPoints.length - 1; i++) {
                if ((controlPoints[i - 1].subtract(controlPoints[i].scale(2)).add(controlPoints[i + 1])).lengthSquared() > this.bezier_tolerance * this.bezier_tolerance * 4) {
                    return false;
                }
            }
            return true;
        }
        bezierApproximate(controlPoints, output, subdivisionBuffer1, subdivisionBuffer2, count) {
            let l = subdivisionBuffer2;
            let r = subdivisionBuffer1;
            this.bezierSubdivide(controlPoints, l, r, subdivisionBuffer1, count);
            for (let i = 0; i < count - 1; i++) {
                l[count + i] = r[i + 1];
            }
            output.push(controlPoints[0]);
            for (let i = 1; i < count - 1; i++) {
                const index = 2 * i;
                const p = (l[index - 1].add(l[index].scale(2)).add(l[index + 1])).scale(0.25);
                output.push(p);
            }
        }
        bezierSubdivide(controlPoints, l, r, subdivisionBuffer, count) {
            let midpoints = subdivisionBuffer;
            for (let i = 0; i < count; i++) {
                midpoints[i] = controlPoints[i];
            }
            for (let i = 0; i < count; i++) {
                l[i] = midpoints[0];
                r[count - i - 1] = midpoints[count - i - 1];
                for (let j = 0; j < count - i - 1; j++) {
                    midpoints[j] = (midpoints[j].add(midpoints[j + 1])).divide(2);
                }
            }
        }
        catmullFindPoint(vec1, vec2, vec3, vec4, t) {
            const t2 = t * t;
            const t3 = t * t2;
            let result = new Vector2(0.5 * (2 * vec2.x + (-vec1.x + vec3.x) * t + (2 * vec1.x - 5 * vec2.x + 4 * vec3.x - vec4.x) * t2 + (-vec1.x + 3 * vec2.x - 3 * vec3.x + vec4.x) * t3), 0.5 * (2 * vec2.y + (-vec1.y + vec3.y) * t + (2 * vec1.y - 5 * vec2.y + 4 * vec3.y - vec4.y) * t2 + (-vec1.y + 3 * vec2.y - 3 * vec3.y + vec4.y) * t3));
            return result;
        }
    }
    class SliderPath {
        constructor(pathType, controlPoints, expectedDistance) {
            this.isInitialised = false;
            this.pathApproximator = new PathApproximator();
            this.pathType = pathType;
            this.controlPoints = controlPoints;
            this.expectedDistance = expectedDistance;
            this.ensureInitialised();
        }
        ensureInitialised() {
            if (this.isInitialised)
                return;
            this.isInitialised = true;
            this.controlPoints = this.controlPoints !== null ? this.controlPoints : [];
            this.calculatedPath = [];
            this.cumulativeLength = [];
            this.calculatePath();
            this.calculateCumulativeLength();
        }
        calculatePath() {
            this.calculatedPath = [];
            let start = 0;
            let end = 0;
            for (let i = 0; i < this.controlPoints.length; i++) {
                end++;
                if (i === this.controlPoints.length - 1 || (this.controlPoints[i].x === this.controlPoints[i + 1].x && this.controlPoints[i].y === this.controlPoints[i + 1].y)) {
                    let cpSpan = this.controlPoints.slice(start, end);
                    this.calculateSubPath(cpSpan).forEach(t => {
                        if (this.calculatedPath.length === 0 || this.calculatedPath[this.calculatedPath.length - 1].x !== t.x || this.calculatedPath[this.calculatedPath.length - 1].y !== t.y) {
                            this.calculatedPath.push(new Vector2(t.x, t.y));
                        }
                    });
                    start = end;
                }
            }
        }
        calculateSubPath(subControlPoints) {
            switch (this.pathType) {
                case PathType.Linear:
                    return this.pathApproximator.approximateLinear(subControlPoints);
                case PathType.PerfectCurve:
                    if (this.controlPoints.length !== 3 || subControlPoints.length !== 3)
                        break;
                    const subPath = this.pathApproximator.approximateCircularArc(subControlPoints);
                    if (subPath.length === 0)
                        break;
                    return subPath;
                case PathType.Catmull:
                    return this.pathApproximator.approximateCatmull(subControlPoints);
            }
            return this.pathApproximator.approximateBezier(subControlPoints);
        }
        calculateCumulativeLength() {
            let l = 0;
            this.cumulativeLength = [];
            this.cumulativeLength.push(l);
            for (let i = 0; i < this.calculatedPath.length - 1; i++) {
                let diff = this.calculatedPath[i + 1].subtract(this.calculatedPath[i]);
                let d = diff.length();
                if (this.expectedDistance !== null && this.expectedDistance !== undefined && this.expectedDistance - l < d) {
                    this.calculatedPath[i + 1] = this.calculatedPath[i].add(diff.scale((this.expectedDistance - l) / d));
                    this.calculatedPath.splice(i + 2, this.calculatedPath.length - 2 - i);
                    l = this.expectedDistance;
                    this.cumulativeLength.push(l);
                    break;
                }
                l += d;
                this.cumulativeLength.push(l);
            }
            if (this.expectedDistance !== undefined && this.expectedDistance !== null && l < this.expectedDistance && this.calculatedPath.length > 1) {
                let diff = this.calculatedPath[this.calculatedPath.length - 1].subtract(this.calculatedPath[this.calculatedPath.length - 2]);
                let d = diff.length();
                if (d <= 0)
                    return;
                this.calculatedPath[this.calculatedPath.length - 1].add(diff.scale((this.expectedDistance - l) / d));
                this.cumulativeLength[this.calculatedPath.length - 1] = this.expectedDistance;
            }
        }
        PositionAt(progress) {
            this.ensureInitialised();
            const d = this.progressToDistance(progress);
            return this.interpolateVertices(this.indexOfDistance(d), d);
        }
        progressToDistance(progress) {
            return Math.min(Math.max(progress, 0), 1) * this.expectedDistance;
        }
        interpolateVertices(i, d) {
            if (this.calculatedPath.length === 0)
                return new Vector2(0, 0);
            if (i <= 0)
                return this.calculatedPath[0];
            if (i >= this.calculatedPath.length)
                return this.calculatedPath[this.calculatedPath.length - 1];
            const p0 = this.calculatedPath[i - 1];
            const p1 = this.calculatedPath[i];
            const d0 = this.cumulativeLength[i - 1];
            const d1 = this.cumulativeLength[i];
            if (Precision.almostEqualsNumber(d0, d1))
                return p0;
            const w = (d - d0) / (d1 - d0);
            let result = p0.add(p1.subtract(p0).scale(w));
            return result;
        }
        ;
        indexOfDistance(d) {
            let index = this.cumulativeLength.indexOf(d);
            if (index < 0) {
                for (let i = 0; i < this.cumulativeLength.length; i++) {
                    if (this.cumulativeLength[i] > d) {
                        return i;
                    }
                }
                return this.cumulativeLength.length;
            }
            return index;
        }
    }
    class BeatmapParser {
        parseBeatmap(data, mods) {
            if (!data)
                throw new Error('No beatmap found');
            this.beatmap = new Beatmap();
            let section = null;
            let lines = data.split('\n').map(line => line.trim());
            for (let line of lines) {
                if (line.startsWith('//'))
                    continue;
                if (!line)
                    continue;
                if (!section && line.indexOf('osu file format v') > -1) {
                    this.beatmap.Version = parseInt(line.split('osu file format v')[1], 10);
                    continue;
                }
                if (/^\s*\[(.+?)\]\s*$/.test(line)) {
                    section = /^\s*\[(.+?)\]\s*$/.exec(line)[1];
                    continue;
                }
                switch (section) {
                    case 'General': {
                        let [key, value] = line.split(':').map(v => v.trim());
                        if (key === 'StackLeniency')
                            this.beatmap.StackLeniency = parseFloat(value);
                        break;
                    }
                    case 'Difficulty': {
                        let [key, value] = line.split(':').map(v => v.trim());
                        this.beatmap[section][key] = parseFloat(value);
                        break;
                    }
                    case 'TimingPoints': {
                        let split = line.split(',');
                        const time = +split[0] + (this.beatmap.Version < 5 ? 24 : 0);
                        const beatLength = +split[1];
                        const speedMultiplier = beatLength < 0 ? 100 / -beatLength : 1;
                        let timeSignature = 4;
                        if (split.length >= 3)
                            timeSignature = split[2][0] === '0' ? 4 : +split[2];
                        let timingChange = true;
                        if (split.length >= 7)
                            timingChange = split[6][0] === '1';
                        if (timingChange) {
                            this.beatmap.TimingPoints.push({
                                Time: time,
                                BeatLength: beatLength,
                                TimeSignature: timeSignature
                            });
                        }
                        this.beatmap.DifficultyTimingPoints.push({
                            Time: time,
                            SpeedMultiplier: speedMultiplier
                        });
                        break;
                    }
                    case 'HitObjects': {
                        let split = line.split(',');
                        const pos = new Vector2(+split[0], +split[1]);
                        const startTime = +split[2];
                        const hitType = +split[3];
                        let result = null;
                        const scale = (1 - 0.7 * (this.getCircleSize(mods) - 5) / 5) / 2;
                        const radius = 64 * scale;
                        if (hitType & HitType.Normal) {
                            result = this.createCircle(pos, startTime, radius);
                        }
                        if (hitType & HitType.Slider) {
                            let pathType;
                            let length = 0;
                            let pointSplit = split[5].split('|');
                            let points = [new Vector2(0, 0)];
                            pointSplit.forEach(point => {
                                if (point.length === 1) {
                                    switch (point) {
                                        case 'C':
                                            pathType = PathType.Catmull;
                                            break;
                                        case 'B':
                                            pathType = PathType.Bezier;
                                            break;
                                        case 'L':
                                            pathType = PathType.Linear;
                                            break;
                                        case 'P':
                                            pathType = PathType.PerfectCurve;
                                            break;
                                        default:
                                            pathType = PathType.Catmull;
                                            break;
                                    }
                                    return;
                                }
                                const temp = point.split(':');
                                points.push(new Vector2(+temp[0], +temp[1]).subtract(pos));
                            });
                            function isLinear(p) { return Precision.almostEqualsNumber(0, (p[1].y - p[0].y) * (p[2].x - p[0].x) - (p[1].x - p[0].x) * (p[2].y - p[0].y)); }
                            if (points.length === 3 && pathType === PathType.PerfectCurve && isLinear(points))
                                pathType = PathType.Linear;
                            let repeatCount = +split[6];
                            repeatCount = Math.max(0, repeatCount - 1);
                            if (split.length > 7)
                                length = +split[7];
                            const slider = this.createSlider(pos, points, length, pathType, repeatCount, startTime, radius);
                            result = slider;
                        }
                        if (hitType & HitType.Spinner) {
                            const endTime = +split[5];
                            result = this.createSpinner(pos, startTime, endTime);
                        }
                        this.beatmap.HitObjects.push(result);
                    }
                }
            }
            this.beatmap.HitObjects.forEach(h => {
                h.StackHeight = 0;
            });
            this.applyStacking(0, this.beatmap.HitObjects.length - 1);
            const scale = (1 - 0.7 * (this.getCircleSize(mods) - 5) / 5) / 2;
            this.beatmap.HitObjects.forEach(hitObject => {
                hitObject.calculateStackedPosition(scale);
            });
            return this.beatmap;
        }
        createCircle(pos, startTime, radius) {
            return new HitCircle(pos, startTime, radius);
        }
        createSlider(pos, points, length, pathType, repeatCount, startTime, radius) {
            const path = new SliderPath(pathType, points, Math.max(0, length));
            const speedMultiplier = this.getSpeedMultiplier(startTime);
            const beatLength = this.getBeatLength(startTime);
            return new Slider(pos, startTime, path, repeatCount, speedMultiplier, beatLength, this.beatmap.Difficulty, radius);
        }
        createSpinner(pos, startTime, endTime) {
            return new Spinner(pos, startTime, endTime);
        }
        getSpeedMultiplier(startTime) {
            const currentTimingPoint = this.getTimingPoints(startTime, this.beatmap.DifficultyTimingPoints);
            return currentTimingPoint.SpeedMultiplier;
        }
        getBeatLength(startTime) {
            const currentTimingPoint = this.getTimingPoints(startTime, this.beatmap.TimingPoints);
            return currentTimingPoint.BeatLength;
        }
        getTimingPoints(startTime, timingPoints) {
            timingPoints.sort((a, b) => {
                return a.Time - b.Time;
            });
            let currentTimingPoint;
            for (let i = 0; i < timingPoints.length; i++) {
                if (timingPoints[i].Time > startTime) {
                    currentTimingPoint = i - 1;
                    break;
                }
            }
            if (currentTimingPoint < 0) {
                console.warn("Warning: first timing point after current hit object (", startTime, "). Defaulting to first timing point of the map");
                currentTimingPoint = 0;
            }
            if (currentTimingPoint === undefined)
                currentTimingPoint = timingPoints.length - 1;
            return timingPoints[currentTimingPoint];
        }
        applyStacking(startIndex, endIndex) {
            const stack_distance = 3;
            let TimePreempt = 600;
            if (this.beatmap.Difficulty.ApproachRate > 5)
                TimePreempt = 1200 + (450 - 1200) * (this.beatmap.Difficulty.ApproachRate - 5) / 5;
            else if (this.beatmap.Difficulty.ApproachRate < 5)
                TimePreempt = 1200 - (1200 - 1800) * (5 - this.beatmap.Difficulty.ApproachRate) / 5;
            else
                TimePreempt = 1200;
            let extendedEndIndex = endIndex;
            if (endIndex < this.beatmap.HitObjects.length - 1) {
                for (let i = endIndex; i >= startIndex; i--) {
                    let stackBaseIndex = i;
                    for (let n = stackBaseIndex + 1; n < this.beatmap.HitObjects.length; n++) {
                        const stackBaseObject = this.beatmap.HitObjects[stackBaseIndex];
                        if (stackBaseObject instanceof Spinner)
                            break;
                        const objectN = this.beatmap.HitObjects[n];
                        if (objectN instanceof Spinner)
                            continue;
                        const endTime = stackBaseObject instanceof HitCircle ? stackBaseObject.StartTime : stackBaseObject.EndTime;
                        const stackThresHold = TimePreempt * this.beatmap.StackLeniency;
                        if (objectN.StartTime - endTime > stackThresHold)
                            break;
                        const endPositionDistanceCheck = stackBaseObject instanceof Slider ? stackBaseObject.EndPosition.distance(objectN.Position) < stack_distance : false;
                        if (stackBaseObject.Position.distance(objectN.Position) < stack_distance || endPositionDistanceCheck) {
                            stackBaseIndex = n;
                            objectN.StackHeight = 0;
                        }
                    }
                    if (stackBaseIndex > extendedEndIndex) {
                        extendedEndIndex = stackBaseIndex;
                        if (extendedEndIndex === this.beatmap.HitObjects.length - 1)
                            break;
                    }
                }
            }
            let extendedStartIndex = startIndex;
            for (let i = extendedEndIndex; i > startIndex; i--) {
                let n = i;
                let objectI = this.beatmap.HitObjects[i];
                if (objectI.StackHeight !== 0 || objectI instanceof Spinner)
                    continue;
                const stackThresHold = TimePreempt * this.beatmap.StackLeniency;
                if (objectI instanceof HitCircle) {
                    while (--n >= 0) {
                        const objectN = this.beatmap.HitObjects[n];
                        if (objectN instanceof Spinner)
                            continue;
                        const endTime = objectN instanceof HitCircle ? objectN.StartTime : objectN.EndTime;
                        if (objectI.StartTime - endTime > stackThresHold)
                            break;
                        if (n < extendedStartIndex) {
                            objectN.StackHeight = 0;
                            extendedStartIndex = n;
                        }
                        const endPositionDistanceCheck = objectN instanceof Slider ? objectN.EndPosition.distance(objectI.Position) < stack_distance : false;
                        if (endPositionDistanceCheck) {
                            const offset = objectI.StackHeight - objectN.StackHeight + 1;
                            for (let j = n + 1; j <= i; j++) {
                                const objectJ = this.beatmap.HitObjects[j];
                                if (objectN.EndPosition.distance(objectJ.Position) < stack_distance) {
                                    objectJ.StackHeight -= offset;
                                }
                            }
                            break;
                        }
                        if (objectN.Position.distance(objectI.Position) < stack_distance) {
                            objectN.StackHeight = objectI.StackHeight + 1;
                            objectI = objectN;
                        }
                    }
                }
                else if (objectI instanceof Slider) {
                    while (--n >= startIndex) {
                        const objectN = this.beatmap.HitObjects[n];
                        if (objectN instanceof Spinner)
                            continue;
                        if (objectI.StartTime - objectN.StartTime > stackThresHold)
                            break;
                        const objectNEndPosition = objectN instanceof HitCircle ? objectN.Position : objectN.EndPosition;
                        if (objectNEndPosition.distance(objectI.Position) < stack_distance) {
                            objectN.StackHeight = objectI.StackHeight + 1;
                            objectI = objectN;
                        }
                    }
                }
            }
        }
        getCircleSize(mods) {
            if (mods.indexOf("HR") > -1)
                return Math.min(this.beatmap.Difficulty.CircleSize * 1.3, 10);
            if (mods.indexOf("EZ") > -1)
                return this.beatmap.Difficulty.CircleSize * 0.5;
            return this.beatmap.Difficulty.CircleSize;
        }
    }
    function getTimeRate(mods) {
        if (mods.indexOf("DT") > -1)
            return 1.5;
        if (mods.indexOf("HT") > -1)
            return 0.75;
        return 1;
    }
    class HitObject {
        constructor(pos, startTime, radius) {
            this.Position = pos;
            this.StartTime = startTime;
            this.Radius = radius;
        }
        calculateStackedPosition(scale) {
            const coordinate = this.StackHeight * scale * -6.4;
            const stackOffset = new Vector2(coordinate, coordinate);
            if (this.Position !== undefined)
                this.StackedPosition = this.Position.add(stackOffset);
        }
    }
    class DifficultyHitObject extends HitObject {
        constructor(currentObject, lastObject, lastLastObject, travelDistance, jumpDistance, angle, deltaTime, strainTime) {
            super(currentObject.Position, currentObject.StartTime, currentObject.Radius);
            this.TravelDistance = travelDistance;
            this.JumpDistance = jumpDistance;
            this.Angle = angle;
            this.DeltaTime = deltaTime;
            this.StrainTime = strainTime;
            this.CurrentObject = currentObject;
            this.LastObject = lastObject;
            this.LastLastObject = lastLastObject;
        }
    }
    class HitCircle extends HitObject {
        constructor(pos, startTime, radius) {
            super(pos, startTime, radius);
        }
    }
    class HeadCircle extends HitCircle {
    }
    class TailCircle extends HitCircle {
    }
    class SliderTick extends HitObject {
        constructor(pos, startTime, spanIndex, spanStartTime, radius) {
            super(pos, startTime, radius);
            this.SpanIndex = spanIndex;
            this.SpanStartTime = spanStartTime;
        }
    }
    class RepeatPoint extends HitObject {
        constructor(pos, startTime, repeatIndex, spanDuration, radius) {
            super(pos, startTime, radius);
            this.RepeatIndex = repeatIndex;
            this.SpanDuration = spanDuration;
        }
    }
    class Slider extends HitObject {
        constructor(pos, startTime, path, repeatCount, speedMultiplier, beatLength, mapDifficulty, radius) {
            super(pos, startTime, radius);
            this.LegacyLastTickOffset = 36;
            this.Path = path;
            this.EndPosition = this.Position.add(this.Path.PositionAt(1));
            this.calculateEndTimeAndTickDistance(speedMultiplier, beatLength, mapDifficulty, repeatCount, startTime, path.expectedDistance);
            this.Duration = this.EndTime - startTime;
            this.RepeatCount = repeatCount;
            this.createNestedHitObjects();
        }
        calculateEndTimeAndTickDistance(speedMultiplier, beatLength, mapDifficulty, repeatCount, startTime, expectedDistance) {
            const scoringDistance = 100 * mapDifficulty.SliderMultiplier * speedMultiplier;
            this.Velocity = scoringDistance / beatLength;
            this.SpanCount = repeatCount + 1;
            this.TickDistance = scoringDistance / mapDifficulty.SliderTickRate * 1;
            this.EndTime = startTime + this.SpanCount * expectedDistance / this.Velocity;
        }
        createNestedHitObjects() {
            this.NestedHitObjects = [];
            this.createSliderEnds();
            this.createSliderTicks();
            this.createRepeatPoints();
            this.NestedHitObjects.sort((a, b) => {
                return a.StartTime - b.StartTime;
            });
            this.TailCircle.StartTime = Math.max(this.StartTime + this.Duration / 2, this.TailCircle.StartTime - this.LegacyLastTickOffset);
        }
        createSliderEnds() {
            this.HeadCircle = new HeadCircle(this.Position, this.StartTime, this.Radius);
            this.TailCircle = new TailCircle(this.EndPosition, this.EndTime, this.Radius);
            this.NestedHitObjects.push(this.HeadCircle);
            this.NestedHitObjects.push(this.TailCircle);
        }
        createSliderTicks() {
            const max_length = 100000;
            const length = Math.min(max_length, this.Path.expectedDistance);
            const tickDistance = Math.min(Math.max(this.TickDistance, 0), length);
            if (tickDistance === 0)
                return;
            const minDistanceFromEnd = this.Velocity * 10;
            this.SpanDuration = this.Duration / this.SpanCount;
            for (let span = 0; span < this.SpanCount; span++) {
                const spanStartTime = this.StartTime + span * this.SpanDuration;
                const reversed = span % 2 === 1;
                for (let d = tickDistance; d <= length; d += tickDistance) {
                    if (d > length - minDistanceFromEnd)
                        break;
                    const distanceProgress = d / length;
                    const timeProgress = reversed ? 1 - distanceProgress : distanceProgress;
                    const sliderTickPosition = this.Position.add(this.Path.PositionAt(distanceProgress));
                    const sliderTick = new SliderTick(sliderTickPosition, spanStartTime + timeProgress * this.SpanDuration, span, spanStartTime, this.Radius);
                    this.NestedHitObjects.push(sliderTick);
                }
            }
        }
        createRepeatPoints() {
            for (let repeatIndex = 0, repeat = 1; repeatIndex < this.RepeatCount; repeatIndex++, repeat++) {
                const repeatPosition = this.Position.add(this.Path.PositionAt(repeat % 2));
                const repeatPoint = new RepeatPoint(repeatPosition, this.StartTime + repeat * this.SpanDuration, repeatIndex, this.SpanDuration, this.Radius);
                this.NestedHitObjects.push(repeatPoint);
            }
        }
    }
    class Spinner extends HitObject {
        constructor(pos, startTime, endTime) {
            super(pos, startTime);
            this.EndTime = endTime;
        }
    }
    class DifficultyHitObjectCreator {
        constructor() {
            this.normalized_radius = 52;
            this.TravelDistance = 0;
            this.JumpDistance = 0;
            this.Angle = 0;
            this.DeltaTime = 0;
            this.StrainTime = 0;
        }
        convertToDifficultyHitObjects(hitObjects, timeRate) {
            this.difficultyHitObjects = [];
            for (let i = 1; i < hitObjects.length; i++) {
                const lastLast = i > 1 ? hitObjects[i - 2] : null;
                const last = hitObjects[i - 1];
                const current = hitObjects[i];
                const difficultyHitObject = this.createDifficultyHitObject(lastLast, last, current, timeRate);
                this.difficultyHitObjects.push(difficultyHitObject);
            }
            return this.difficultyHitObjects;
        }
        createDifficultyHitObject(lastLast, last, current, timeRate) {
            this.lastLastObject = lastLast;
            this.lastObject = last;
            this.currentObject = current;
            this.timeRate = timeRate;
            this.setDistances();
            this.setTimingValues();
            return new DifficultyHitObject(this.currentObject, this.lastObject, this.lastLastObject, this.TravelDistance, this.JumpDistance, this.Angle, this.DeltaTime, this.StrainTime);
        }
        setDistances() {
            this.TravelDistance = 0;
            this.JumpDistance = 0;
            this.Angle = 0;
            this.DeltaTime = 0;
            this.StrainTime = 0;
            let scalingFactor = this.normalized_radius / this.currentObject.Radius;
            if (this.currentObject.Radius < 30) {
                var smallCircleBonus = Math.min(30 - this.currentObject.Radius, 5) / 50;
                scalingFactor *= 1 + smallCircleBonus;
            }
            if (this.lastObject instanceof Slider) {
                let lastSlider = this.lastObject;
                this.computeSliderCursorPosition(lastSlider);
                this.TravelDistance = lastSlider.LazyTravelDistance * scalingFactor;
            }
            const lastCursorPosition = this.getEndCursorPosition(this.lastObject);
            if (!(this.currentObject instanceof Spinner))
                this.JumpDistance = this.currentObject.StackedPosition.scale(scalingFactor).subtract(lastCursorPosition.scale(scalingFactor)).length();
            if (this.lastLastObject !== null) {
                const lastLastCursorPosition = this.getEndCursorPosition(this.lastLastObject);
                const v1 = lastLastCursorPosition.subtract(this.lastObject.StackedPosition);
                const v2 = this.currentObject.StackedPosition.subtract(lastCursorPosition);
                const dot = v1.dot(v2);
                const det = v1.x * v2.y - v1.y * v2.x;
                this.Angle = Math.abs(Math.atan2(det, dot));
            }
        }
        setTimingValues() {
            this.DeltaTime = (this.currentObject.StartTime - this.lastObject.StartTime) / this.timeRate;
            this.StrainTime = Math.max(50, this.DeltaTime);
        }
        computeSliderCursorPosition(slider) {
            if (slider.LazyEndPosition !== null && slider.LazyEndPosition !== undefined)
                return;
            slider.LazyEndPosition = slider.StackedPosition;
            slider.LazyTravelDistance = 0;
            const approxFollowCircleRadius = slider.Radius * 3;
            function computeVertex(t) {
                let progress = (t - slider.StartTime) / slider.SpanDuration;
                if (progress % 2 >= 1)
                    progress = 1 - progress % 1;
                else
                    progress = progress % 1;
                let diff = slider.StackedPosition.add(slider.Path.PositionAt(progress)).subtract(slider.LazyEndPosition);
                let dist = diff.length();
                if (dist > approxFollowCircleRadius) {
                    diff.normalize();
                    dist -= approxFollowCircleRadius;
                    slider.LazyEndPosition = slider.LazyEndPosition.add(diff.scale(dist));
                    slider.LazyTravelDistance = slider.LazyTravelDistance === undefined ? dist : slider.LazyTravelDistance += dist;
                }
            }
            const scoringTimes = slider.NestedHitObjects.slice(1, slider.NestedHitObjects.length).map(t => { return t.StartTime; });
            scoringTimes.forEach(time => {
                computeVertex(time);
            });
        }
        getEndCursorPosition(object) {
            let pos = object.StackedPosition;
            if (object instanceof Slider) {
                this.computeSliderCursorPosition(object);
                pos = object.LazyEndPosition !== null && object.LazyEndPosition !== undefined ? object.LazyEndPosition : pos;
            }
            return pos;
        }
    }
    class Skill {
        constructor() {
            this.SINGLE_SPACING_THRESHOLD = 125;
            this.STREAM_SPACING_THRESHOLD = 110;
            this.Previous = [];
            this.currentStrain = 1;
            this.currentSectionPeak = 1;
            this.strainPeaks = [];
        }
        saveCurrentPeak() {
            if (this.Previous.length > 0)
                this.strainPeaks.push(this.currentSectionPeak);
        }
        ;
        startNewSectionFrom(offset) {
            if (this.Previous.length > 0)
                this.currentSectionPeak = this.currentStrain * this.strainDecay(offset - this.Previous[0].CurrentObject.StartTime);
        }
        ;
        process(currentObject) {
            this.currentStrain *= this.strainDecay(currentObject.DeltaTime);
            if (!(currentObject.CurrentObject instanceof Spinner))
                this.currentStrain += this.strainValueOf(currentObject) * this.SkillMultiplier;
            this.currentSectionPeak = Math.max(this.currentStrain, this.currentSectionPeak);
            this.addToHistory(currentObject);
        }
        ;
        difficultyValue() {
            this.strainPeaks.sort((a, b) => {
                return b - a;
            });
            let difficulty = 0;
            let weight = 1;
            this.strainPeaks.forEach(strain => {
                difficulty += strain * weight;
                weight *= 0.9;
            });
            return difficulty;
        }
        ;
        strainDecay(ms) {
            return Math.pow(this.StrainDecayBase, ms / 1000);
        }
        ;
        addToHistory(currentObject) {
            this.Previous.unshift(currentObject);
            if (this.Previous.length > 2)
                this.Previous.pop();
        }
        ;
    }
    class Aim extends Skill {
        constructor() {
            super(...arguments);
            this.angle_bonus_begin = Math.PI / 3;
            this.timing_threshold = 107;
            this.SkillMultiplier = 26.25;
            this.StrainDecayBase = 0.15;
        }
        strainValueOf(currentObject) {
            let result = 0;
            const scale = 90;
            function applyDiminishingExp(val) {
                return Math.pow(val, 0.99);
            }
            if (this.Previous.length > 0) {
                if (currentObject.Angle !== null && currentObject.Angle !== undefined && currentObject.Angle > 0 && currentObject.Angle > this.angle_bonus_begin) {
                    let angleBonus = Math.sqrt(Math.max(this.Previous[0].JumpDistance - scale, 0) *
                        Math.pow(Math.sin(currentObject.Angle - this.angle_bonus_begin), 2) *
                        Math.max(currentObject.JumpDistance - scale, 0));
                    result = 1.5 * applyDiminishingExp(Math.max(0, angleBonus)) / Math.max(this.timing_threshold, this.Previous[0].StrainTime);
                }
            }
            const jumpDistanceExp = applyDiminishingExp(currentObject.JumpDistance);
            const travelDistanceExp = applyDiminishingExp(currentObject.TravelDistance);
            let returnValue = Math.max(result + (jumpDistanceExp + travelDistanceExp + Math.sqrt(travelDistanceExp * jumpDistanceExp)) / Math.max(currentObject.StrainTime, this.timing_threshold), (Math.sqrt(travelDistanceExp * jumpDistanceExp) + jumpDistanceExp + travelDistanceExp) / currentObject.StrainTime);
            return returnValue;
        }
    }
    class Speed extends Skill {
        constructor() {
            super(...arguments);
            this.angle_bonus_begin = 5 * Math.PI / 6;
            this.pi_over_4 = Math.PI / 4;
            this.pi_over_2 = Math.PI / 2;
            this.SkillMultiplier = 1400;
            this.StrainDecayBase = 0.3;
            this.min_speed_bonus = 75;
            this.max_speed_bonus = 45;
            this.speed_balancing_factor = 40;
        }
        strainValueOf(currentObject) {
            const distance = Math.min(this.SINGLE_SPACING_THRESHOLD, currentObject.TravelDistance + currentObject.JumpDistance);
            const deltaTime = Math.max(this.max_speed_bonus, currentObject.DeltaTime);
            let speedBonus = 1.0;
            if (deltaTime < this.min_speed_bonus)
                speedBonus = 1 + Math.pow((this.min_speed_bonus - deltaTime) / this.speed_balancing_factor, 2);
            let angleBonus = 1.0;
            if (currentObject.Angle !== null && currentObject.Angle !== undefined && currentObject.Angle > 0 && currentObject.Angle < this.angle_bonus_begin) {
                angleBonus = 1 + Math.pow(Math.sin(1.5 * (this.angle_bonus_begin - currentObject.Angle)), 2) / 3.57;
                if (currentObject.Angle < this.pi_over_2) {
                    angleBonus = 1.28;
                    if (distance < 90 && currentObject.Angle < this.pi_over_4)
                        angleBonus += (1 - angleBonus) * Math.min((90 - distance) / 10, 1);
                    else if (distance < 90)
                        angleBonus += (1 - angleBonus) * Math.min((90 - distance) / 10, 1) * Math.sin((this.pi_over_2 - currentObject.Angle) / this.pi_over_4);
                }
            }
            let returnValue = (1 + (speedBonus - 1) * 0.75) * angleBonus * (0.95 + speedBonus * Math.pow(distance / this.SINGLE_SPACING_THRESHOLD, 3.5)) / currentObject.StrainTime;
            return returnValue;
        }
    }
    class StarRatingCalculator {
        constructor() {
            this.section_length = 400;
            this.difficulty_multiplier = 0.0675;
        }
        calculate(hitObjects, timeRate) {
            var _a;
            this.hitObjects = hitObjects;
            let aimSkill = new Aim();
            let speedSkill = new Speed();
            const sectionLength = this.section_length * timeRate;
            let currentSectionEnd = Math.ceil((((_a = this.hitObjects[0]) === null || _a === void 0 ? void 0 : _a.StartTime) || 0) / sectionLength) * sectionLength;
            this.hitObjects.forEach(h => {
                while (h.CurrentObject.StartTime > currentSectionEnd) {
                    aimSkill.saveCurrentPeak();
                    aimSkill.startNewSectionFrom(currentSectionEnd);
                    speedSkill.saveCurrentPeak();
                    speedSkill.startNewSectionFrom(currentSectionEnd);
                    currentSectionEnd += sectionLength;
                }
                aimSkill.process(h);
                speedSkill.process(h);
            });
            aimSkill.saveCurrentPeak();
            speedSkill.saveCurrentPeak();
            const aimRating = Math.sqrt(aimSkill.difficultyValue()) * this.difficulty_multiplier;
            const speedRating = Math.sqrt(speedSkill.difficultyValue()) * this.difficulty_multiplier;
            const starRating = aimRating + speedRating + Math.abs(aimRating - speedRating) / 2;
            return { aim: aimRating, speed: speedRating, total: starRating };
        }
    }
    var beatmap;
    const beatmapParser = new BeatmapParser();
    const difficultyHitObjectCreator = new DifficultyHitObjectCreator();
    const starRatingCalculator = new StarRatingCalculator();
    function calculateNextModCombination(map, mods, reParse) {
        if (reParse) beatmap = beatmapParser.parseBeatmap(map, mods);
        const timeRate = getTimeRate(mods);
        const difficultyHitObjects = difficultyHitObjectCreator.convertToDifficultyHitObjects(beatmap.HitObjects, timeRate);
        return starRatingCalculator.calculate(difficultyHitObjects, timeRate);
    }
    function getBeatmapStarRatings(map) {
        return [
            calculateNextModCombination(map, [], true),
            calculateNextModCombination(map, ["DT"], false),
            calculateNextModCombination(map, ["HT"], false),
            calculateNextModCombination(map, ["HR"], true),
            calculateNextModCombination(map, ["HR", "DT"], false),
            calculateNextModCombination(map, ["HR", "HT"], false),
            calculateNextModCombination(map, ["EZ"], true),
            calculateNextModCombination(map, ["EZ", "DT"], false),
            calculateNextModCombination(map, ["EZ", "HT"], false),
        ].map(e => Math.round(e.total * 100) / 100).join(",");
    }
    return getBeatmapStarRatings;
})();