function getValueInput(indicateur) {
    let tabInscription = {};
    let input = document.querySelectorAll(indicateur);
    for (element of input) {
        console.log(element.value);
        tabInscription[element.id] = element.value
    }
    return tabInscription;
}

async function sendRequest(route, contentType, data) {
    console.log(data);
    let host = location.hostname;
    let myHeader = new Headers();
    myHeader.append("Content-Type", "application/json");
    myHeader.append("Access-Control-Allow-Origin", "*");
    myHeader.append("Access-Control-Allow-Headers", "*")
    const myRequest = new Request("http://" + host + ":3003/" + route, {
        method: "POST",
        headers: myHeader,
        body: JSON.stringify(data)
    });
    const response = await fetch(myRequest);
    return response;
}

function sendInscription() {
    let data = getValueInput("input");
    sendRequest("inscription", "application/json", data);
}

function sendConnexion() {
    let data = getValueInput("input");
    sendRequest("seconnecter", "application/json", data);
}