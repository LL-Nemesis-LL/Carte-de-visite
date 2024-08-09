async function sendRequest(route, contentType, data) {
    console.log(data);
    let host = location.hostname;
    let myHeader = new Headers();
    myHeader.append("Content-Type", contentType);
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

async function getInfos(nom, contentType) {
    let hote = location.host;

    let myHeader = new Headers();
    myHeader.append("Accept", contentType);
    myHeader.append("Access-Control-Allow-Origin", "*");
    myHeader.append("Access-Control-Allow-Headers", "*");

    let myRequest = new Request("http://" + hote + "/" + nom, {
        method: "GET",
        headers: myHeader,
        mode: "no-cors",
    });

    let response = await fetch(myRequest);
    return response;
}

function getValueInput(indicateur) {
    let tabInscription = {};
    let input = document.querySelectorAll(indicateur);
    for (element of input) {
        console.log(element.value);
        tabInscription[element.id] = element.value
    }
    return tabInscription;
}