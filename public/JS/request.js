var host = location.hostname + ":3002/";
var allowOrigin = "http://127.0.0.1:3000";
var allowHeaders = "*";
var allowCredentials = "true";
var fetchCredenials = "include";
var listAcceptType = ["text/html", "application/json"];

function sendRequest(route, data, contentType = "application/json", acceptType = "application/json") {
    let myHeader = new Headers();
    if (contentType != "") {
        myHeader.append("Content-Type", contentType);
    }
    myHeader.append("Accept", acceptType);
    myHeader.append("Access-Control-Allow-Origin", allowOrigin);
    myHeader.append("Access-Control-Allow-Headers", allowHeaders);
    myHeader.append("Access-Control-Allow-Credentials", allowCredentials);
    const myRequest = new Request("http://" + host + route, {
        method: "POST",
        headers: myHeader,
        body: data,
        credentials: fetchCredenials,
    });
    return fetch(myRequest)
        .then(response => {
            // Le gestionnaire lève une erreur si la requête a échoué.
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            // Sinon, si la requête a réussi, le gestionnaire récupère
            // la réponse sous forme de texte en appelant response.text(),
            // Et renvoie immédiatement la promesse renvoyée par response.text().
            if (listAcceptType[0] == acceptType) {
                return response.text();
            } else if (listAcceptType[1] == acceptType) {
                return response.json();
            }
        });

}

function getRequest(nom, acceptType) {

    let myHeader = new Headers();
    myHeader.append("Accept", acceptType);
    myHeader.append("Access-Control-Allow-Origin", allowOrigin);
    myHeader.append("Access-Control-Allow-Headers", allowHeaders);
    myHeader.append("Access-Control-Allow-Credentials", allowCredentials);

    const myRequest = new Request("http://" + host + nom, {
        method: "GET",
        headers: myHeader,
        credentials: fetchCredenials
    });
    const fetchRequest = fetch(myRequest);
    const resultRequest = fetchRequest
        .then(response => {
            console.log(response.status);
            // Le gestionnaire lève une erreur si la requête a échoué.
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            // Sinon, si la requête a réussi, le gestionnaire récupère
            // la réponse sous forme de texte en appelant response.text(),
            // Et renvoie immédiatement la promesse renvoyée par response.text().
            if (listAcceptType[0] == acceptType) {
                return response.text();
            } else if (listAcceptType[1] == acceptType) {
                return response.json();
            }
        });
    return resultRequest;
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

function getValueForm(idForm) {
    let form = document.getElementById(idForm);
    let formData = new FormData(form);
    let elements = Array.from(formData);
    let data = {};
    for (element of elements) {
        data[element[0]] = element[1];
    }
    return data;

}