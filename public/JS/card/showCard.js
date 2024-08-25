getPublic(["showCarte.css"], ["main/request.js", "card/cardRequest.js"])
    .then(() => {

        window.addEventListener("load", () => {
            getCards().then(() => {
                getCardsImg();
            })


        })

    })


