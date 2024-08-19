css = ["ajoutCarte.css"];
script = ["animAjoutCarte.js", "card.js", "request.js"];
getPublic(css, script);
window.addEventListener("load", () => {
    document.getElementById("formAjoutCarte").addEventListener("submit", (event) => {
        event.preventDefault();
        let data = getValueForm("formAjoutCarte");
        sendRequest("addcard", JSON.stringify(data));
        let companyLogo = document.getElementById("companyLogo").files[0];
        console.log(companyLogo);
        if (companyLogo != undefined) {
            sendRequest("uploadCompanyLogo", companyLogo, "");
        }

        let profilePicture = document.getElementById("profilePicture").files[0];
        console.log(profilePicture);
        if (profilePicture != undefined) {
            sendRequest("uploadProfilePicture", profilePicture, "");
        }

    });
})