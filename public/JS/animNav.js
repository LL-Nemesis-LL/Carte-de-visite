function menuCompteClose() {
    let menu = document.getElementById("divMenu").style;
    menu.left = "-220px";
    let divFond = document.getElementById("divFond").style;
    divFond.opacity = "0";
    setTimeout(() => {
        divFond.display = "none";
    }, 800);
}

function menuCompteOpen() {
    let menu = document.getElementById("divMenu").style;
    menu.left = "10px";

    let divFond = document.getElementById("divFond").style;

    divFond.display = "block";
    divFond.opacity = "0.5";
}