function menuCompteClose() {
    let menu = document.getElementById("menuCompte").style;
    menu.right = "-190px";

    let divFond = document.getElementById("divFond").style;
    divFond.opacity = "0";
    setTimeout(() => {
        divFond.display = "none";
    }, 800);
}

function menuCompteOpen() {
    let menu = document.getElementById("menuCompte").style;
    menu.right = "10px";

    let divFond = document.getElementById("divFond").style;

    divFond.display = "block";
    divFond.opacity = "0.5";
}