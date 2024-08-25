function animLigneInput(lastIndex = false) {
    let input = document.querySelectorAll("input");
    let ligne = document.querySelectorAll(".ligne");
    if (lastIndex == true) {
        for (let i = 0; i < input.length - 1; i++) {
            ligne[i].classList.remove("ligneOrange");
        }
        ligne[input.length - 1].classList.add("ligneOrange");
        return;
    }

    for (let i = 0; i < input.length; i++) {
        if (input[i] == this) {
            ligne[i].classList.add("ligneOrange");
        } else {
            ligne[i].classList.remove("ligneOrange");
        }
    }
}

function removeReseau() {
    let divReseaux = document.getElementsByClassName("divReseau");
    let divReseauxMoins = document.getElementsByClassName("moins");
    console.log(divReseauxMoins.length);
    for (let i = 0; i < divReseaux.length; i++) {
        if (divReseauxMoins[i] == this) {
            divReseaux[i].remove();
            break;
        }
    }

}

function addReseau() {
    let plus = document.createElement("img");
    plus.src = "public/assets/plus.svg";
    plus.classList = "imgSvg plus";
    plus.addEventListener("click", addReseau);

    let input = document.createElement("input");
    input.placeholder = "Ajouter un réseau";
    input.type = "link";
    input.classList = "reseauSocial";
    input.addEventListener("click", animLigneInput)

    let reseau = document.createElement("div");
    reseau.classList = "flexRow";
    reseau.append(input, plus);

    let ligne = document.createElement("div");
    ligne.classList.add("ligne");

    let divReseau = document.createElement("div");
    divReseau.classList.add("divReseau");
    divReseau.append(reseau, ligne);

    /*
        Change la configuration des buttons addReseau()
        par removeReseau()
    */
    let divReseauxPlus = document.getElementsByClassName("imgSvg");
    lastIndex = divReseauxPlus.length - 1;
    divReseauxPlus[lastIndex].src = "public/assets/moins.svg";
    divReseauxPlus[lastIndex].classList = "imgSvg moins";
    divReseauxPlus[lastIndex].removeEventListener("click", addReseau);
    divReseauxPlus[lastIndex].addEventListener("click", removeReseau);

    let divResaux = document.getElementById("divReseaux");
    divResaux.appendChild(divReseau);
    input.focus();
    animLigneInput(true);

}

window.addEventListener("load", () => {
    let input = document.querySelectorAll("input");
    for (let i = 0; i < input.length; i++) {
        input[i].addEventListener("focus", animLigneInput);
    }
    let plus = document.getElementsByClassName("plus");
    for (let i = 0; i < plus.length; i++) {
        plus[i].addEventListener("click", addReseau);
    }

})