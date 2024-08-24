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
            } else {
                return response;
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

function getValueForm(idForm, returnFormData = false) {
    let form = document.getElementById(idForm);
    let formData = new FormData(form);
    if (returnFormData) {
        return formData;
    }
    let elements = Array.from(formData);
    let data = {};
    for (element of elements) {
        data[element[0]] = element[1];
    }
    return data;
}
async function readerStream(reader) {
    let newBuffer = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            return new Uint8Array(newBuffer);
        }
        newBuffer = newBuffer.concat(Array.from(value));
    }

}

function splitBinarie(binarieArray, asciiArray, keyWord) {
    /*
        Cette fonction nous permet de traité une response
        serveur contenant plusieurs fichiers de type différent.

        Chaque début de fichiers est spéifié par un mot clé
        et contiennent tous un header Content-Type.

        Exemple:
        --frame\r\n
        Content-Type: image/jpg\r\n
        

        en paramètre on à la réponse de la requête au format
        binaire, au format ascii ou le mot clé nous
        permettant de séquences les fichiers.
    */

    let contentType = "Content-Type: "
    let lengthKeyWord = keyWord.length;

    // on separe par le mot clé qui définit chaque début d'un fichier
    let framesAscii = asciiArray.split(keyWord);
    framesAscii = framesAscii.slice(1);
    let framesBinarie = [];
    let startIndexBinarie = 0;

    for (let i = 0; i < framesAscii.length; i++) {
        let frameBinarie = { contentType: "", binarie: "" };
        let lengthFrameAscii = framesAscii[i].length;

        //on se place au début des données du fichier
        let startIndexFrameBinarie = framesAscii[i].indexOf("\r\n\r\n") + 4;
        startIndexBinarie += startIndexFrameBinarie + keyWord.length;

        //on récupère le Content-Type
        frameBinarie["contentType"] = framesAscii[i].slice(contentType.length, startIndexFrameBinarie - 4);

        //on détermine la longeur du fichier éliminant les headers
        let lengthFrameBinarie = lengthFrameAscii - startIndexFrameBinarie;

        //on récupère la séquence des données du fichier
        let binarie = binarieArray.slice(startIndexBinarie, startIndexBinarie + lengthFrameBinarie);

        //on le stock dans un tableau d'octet
        let newBuffer = new Uint8Array(binarie);
        frameBinarie["binarie"] = newBuffer;
        framesBinarie.push(frameBinarie);

        startIndexBinarie += lengthFrameBinarie;

    }
    return framesBinarie;
}