function sendCard() {
    let data = getValueInput(".inputCarte");

    sendRequest("addcard", "application/json", data)
        .then((message) => {
            if (message["result"] == true) {
                window.location.href = "monespace.html";
            } else {
                console.log(message);
            }
        })
}

function sendCardImg() {
    let acceptType = "application/json";
    files = document.querySelector('input[name~="companyLogo"]').files[0];
    form = new FormData();
    form.append("image", files);
    let myHeader = new Headers();
    myHeader.append("Accept", acceptType);
    myHeader.append("Access-Control-Allow-Origin", allowOrigin);
    myHeader.append("Access-Control-Allow-Headers", allowHeaders);
    myHeader.append("Access-Control-Allow-Credentials", allowCredentials);
    const myRequest = new Request("http://" + host + "upload", {
        method: "POST",
        headers: myHeader,
        body: form,
        credentials: fetchCredenials,
    });
    return fetch(myRequest)
        .then(response => {
            if (listAcceptType[0] == acceptType) {
                return response.text();
            } else if (listAcceptType[1] == acceptType) {
                return response.json();
            }
        });
}

function getCards() {
    getRequest("getCards", "application/json")
        .then(message => {
            if (message["result"]) {
                let main = document.querySelector(".divCards");
                if (message["cards"].length > 0) {
                    for (card of message["cards"]) {
                        let cloneTemplate = addCardInTemplate(card, "templateCard", ".", "innerText")
                        cloneTemplate.querySelector(".delete").addEventListener("click", () => {
                            deleteCard(card["id"]);
                        })
                        cloneTemplate.querySelector(".edit").addEventListener("click", () => {
                            editCard(card["id"]);
                        })
                        main.appendChild(cloneTemplate);
                    }
                } else {
                    main.append("Aucun résultat");
                }

            }
        })
        .catch(err => console.log(err));
}

function deleteCard(idCard) {
    const data = { "id": idCard };
    let request = sendRequest("delCard", "application/json", data)
        .then((message) => {
            if (message["result"] == true) {
                window.location.reload();
            } else {
                console.log("erreur");
            }
        })
}

function getCard(id) {
    const data = { "id": id };
    sendRequest("getCard", "application/json", data)
        .then((message) => {
            if (message["result"] == true) {
                addCardInTemplate(message["card"], "editCard", "#", "value", "main");
            }
        })
        .catch(err => console.log(err));
}

function sendEditCard() {
    const data = getValueInput(".inputCarte");
    let paramUrl = getParamUrl();
    data["id"] = paramUrl["id"];
    sendRequest("editCard", "application/json", data)
        .then(message => {
            if (message["result"] == true) {
                window.location.href = "/monespace.html";
            }
        })
}

function editCard(id) {
    window.location.href = "modifCarte.html?id=" + id;
}

function addCardInTemplate(cardInfos, templateId, typeElement, attribute, elementDest = false) {

    let template = document.getElementById(templateId);
    let clone = document.importNode(template.content, true);
    let card = cardInfos;
    for (key of Object.keys(card)) {
        if (!(key == "id" || key == "idUser")) {
            if (attribute == "value") {
                clone.querySelector(typeElement + key).value = card[key];
            }
            if (attribute == "innerText") {
                clone.querySelector(typeElement + key).innerText = card[key];
            }
        }
    }
    if (elementDest === false) {
        return clone;
    }
    document.querySelector(elementDest).append(clone);
}