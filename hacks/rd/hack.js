if (window.location.origin == "https://terrariamods-scratch.github.io") antiCheatLog("Drag the link into your bookmarks/favorites bar\nClick it when on Robot Destructor ☁");
else if (window.location.href.startsWith("https://scratch.mit.edu/projects/489159823")) (async () => {
    const script = document.createElement("script");
    script.innerHTML = await (await fetch("https://raw.githubusercontent.com/TerrariaMods-Scratch/terrariamods-scratch.github.io/main/hacks/rd-plus/js/anti-cheat.js")).text();
    document.body.appendChild(script);
})();
else antiCheatLog("Anti-cheat not made for this version of Robot Destructor :(");