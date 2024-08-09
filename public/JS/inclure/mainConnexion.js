function sendInscription() {
    let data = getValueInput("input");
    sendRequest("inscription", "application/json", data);
}

function sendConnexion() {
    let data = getValueInput("input");
    sendRequest("seconnecter", "application/json", data);
}

async function getNavBtnConnect() {
    let response = await getComponents("navBtnConnect.html", "html/text");
    response.text()
        .then(html => {
            document.getElementById("divContentNav").innerHTML += html;
        });
}
getPublic([], ["mainRequest.js"]);
getNavBtnConnect();