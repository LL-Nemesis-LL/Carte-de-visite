getPublic(["ajoutCarte.css"], ["card/cardRequest.js", "main/request.js"])
    .then(() => {
        window.addEventListener("load", () => {
            let paramUrl = getParamUrl();
            if (paramUrl["id"] != undefined) {
                getCard(paramUrl["id"]);
            } else {
                console.log("pas de id");
            }
        });

    })