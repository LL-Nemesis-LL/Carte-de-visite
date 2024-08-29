css = ["ajoutCarte.css"];
script = ["card/animAddCard.js", "card/cardRequest.js", "main/request.js"];
getPublic(css, script);
window.addEventListener("load", () => {
    document.getElementById("formAjoutCarte").addEventListener("submit", (event) => {
        event.preventDefault();
        let data = getValueForm("formAjoutCarte", true);
        console.log(data);
        sendRequest("addCard", data, "").then((response) => {
            if (response["result"] == true) {
                window.location.href = "mescartes.html";
            } else {
                console.log("une erreur est survenue");
            }
        });
    });
})