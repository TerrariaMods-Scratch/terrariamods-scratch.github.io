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
        ["Cat", "65017286152bef4172225f601185ea9d.svg"]
    ];

    //Establish Connection to Turbowarp
    const ws = new WebSocket("wss://clouddata.turbowarp.org");
    ws.onopen = () => {
        ws.send(JSON.stringify({
            method: "handshake",
            project_id: "680643095",
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
        await vm.deleteSprite(vm.runtime.getSpriteTargetByName(TargetPatches[i].name).id);
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
        <br><h3 class="MMOModMenuSettingLabel">Skin</h3>
        <div id="MMOModMenuSkinSelector" class="MMOModMenuSetting"><input type="button" value="←"><img id="MMOModMenuSelectedSkin" src="https://assets.scratch.mit.edu/07edb9b9e82368e5dce30a60641f419a.svg"><input type="button" value="→"></div>
        <br><h3 class="MMOModMenuSettingLabel">Skin Color</h3>
        <div class="MMOModMenuSetting"><div id="MMOModMenuColorDisplay"></div><input id="MMOModMenuColorSelector" type="range" min="0" max="200" value="0"><input id="MMOModMenuColorBlack" type="checkbox">Black<br></div>
        <br><h3 class="MMOModMenuSettingLabel">Extra</h3>
        <div class="MMOModMenuSetting"><input id="MMOModMenuUsernameFix" type="checkbox"> Fix Username Capitalization<br><br></div>
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