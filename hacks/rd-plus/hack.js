if (window.location.origin == "https://terrariamods-scratch.github.io") alert("Drag the link into your bookmarks/favorites bar\nClick it when on scratch.mit.edu");
else if (window.location.host != "scratch.mit.edu") alert("Only works on scratch.mit.edu");
else if (window.location.href == "https://scratch.mit.edu/rd-plus") inject(window, document);
else {
    const w = window.open("https://scratch.mit.edu/rd-plus");
    w.onload = () => {
        inject(w, w.document);
    }
}

async function inject(w, d) {
    d.querySelector("title").innerText = "RD+";
    d.getElementById("topnav").remove();
    d.getElementById("footer").remove();
    d.getElementById("content").innerHTML = '<div id="app"></div><div class="screen"id="launch"hidden title="Click to start"><div class="green-flag"><svg height="44"viewBox="0 0 16.63 17.5"width="42"><defs><style>.cls-1,.cls-2{fill:#4cbf56;stroke:#45993d;stroke-linecap:round;stroke-linejoin:round}.cls-2{stroke-width:1.5px}</style></defs><path class="cls-1"d="M.75,2A6.44,6.44,0,0,1,8.44,2h0a6.44,6.44,0,0,0,7.69,0V12.4a6.44,6.44,0,0,1-7.69,0h0a6.44,6.44,0,0,0-7.69,0"/><line class="cls-2"x1="0.75"x2="0.75"y1="16.75"y2="0.75"/></svg></div></div><div class="screen"id="loading"><noscript>Enable JavaScript</noscript><img src="https://raw.githubusercontent.com/TerrariaMods-Scratch/terrariamods-scratch.github.io/main/hacks/rd-plus/Thumbnail.png"><br>Loading...</div><div class="screen"id="error"hidden><h1>Error</h1><details><summary id="error-message"></summary><p id="error-stack"></details></div>';
    function loadStyle(href) {
        return new Promise(async resolve => {
            const style = d.createElement("style");
            style.innerHTML = await (await fetch(href)).text();
            d.body.appendChild(style);
            resolve();
        });
    }
    function loadScript(src) {
        return new Promise(async resolve => {
            const script = d.createElement("script");
            script.innerHTML = await (await fetch(src)).text();
            d.body.appendChild(script);
            resolve();
        });
    }
    await loadStyle("https://raw.githubusercontent.com/TerrariaMods-Scratch/terrariamods-scratch.github.io/main/hacks/rd-plus/css/style.css");
    await loadScript("https://raw.githubusercontent.com/TerrariaMods-Scratch/terrariamods-scratch.github.io/main/hacks/rd-plus/js/vm.js");
    await loadScript("https://raw.githubusercontent.com/TerrariaMods-Scratch/terrariamods-scratch.github.io/main/hacks/rd-plus/js/init-vm.js");
    await loadScript("https://raw.githubusercontent.com/TerrariaMods-Scratch/terrariamods-scratch.github.io/main/hacks/rd-plus/js/project-data.js");
    await loadScript("https://raw.githubusercontent.com/TerrariaMods-Scratch/terrariamods-scratch.github.io/main/hacks/rd-plus/js/run.js");
}