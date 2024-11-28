const run = async () => {
    const projectData = await getProjectData();
    await scaffolding.loadProject(projectData);
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