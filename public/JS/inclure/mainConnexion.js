function sendInscription() {
    let data = getValueInput("input");
    sendRequest("signup", "application/json", data)
        .then(response => response.json())
        .then(data => {
            if (data["message"] == true) {
                window.location.href = "monespace.html";
            } else {
                document.getElementById("message").innerText = data["message"]
            }
        })
}

function sendConnexion() {
    let data = getValueInput("input");
    sendRequest("signin", "application/json", data)
        .then(response => response.json())
        .then(data => {
            if (data["message"] == true) {
                window.location.href = "monespace.html";
            } else {
                document.getElementById("message").innerText = data["message"]
            }
        })
}

getPublic([], ["request.js"]);
