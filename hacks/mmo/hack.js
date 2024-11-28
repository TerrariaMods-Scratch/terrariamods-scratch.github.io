(async () => {
    if (window.location.origin == "https://terrariamods-scratch.github.io") alert("Drag the link into your bookmarks/favorites bar\nClick it when on Massive Multiplayer Platformer v1.3");
    else if (window.location.pathname.match(/(\d+)/) == "612229554") inject();
    else if ((await (await fetch("https://trampoline.turbowarp.org/proxy/projects/" + window.location.pathname.match(/(\d+)/))).json()).remix.parent == 612229554) inject();
    else alert("Wrong Project");
})();
const inject = (async () => {
    const _ = function(e) { return document.querySelector("#MMOModMenu" + e) };
    const vm = window.vm || (() => {
        const app = document.querySelector("#app");
        return app[Object.keys(app).find(value => value.startsWith("__reactContainer"))].child.stateNode.store.getState().scratchGui.vm;
    })();
    
    const PlayerUsernames = vm.runtime.targets[0].lookupOrCreateList("Mod-PlayerUsername", "ModMenuUsernames");
    const PlayerSkins = vm.runtime.targets[0].lookupOrCreateList("Mod-PlayerSkin", "ModMenuSkins");
    const PlayerColors = vm.runtime.targets[0].lookupOrCreateList("Mod-PlayerColor", "ModMenuColors");
    const Data = await (await fetch("https://raw.githubusercontent.com/TerrariaMods-Scratch/terrariamods-scratch.github.io/main/hacks/mmo/data.json")).json();
    const TargetPatches = Object.values(Data.targets);

    const skinData = [
        ["", "07edb9b9e82368e5dce30a60641f419a.svg"],
        ["EoC", "e83a54817d2b9d114025b1b550af966f.svg"],
        ["Cat", "65017286152bef4172225f601185ea9d.svg"],
        ["GradientOutline", "f876eeee8adca5045c82136348e9fe50.svg"],
        ["Creeper", "13452bc1e70d1829a30b034dfcf51811.svg"]
    ];

    //Establish Connection to Turbowarp
    const ws = new WebSocket("wss://clouddata.turbowarp.org");
    ws.onopen = () => {
        ws.send(JSON.stringify({
            method: "handshake",
            project_id: "https://terrariamods-scratch.github.io/hacks/mmo/",
            user: vm.runtime.ioDevices.userData.getUsername()
        }));
        setInterval(() => {
            ws.send(JSON.stringify({
                method: "set",
                name: JSON.stringify([window.location.host, vm.runtime.ioDevices.userData.getUsername(), vm.runtime.getSpriteTargetByName("Player").lookupOrCreateVariable("MMOModMenuSkinID", "skinID").value, _("ColorBlack").checked ? "Infinity" : _("ColorSelector").value]),
                value: daysSince2000()
            }));
        }, 1000);
    };
    ws.onmessage = (e) => {
        for (const message of e.data.split("\n")) {
            let obj = JSON.parse(message);
            if (obj.method === "set") {
                if (daysSince2000() - obj.value < 0.00001) {
                    obj = JSON.parse(obj.name);
                    if (window.location.host == obj[0]) {
                        console.log(obj[2]);
                        if (PlayerUsernames.value.indexOf(obj[1]) > -1) {
                            PlayerSkins.value[PlayerUsernames.value.indexOf(obj[1])] = obj[2];
                            PlayerColors.value[PlayerUsernames.value.indexOf(obj[1])] = obj[3];
                        } else {
                            PlayerUsernames.value.push(obj[1]);
                            PlayerSkins.value.push(obj[2]);
                            PlayerColors.value.push(obj[3]);
                        }
                    }
                }
            }
        }
    };
    createModMenu(skinData, _, vm);
    for (var i = 0; i < TargetPatches.length; i++) {
        vm.runtime.disposeTarget(vm.runtime.getSpriteTargetByName(TargetPatches[i].name));
        vm.emitTargetsUpdate();
        try { await vm.addSprite(TargetPatches[i]); } catch (e) { console.error(e) }
    }
    const Player = vm.runtime.getSpriteTargetByName("Player");

    //Custom Color
    Object.defineProperty(vm.runtime.targets[0].lookupOrCreateVariable("ModMenu-Color", "Player Color (TerrariaMods Bookmarklet)"), "value", {
        get: () => {
            return _("ColorBlack").checked ? Infinity : _("ColorSelector").value;
        }
    });
    const blocks = Player.blocks;
    Object.values(blocks._blocks).forEach(a => {
        if (a.opcode == "looks_seteffectto" && a.fields.EFFECT.value == "COLOR") {
            let b = blocks.getBlock(a.inputs.VALUE.block);
            if (b.opcode == "math_number" && b.fields.NUM.value == "0") {
                b.opcode = "data_variable";
                b.fields = {
                    VARIABLE: {
                        name: "VARIABLE",
                        id: "Mod-Color",
                        value: "Player Color (TerrariaMods Bookmarklet)",
                        variableType: ""
                    }
                }
            }
        }
    });

    //Username Capitalization Fix
    const Cloud = vm.runtime.getSpriteTargetByName("Cloud");
    const EncodedName = Cloud.lookupVariableByNameAndType("Encoded Name");
    const _encode = Cloud.lookupVariableByNameAndType("_encode", "list").value;
    Object.defineProperty(EncodedName, "value", {
        get: () => {
            let username = vm.runtime.ioDevices.userData.getUsername();
            if (!_("UsernameFix").checked) username = username.toUpperCase();
            var pasteStr = [];
            pasteStr.push(username.length.toString().length);
            pasteStr.push(username.length);
            for (var i = 0; i < username.length; i += 1) {
                let i2 = _encode.indexOf(username[i]) + 1;
                if (i2 < 10) pasteStr.push(0);
                pasteStr.push(i2);
            }
            return pasteStr.join("");
        },
        set: () => { }
    });
    alert("Successfully Injected Mod Menu!");
})();

function injectSpeedrunOverlay(_) {
    const canvas = document.querySelector("canvas");
    const div = document.createElement("div");
    div.id = "MMOModMenuSpeedrunOverlay";
    div.hidden = !_("CustomUI").checked;
    div.innerHTML = `
    <div id="MMOModMenuSpeedrunOverlayTimer"></div>
    <div id="MMOModMenuSpeedrunOverlayServerInfo"></div>
`;
    canvas.parentElement.insertBefore(div, canvas);
}
function injectSpeedrunClient(_) {
    injectSpeedrunOverlay(_);
    const style = document.createElement("style");
    style.innerText = `
    #MMOModMenuSpeedrunOverlay {
        pointer-events: none;
        position: absolute;
        width: 100%;
        height: 100%;
    }
    #MMOModMenuSpeedrunOverlay * {
        font-family: monospace;
        color: #0f0;
    }
    #MMOModMenuSpeedrunOverlayTimer {
        position: absolute;
        background: #000;
        padding: 5px;
        width: fit-content;
        height: fit-content;
    }
    #MMOModMenuSpeedrunOverlayServerInfo {
        position: absolute;
        right: 0px;
        background: #000;
        padding: 5px;
        width: fit-content;
        height: fit-content;
        text-align: end;
    }`;
    document.body.appendChild(style);
}

var skinID = 0;
function createModMenu(skinData, _, vm) {
    const div = document.createElement("div");
    div.id = "MMOModMenu";
    div.innerHTML = `
    <div id="MMOModMenuHeader">
        <div class="MMOModMenuTitle">Massive Multiplayer Online Platformer</div>
        <div class="MMOModMenuTitle">Mod Menu</div><br>
        Made By: <a class="MMOModMenuTitle" href="https://scratch.mit.edu/users/terrariamods/">TerrariaMods</a>
    </div>
    <hr>
    <div id="MMOModMenuSettings">
        <button class="MMOModMenuGroup" id="MMOModMenuCustomizationGroup">Customization</button>
        <br>
        <div id="MMOModMenuCustomization" hidden>
            <br><h3 class="MMOModMenuSettingLabel">Skin</h3>
            <div id="MMOModMenuSkinSelector" class="MMOModMenuSetting"><input type="button" value="←"><img id="MMOModMenuSelectedSkin" src="https://assets.scratch.mit.edu/07edb9b9e82368e5dce30a60641f419a.svg"><input type="button" value="→"></div>
            <br><h3 class="MMOModMenuSettingLabel">Skin Color</h3>
            <div class="MMOModMenuSetting"><div id="MMOModMenuColorDisplay"></div><input id="MMOModMenuColorSelector" type="range" min="0" max="200" value="0"><input id="MMOModMenuColorBlack" type="checkbox">Black<br></div>
            <br><h3 class="MMOModMenuSettingLabel">Extra</h3>
            <div class="MMOModMenuSetting"><input id="MMOModMenuUsernameFix" type="checkbox"> Fix Username Capitalization<br><br></div>
        </div>
        <br>
        <button class="MMOModMenuGroup" id="MMOModMenuSpeedrunGroup">Speedrunning</button>
        <br>
        <div id="MMOModMenuSpeedrun" hidden>
            <br><h3 class="MMOModMenuSettingLabel">Speedrun Settings</h3>
            <div class="MMOModMenuSetting"><input id="MMOModMenuCustomUI" type="checkbox"> Custom UI<br><br></div>
            <div class="MMOModMenuSetting"><input id="MMOModMenuServerInfo" type="checkbox" checked> Show Server Info<br><br></div>
            <div class="MMOModMenuSetting">Speedrun Category <select id="MMOModMenuSpeedrunCategory">
                <option>None</option>
                <option>Any%</option>
                <option>Refresh%</option>
            </select>
            <br><br></div>
        </div>
        <br>
    </div>
`;
    document.body.insertBefore(div, document.body.firstChild);
    const style = document.createElement("style");
    style.innerText = `
    .MMOModMenuTitle, .MMOModMenuSettingLabel {
        text-align: center;
    }
    #MMOModMenuSettings, .MMOModMenuSetting {
        width: fit-content;
        height: fit-content;
        margin: 0px auto;
        text-align: center;
    }
    #MMOModMenuSelectedSkin {
        margin: 0px 5px;
    }
    #MMOModMenuColorDisplay {
        width: 20px;
        height: 20px;
        border: solid #fff 2px;
        display: inline-block;
        background-color: var(--Color);
    }
    #MMOModMenu {
        position: fixed;
        z-index: 9999999;
        background-color: #000;
    }
    #MMOModMenu * {
        color: #00ff00;
        font-family: monospace;
    }
    #MMOModMenuHeader {
        padding: 10px;
        cursor: move;
        z-index: 10;
        background-color: #111;
    }
    #MMOModMenuSkinSelector input[type=button] {
        color: #000;
    }
    #MMOModMenu select {
        background-color: #000;
        border-color: #0f0;
    }
    .MMOModMenuGroup {
        background: none;
        border: 1px solid #0f0;
    }`;
    document.body.appendChild(style);
    _("SkinSelector input[value=←]").addEventListener("click", () => {
        skinID--;
        skinID = skinID % skinData.length;
        if (skinID < 0) skinID += skinData.length;
        updateSkin();
    });
    _("SkinSelector input[value=→]").addEventListener("click", () => {
        skinID++;
        skinID = skinID % skinData.length;
        if (skinID < 0) skinID += skinData.length;
        updateSkin();
    });
    function updateSkin() {
        _("SelectedSkin").src = "https://assets.scratch.mit.edu/" + skinData[skinID][1];
        vm.runtime.getSpriteTargetByName("Player").lookupOrCreateVariable("MMOModMenuSkinID", "skinID").value = skinData[skinID][0];
    }
    document.querySelector(':root').style.setProperty("--Color", "#ff9500");
    _("ColorSelector").addEventListener("input", (e) => {
        document.querySelector(':root').style.setProperty("--Color", _("ColorBlack").checked ? "Black" : skinColor(_("ColorSelector").value * 1.8 + 35, 1, 1));
    });
    _("ColorBlack").addEventListener("input", (e) => {
        document.querySelector(':root').style.setProperty("--Color", _("ColorBlack").checked ? "Black" : skinColor(_("ColorSelector").value * 1.8 + 35, 1, 1));
    });
    function skinColor(h, s, v) {
        let a = (b, c = (b + h / 60) % 6) => v - v * s * Math.max(Math.min(c, 4 - c, 1), 0);
        let d = (e, f = Math.round(e * 255).toString(16)) => f.length == 1 ? "0" + f : f;
        return "#" + [d(a(5)), d(a(3)), d(a(1))].join("");
    }

    
    _("CustomizationGroup").addEventListener("click", () => _("Customization").hidden = !_("Customization").hidden);
    _("SpeedrunGroup").addEventListener("click", () => _("Speedrun").hidden = !_("Speedrun").hidden);
    
    const Stage = vm.runtime.getTargetForStage();
    const Game = vm.runtime.getSpriteTargetByName("Game");

    const TIME = Stage.lookupVariableByNameAndType("TIME");
    const FASTEST = Stage.lookupVariableByNameAndType("FASTEST");
    const ActivePlayers = Stage.lookupVariableByNameAndType("Active Players");
    const FastestTime = Stage.lookupVariableByNameAndType("@Fastest Time");
    const FastestPlayer = Stage.lookupVariableByNameAndType("@Fastest Player");
    const clock = Game.lookupVariableByNameAndType("clock");

    injectSpeedrunClient(_);

    var clockValue = clock.value;
    var start = Date.now()-clock.value/30*1000;
    Object.defineProperty(clock, "value", {
        get: () => clockValue,
        set: value => {
            if (clockValue == 0 || value == 0) start = Date.now();
            clockValue = value;
            renderSpeedrunTimer();
        }
    });
    var FastestTimeValue = FastestTime.value;
    Object.defineProperty(FastestTime, "value", {
        get: () => FastestTimeValue,
        set: value => {
            FastestTimeValue = value;
            renderServerInfo();
        }
    });
    var FastestPlayerValue = FastestPlayer.value;
    Object.defineProperty(FastestPlayer, "value", {
        get: () => FastestPlayerValue,
        set: value => {
            FastestPlayerValue = value;
            renderServerInfo();
        }
    });
    var ActivePlayersValue = ActivePlayers.value;
    Object.defineProperty(ActivePlayers, "value", {
        get: () => ActivePlayersValue,
        set: value => {
            ActivePlayersValue = value;
            renderServerInfo();
        }
    });

    function renderServerInfo() {
        if (_("CustomUI").checked && _("ServerInfo").checked) {
            if (!_("SpeedrunOverlay")) injectSpeedrunOverlay(_);
            _("SpeedrunOverlayServerInfo").hidden = !_("ServerInfo").checked;
            _("SpeedrunOverlayServerInfo").innerText = `Active Players: ${ActivePlayersValue}\nFastest Time: ${clockToString(FastestTimeValue)}\nHeld By: ${FastestPlayerValue}`;
        }
    }
    function renderSpeedrunTimer() {
        if (_("CustomUI").checked) {
            if (!_("SpeedrunOverlay")) injectSpeedrunOverlay(_);
            _("SpeedrunOverlay").hidden = !_("CustomUI").checked;
            _("SpeedrunOverlayTimer").innerText = `Speedrun Category: ${_("SpeedrunCategory").value}\n${clockToString(clockValue)} - In Game Time\n${millisecondsToString(Date.now()-start)} - Real Time`;
        }
    }
    
    _("CustomUI").addEventListener("input", (e) => {
        vm.runtime.monitorBlocks.changeBlock({
            id: TIME.id,
            element: "checkbox",
            value: !_("CustomUI").checked
        }, vm.runtime);
        vm.runtime.monitorBlocks.changeBlock({
            id: FASTEST.id,
            element: "checkbox",
            value: !_("CustomUI").checked && _("ServerInfo").checked
        }, vm.runtime);
        vm.runtime.monitorBlocks.changeBlock({
            id: ActivePlayers.id,
            element: "checkbox",
            value: !_("CustomUI").checked && _("ServerInfo").checked
        }, vm.runtime);
        _("SpeedrunOverlay").hidden = !_("CustomUI").checked;
        renderSpeedrunTimer();
    });

    _("ServerInfo").addEventListener("input", (e) => {
        vm.runtime.monitorBlocks.changeBlock({
            id: FASTEST.id,
            element: "checkbox",
            value: !_("CustomUI").checked && _("ServerInfo").checked
        }, vm.runtime);
        vm.runtime.monitorBlocks.changeBlock({
            id: ActivePlayers.id,
            element: "checkbox",
            value: !_("CustomUI").checked && _("ServerInfo").checked
        }, vm.runtime);
        _("SpeedrunOverlayServerInfo").hidden = !_("ServerInfo").checked;
        renderServerInfo();
    });

    var x = 0, y = 0;
    _("Header").addEventListener("mousedown", (e) => {
        e = e || window.event;
        e.preventDefault();
        x = e.clientX;
        y = e.clientY;
        document.addEventListener("mousemove", headerMouseMove);
        document.addEventListener("mouseup", headerMouseUp);
    });
    const headerMouseMove = (e) => {
        e = e || window.event;
        e.preventDefault();
        x2 = x - e.clientX;
        y2 = y - e.clientY;
        x = e.clientX;
        y = e.clientY;
        _("").style.top = (_("").offsetTop - y2) + "px";
        _("").style.left = (_("").offsetLeft - x2) + "px";
    }
    const headerMouseUp = (e) => {
        document.removeEventListener("mousemove", headerMouseMove);
        document.removeEventListener("mouseup", headerMouseUp);
    }
}

//https://github.com/LLK/scratch-vm/blob/33f480513d572ac5d7cd9db1f765be68f6e0ad2d/src/blocks/scratch3_sensing.js#L252
function daysSince2000() {
    const msPerDay = 24 * 60 * 60 * 1000;
    const start = new Date(2000, 0, 1);
    const today = new Date();
    const dstAdjust = today.getTimezoneOffset() - start.getTimezoneOffset();
    let mSecsSinceStart = today.valueOf() - start.valueOf();
    mSecsSinceStart += ((today.getTimezoneOffset() - dstAdjust) * 60 * 1000);
    return mSecsSinceStart / msPerDay;
}

function clockToString(clock) {
    return millisecondsToString(clock / 30 * 1000);
}
function millisecondsToString(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const remainingMilliseconds = Math.floor(milliseconds % 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}'${remainingSeconds.toString().padStart(2, "0")}.${remainingMilliseconds.toString().padStart(3, "0")}`;
}