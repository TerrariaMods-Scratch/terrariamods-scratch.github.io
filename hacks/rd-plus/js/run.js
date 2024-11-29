const run = async () => {
    const projectData = await getProjectData();
    await scaffolding.loadProject(projectData);
    function loadScript(src) {
        return new Promise(async resolve => {
            const script = document.createElement("script");
            script.innerHTML = await (await fetch(src)).text();
            document.body.appendChild(script);
            resolve();
        });
    }
    await loadScript("https://raw.githubusercontent.com/TerrariaMods-Scratch/terrariamods-scratch.github.io/main/hacks/rd-plus/js/anti-cheat.js");
    window.RDPlusPatchCallback = () => {
        setProgress(1);
        loadingScreen.hidden = true;
        launchScreen.hidden = false;
        launchScreen.addEventListener('click', () => {
            launchScreen.hidden = true;
            scaffolding.start();
        });
        launchScreen.focus();
    };
    await loadScript("https://raw.githubusercontent.com/TerrariaMods-Scratch/terrariamods-scratch.github.io/main/hacks/rd-plus/js/rd-plus-patch.js");
};
run().catch(handleError);