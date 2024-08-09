function getGetCartes() {
    let script = document.createElement("script");
    script.src = "/public/JS/getCartes.js";
    document.head.appendChild(script);
}

//Nav
function getNavBtnConnect() {
    getComponents("navBtnConnect.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("divContentNav").innerHTML += html;
        });
}