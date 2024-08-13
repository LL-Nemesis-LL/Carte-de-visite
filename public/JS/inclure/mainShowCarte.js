getPublic(["showCarte.css"], ["request.js", "getCards.js"])
    .then(() => {
        window.addEventListener("load", () => {
            getCards()
                .then(message => {
                    if (message["result"]) {
                        let template = document.getElementById("templateCard");
                        let main = document.querySelector(".divCards");
                        console.log(message["cards"])
                        for (card of message["cards"]) {
                            let cloneTemplate = document.importNode(template.content, true);
                            for (info of Object.keys(card)) {
                                console.log(info);
                                if (!(info == "id" || info == "idUser")) {
                                    cloneTemplate.querySelector("." + info).textContent = card[info];
                                }

                            }
                            main.appendChild(cloneTemplate);
                        }
                    }
                })
                .catch(err => console.log(err));
        })

    })