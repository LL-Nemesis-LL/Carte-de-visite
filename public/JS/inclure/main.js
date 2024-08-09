function getLogo() {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = "public/assets/CTM.ico";
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
    }
    return new Promise(promesse);
}

let css = ["fontGoogle.css", "main.css"];
let script = ["redirect.js"];

let getNav = getComponents("nav.html")
    .then(response => response.text());
getPublic(css, script);