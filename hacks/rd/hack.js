if (window.location.origin == "https://terrariamods-scratch.github.io") {
  antiCheatLog("Drag the link into your bookmarks/favorites bar\nClick it when on Robot Destructor ☁");
} else {
  if (window.location.href.startsWith("https://scratch.mit.edu/projects/489159823")) {
    c();
  } else {
    antiCheatLog("Anti-cheat not made for this version of Robot Destructor :(");
  }
}
function c() {
  const d = document.getElementById('app')._reactRootContainer._internalRoot.current.child.pendingProps.store.getState().scratchGui.vm;
  (async () => {
    alert("Installing Anti-Cheat...");
    const o = d.renderer.canvas || document.querySelector("canvas");
    const p = document.createElement("div");
    p.id = "anti-cheat-overlay";
    p.style.width = "100%";
    p.style.height = "100%";
    p.style.position = "absolute";
    p.style.pointerEvents = "none";
    o.parentElement.insertBefore(p, o);
    window.fakeNames = {};
    window.noClipDetected = {};
    window.ProtectionEstimate = {};
    window.SpeedEstimate = {};
    d.runtime.ioDevices.cloud.updateCloudVariable = () => {};
    alert("Installed Anti-Cheat!");
  })();
}
