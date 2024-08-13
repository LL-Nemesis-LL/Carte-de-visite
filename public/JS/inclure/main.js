function getLogo() {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = "public/assets/CTM.ico";
}

function getCookie() {

    let cookies = {};
    let cookie = document.cookie.split("; ");
    for (parent of cookie) {
        child = parent.split("=");
        cookies[child[0]] = child[1];
    }
    return cookies;

}
let cookie = getCookie();
let pathName = window.location.pathname;
if (pathName === "/" || pathName === "/index.html") {
    if (cookie["connected"] != undefined) {
        window.location.href = "monespace.html";
    }
}

function getComponents(nom) {
    let hote = location.host;

    let myHeader = new Headers();
    myHeader.append("Accept", "text/html");
    myHeader.append("Access-Control-Allow-Origin", "*");
    myHeader.append("Access-Control-Allow-Headers", "*");

    let myRequest = new Request("http://" + hote + "/public/components/" + nom, {
        method: "GET",
        headers: myHeader,
        mode: "no-cors",
    });
    return fetch(myRequest);
}

function getPublic(css, script) {
    const promesse = (resolve, reject) => {
        getLogo();
        for (let i = 0; i < css.length; i++) {
            let source = "/public/css/" + css[i];
            let linking = document.querySelector("link[href~='" + source + "']");
            if (!linking) {
                let link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = source;
                document.head.appendChild(link);
            }

        }
        for (let i = 0; i < script.length; i++) {
            let source = "/public/JS/" + script[i];
            let linking = document.querySelector("script[src~='" + source + "']");
            if (!linking) {
                let link = document.createElement("script");
                link.src = source;
                document.head.appendChild(link);
            }

        }
        resolve("yes");
    }
    return new Promise(promesse);
}

let css = ["fontGoogle.css", "main.css"];
let script = ["redirect.js", "animNav.js", "logOut.js"];

let getNav = getComponents("nav.html")
    .then(response => response.text());
getPublic(css, script);
if (cookie["connected"] == undefined) {
    let getNavConnected = getComponents("navBtnConnect.html")
        .then(response => {
            return response.text()
        })
        .then((html) => {
            getNav.then(htmlNav => {
                window.addEventListener('load', () => {
                    document.getElementsByTagName("nav")[0].innerHTML = htmlNav;
                    document.getElementById("divContentNav").innerHTML += html;
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
} else {
    let getNavConnect = getComponents("navConnect.html")
        .then(response => response.text())
        .then((html) => {
            getNav.then(htmlNav => {
                window.addEventListener('load', () => {
                    document.getElementsByTagName("nav")[0].innerHTML = htmlNav;
                    document.getElementById("divContentNav").innerHTML += html;
                    document.getElementById("menuCompte").addEventListener("mouseleave", menuCompteClose);
                    window.addEventListener("scroll", menuCompteClose);
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
}