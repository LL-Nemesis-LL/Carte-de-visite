getPublic(["showCarte.css"], ["request.js", "card.js"])
    .then(() => {
        window.addEventListener("load", () => {
            getCards();
        })

    })