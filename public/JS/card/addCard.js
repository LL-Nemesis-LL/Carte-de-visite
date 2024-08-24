css = ["ajoutCarte.css"];
script = ["animAjoutCarte.js", "card.js", "request.js"];
getPublic(css, script);
window.addEventListener("load", () => {
    document.getElementById("formAjoutCarte").addEventListener("submit", (event) => {
        event.preventDefault();
        let data = getValueForm("formAjoutCarte", true);
        console.log(data);
        sendRequest("addCard", data, "").then((response) => {
            console.log(response);
        })
    });
})