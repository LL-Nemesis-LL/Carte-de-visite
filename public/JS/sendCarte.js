function sendCarte() {
    let data = getValueInput(".input");
    sendRequest("ajoutcarte", "application/json", data)
        .then(response => response.json())
        .then((data) => {

        })
}