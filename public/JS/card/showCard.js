function addImgCardInCard(images, card, indexCards) {
    console.log(images);
    let indexImages = indexCards * 2;
    console.log(indexImages);
    let urlImageProfil = images[indexImages];
    indexImages++;
    let urlImageCompany = images[indexImages];
    card.querySelector(".profilPicture").src = urlImageProfil;
    card.querySelector(".companyLogo").src = urlImageCompany;
    return card;
}

function addInfosCardInTemplate(cardInfos, templateId, typeElement, attribute, elementDest = false) {

    let template = document.getElementById(templateId);
    let clone = document.importNode(template.content, true);
    let card = cardInfos;
    for (key of Object.keys(card)) {
        if (attribute == "value") {
            clone.querySelector(typeElement + key).value = card[key];
        }
        if (attribute == "innerText") {
            clone.querySelector(typeElement + key).innerText = card[key];
        }
    }
    if (elementDest === false) {
        return clone;
    }
    document.querySelector(elementDest).append(clone);
}

function getInfosSpan(spans) {
    let infos = {}
    for (span of spans) {
        infos[span.className] = span.innerText;
    }
    return infos;
}
function putInfosCardHorizon(infos) {
    let cardHorizon = document.getElementById('cardHorizon');
    for (key of Object.keys(infos)) {
        cardHorizon.getElementsByClassName(key)[0].innerText = infos[key];
    }
}
function showHorizon(index) {
    document.getElementById("fondCardHorizon").style.display = "flex";
    let cards = document.getElementsByClassName("card");
    let spans = cards[index].querySelectorAll("span");
    let infosSpan = getInfosSpan(spans);
    putInfosCardHorizon(infosSpan);

}

function changeRotate() {
    let rotate = sessionStorage.getItem("rotateCard");
    let divCards = document.getElementById("divCards");
    divCards.innerHTML = "";
    if (rotate === "vertical") {
        rotate = "horizontal";
        var template = "templateCardHorizontal";
    } else {
        rotate = "vertical";
        var template = "templateCardVertical";
    }
    let cards = JSON.parse(sessionStorage.getItem("cards"));
    let images = JSON.parse(sessionStorage.getItem("images"));
    console.log(images)
    let indexCard = 0;
    for (card of cards) {
        let cloneTemplate = addInfosCardInTemplate(card, template, ".", "innerText");
        cloneTemplate = addImgCardInCard(images, cloneTemplate, indexCard);
        divCards.append(cloneTemplate);
        indexCard++;
    }
    sessionStorage.setItem("rotateCard", rotate);
}

getPublic(["showCarte.css"], ["main/request.js", "card/cardRequest.js"])
    .then(() => {

        window.addEventListener("load", () => {
            Promise.all([getCards(), getCardsImg()])
                .then(([cards, images]) => {
                    console.log(images);
                    sessionStorage.setItem("cards", JSON.stringify(cards));
                    sessionStorage.setItem("images", JSON.stringify(images));
                    sessionStorage.setItem("rotateCard", "vertical");
                    let divCards = document.querySelector("#divCards");
                    if (cards.length > 0) {
                        console.log(cards);
                        let indexCard = 0;
                        for (card of cards) {
                            let cloneTemplate = addInfosCardInTemplate(card, "templateCardVertical", ".", "innerText")
                            cloneTemplate = addImgCardInCard(images, cloneTemplate, indexCard);
                            cloneTemplate.querySelector(".delete").addEventListener("click", () => {
                                deleteCard(indexCard);
                            })
                            cloneTemplate.querySelector(".edit").addEventListener("click", () => {
                                editCard(indexCard);
                            })
                            divCards.appendChild(cloneTemplate);
                            indexCard++;
                        }
                        return;
                    } else {
                        divCards.append("Aucun résultat");
                        throw new Error("pas de carte");
                    }
                })
                .catch(err => console.log(err))


        })

    })


