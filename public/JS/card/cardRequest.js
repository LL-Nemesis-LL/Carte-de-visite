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
    return getRequest("getCards", "application/json")
        .then(message => {
            if (message["result"] === true) {
                return message["cards"];
            } else {
                throw new Error("resultat get cards faux");
            }
        })
        .catch(err => console.log(err));
}

function getCardsImg() {
    return getRequest("getCardsImg", "multipart/x-mixed-replace; boundary=frame")
        .then((response) => {
            return response.body.getReader();
        })
        .then((reader) => {
            return readerStream(reader)
        })
        .then(result => {
            let decoder = new TextDecoder('iso-8859-1');
            let resultDecodeAscii = decoder.decode(result);
            let framesBinarie = splitBinarie(result, resultDecodeAscii, "--frame\r\n");
            return framesBinarie;
        })
        .then((frames) => {
            let urlImages = [];
            for (image of frames) {
                let blobUrl = new Blob([image["binarie"]], { type: image["contentType"] });
                let urlImage = URL.createObjectURL(blobUrl);
                urlImages.push(urlImage);
            }
            return urlImages;
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
                addInfosCardInTemplate(message["card"], "editCard", "#", "value", "main");
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
