css = ["ajoutCarte.css"];
script = ["card/animAddCard.js", "card/cardRequest.js", "main/request.js"];
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