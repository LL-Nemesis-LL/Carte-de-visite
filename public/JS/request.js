var host = location.hostname + ":3003/";
var allowOrigin = "http://127.0.0.1:3000";
var allowHeaders = "*";
var allowCredentials = "true";
var fetchCredenials = "include";

function sendRequest(route, contentType, data) {
    let myHeader = new Headers();
    myHeader.append("Content-Type", contentType);
    myHeader.append("Access-Control-Allow-Origin", allowOrigin);
    myHeader.append("Access-Control-Allow-Headers", allowHeaders);
    myHeader.append("Access-Control-Allow-Credentials", allowCredentials);
    const myRequest = new Request("http://" + host + route, {
        method: "POST",
        headers: myHeader,
        body: JSON.stringify(data),
        credentials: fetchCredenials,
    });
    return fetch(myRequest);
}

function getRequest(nom, contentType) {

    let myHeader = new Headers();
    myHeader.append("Accept", contentType);
    myHeader.append("Access-Control-Allow-Origin", allowOrigin);
    myHeader.append("Access-Control-Allow-Headers", allowHeaders);
    myHeader.append("Access-Control-Allow-Credentials", allowCredentials);

    let myRequest = new Request("http://" + host + nom, {
        method: "GET",
        headers: myHeader,
        credentials: fetchCredenials
    });

    return fetch(myRequest);
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