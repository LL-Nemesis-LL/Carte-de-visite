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
        let child = parent.split("=");
        cookies[child[0]] = child[1];
    }
    return cookies;

}

function getParamUrl() {
    let params = {};
    let path = window.location.href;
    let paramsUrl = path.split("?");
    console.log(paramsUrl)
    let param = paramsUrl[1].split("&");
    for (parent of param) {
        let child = parent.split("=");
        params[child[0]] = child[1];
    }
    return params;
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
    return fetch(myRequest)
        .then(response => response.text());
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

let cookie = getCookie();
let pathName = window.location.pathname;
if (pathName === "/" || pathName === "/index.html") {
    if (cookie["connected"] != undefined) {
        window.location.href = "monespace.html";
    }
}


let css = ["fontGoogle.css", "main.css"];
let script = ["redirect.js", "animNav.js", "request.js", "logOut.js"];

let getNav = getComponents("nav.html");
getPublic(css, script);
if (cookie["connected"] == undefined) {
    var getNavBtn = getComponents("navBtnConnect.html");
    var getMenuBtn = getComponents("menuBtnConnect.html");
} else {
    var getNavBtn = getComponents("navConnect.html");
    var getMenuBtn = getComponents("menuConnect.html");
}

const constructNav = Promise.all([getNav, getNavBtn, getMenuBtn]);
constructNav
    .then((htmls) => {
        window.addEventListener('load', () => {
            document.getElementsByTagName("nav")[0].innerHTML = htmls[0];
            document.getElementById("divCoteNavD").innerHTML += htmls[1];
            document.getElementById("divMenu").innerHTML += htmls[2];
        });
    })
    .catch((err) => {
        console.log(err);
    });