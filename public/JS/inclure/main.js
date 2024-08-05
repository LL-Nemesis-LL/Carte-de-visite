async function getComponents(nom, contentType) {
    let hote = location.hostname
    let myHeader = new Headers();
    myHeader.append("Content-Type", contentType);
    myHeader.append("Access-Control-Allow-Origin", "*");
    myHeader.append("Access-Control-Allow-Headers", "*")
    let myRequest = new Request("/public/components/" + nom, {
        method: "POST",
        headers: myHeader,
        mode: "no-cors",
    });
    let response = await fetch(myRequest);
    return response;
}

async function getNav() {
    let response = await getComponents("nav.html", "html/text");
    response.text()
        .then(html => {
            document.getElementsByTagName("nav")[0].innerHTML = html;
        });

}
function getLogo() {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = "/public/assets.CTM.ico";
}

function getRedirect() {
    var script = document.createElement("script");
    script.src = "/public/JS/redirect.js";
    document.head.appendChild(script);
}

window.addEventListener("load", () => {
    getLogo();
    getRedirect();
    getNav();
});