document.querySelectorAll(".downloadParts").forEach(elem => {
    elem.addEventListener("click", e => {
        e.preventDefault();
        download(elem.href, elem.download, parseInt(elem.getAttribute("numParts")));
    });
});
async function download(url, filename, numParts) {
    const parts = await Promise.all(Array.from({ length: numParts }, (_, i) => fetch(`${url}.${i}`).then(res => res.arrayBuffer())));
    const blob = new Blob(parts.map(e => new Uint8Array(e)));
    const fileUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = filename;
    a.click();

    a.remove();
    URL.revokeObjectURL(fileUrl);
}

const loadButton = document.querySelector("#loadProject");
const game = document.querySelector("#game");
loadButton.addEventListener("click", e => {
    game.src = "./embed/?loadCustom=true";
});

const scrollDiv = document.querySelector("#scroll")
const thumb = document.querySelector(".scrollbar-thumb");
function updateScrollbar() {
    let thumbHeight = (scrollDiv.clientHeight - 8) * (scrollDiv.clientHeight - 8) / scrollDiv.scrollHeight;
    thumb.style.height = thumbHeight + "px";
    let scrollPercentage = scrollDiv.scrollTop / (scrollDiv.scrollHeight - scrollDiv.clientHeight);
    thumb.style.top = (scrollPercentage * (scrollDiv.clientHeight - thumbHeight - 8) + 4) + "px";
}
updateScrollbar();
scrollDiv.addEventListener("scroll", updateScrollbar);
window.addEventListener("resize", updateScrollbar);