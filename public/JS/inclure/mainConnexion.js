function sendInscription() {
    let data = getValueForm("formSignup")
    sendRequest("signup", "application/json", data)
        .then(data => {
            if (data["result"] == true) {
                window.location.href = "monespace.html";
            } else {
                document.getElementById("message").innerText = data["message"]
            }
        })
}

function sendConnexion() {
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

window.addEventListener("load", () => {
    document.getElementById("formSignup").addEventListener("submit", (event) => {
        event.preventDefault();
        let data = getValueForm("formSignup");
    })

});

getPublic([], ["request.js"]);

window.addEventListener("load", () => {

    document.getElementById("formSignin").addEventListener('submit', (event) => {
        event.preventDefault();
        sendConnexion();
    });
});
