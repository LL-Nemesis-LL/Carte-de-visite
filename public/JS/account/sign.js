function sendInscription(event) {
    event.preventDefault();
    let data = getValueForm("formSignup")
    sendRequest("signup", JSON.stringify(data))
        .then(data => {
            if (data["result"] == true) {
                window.location.href = "monespace.html";
            } else {
                document.getElementById("message").innerText = data["message"]
            }
        })
}

function sendConnexion(event) {
    event.preventDefault();
    let data = getValueForm("formSignin");
    sendRequest("signin", JSON.stringify(data))
        .then(data => {
            if (data["result"] == true) {
                window.location.href = "monespace.html";
            } else {
                document.getElementById("message").innerText = data["message"]
            }
        })
}


getPublic([], ["main/request.js"]);


window.addEventListener("load", () => {
    let formSingup = document.getElementById("formSignup");
    let formSignin = document.getElementById("formSignin");
    if (formSingup != undefined) {
        formSignup.addEventListener("submit", sendInscription)
    }
    if (formSignin != undefined) {
        formSignin.addEventListener("submit", sendConnexion)
    }
});