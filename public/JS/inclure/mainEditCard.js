getPublic(["ajoutCarte.css"], ["card.js", "request.js"])
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