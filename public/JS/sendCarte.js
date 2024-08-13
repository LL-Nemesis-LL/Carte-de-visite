function sendCarte() {
    let data = getValueInput(".inputCarte");

    sendRequest("addcard", "application/json", data)
        .then(response => response.json())
        .then((message) => {
            if (message["result"] == true) {
                window.location.href = "monespace.html";
            } else {
                console.log(message);
            }
        })
}