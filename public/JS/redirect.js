function redirectSeConnecter() {
    window.location.href = "seconnecter.html";
}
function redirectInscription() {
    window.location.href = "inscription.html";
}

function redirectMesCartes() {
    window.location.href = "mescartes.html";
}

function redirectAjoutCarte() {
    window.location.href = "ajoutcarte.html";
}
function redirectRechercheCarte() {
    window.location.href = "recherchecarte.html";
}

function redirectMonCompte() {
    window.location.href = "moncompte.html";
}
function redirectMySpace() {
    if (cookie["connected"] != undefined) {
        window.location.href = "monespace.html";
    } else {
        window.location.href = "/";
    }

}