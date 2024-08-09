let navConnect = getComponents("navConnect.html")
    .then(response => response.text())
    .then((html) => {
        getNav.then(htmlNav => {
            window.addEventListener('load', () => {
                document.getElementsByTagName("nav")[0].innerHTML = htmlNav;
                document.getElementById("divContentNav").innerHTML += html;
                document.getElementById("menuCompte").addEventListener("mouseleave", menuCompteClose);
                window.addEventListener("scroll", menuCompteClose);
            });
        });
    })
    .catch((err) => {
        console.log(err);
    });
getPublic([], ["animNav.js"]);

