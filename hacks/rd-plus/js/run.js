const run = async () => {
    const projectData = await getProjectData();
    await scaffolding.loadProject(projectData);
    await loadScript("https://raw.githubusercontent.com/TerrariaMods-Scratch/terrariamods-scratch.github.io/main/hacks/rd-plus/js/rd-plus-patch.js");
    await loadScript("https://raw.githubusercontent.com/TerrariaMods-Scratch/terrariamods-scratch.github.io/main/hacks/rd-plus/js/anti-cheat.js");
    setProgress(1);
    loadingScreen.hidden = true;
    launchScreen.hidden = false;
    launchScreen.addEventListener('click', () => {
        launchScreen.hidden = true;
        scaffolding.start();
    });
    launchScreen.focus();
};
run().catch(handleError);