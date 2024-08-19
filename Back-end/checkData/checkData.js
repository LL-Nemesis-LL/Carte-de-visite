const maxLengthPassword = 100;
const minLengthPassword = 8;
const maxLengthName = 100;
function checkExistKeyDict(keys, dict) {
    /*
        Prends en argument une liste de clé 
        à récupérer dans un dictionnaire,
        pour ensuite créer une liste contenant les valeurs
        du dictionnaire dans l'ordre rechercher.

        Vérifie également que toutes les clé recherches soient
        présentent sinon il renvoit false.
    */
    const promesse = (resolve, reject) => {
        let listValue = [];
        for (element of keys) {
            if (dict[element] === undefined) {
                console.log("pas les " + element + " demandés\ncontenue du body : " + JSON.stringify(dict));
                reject("clé erreur");
            }
            if (dict[element] === "email") {

                var sanityValue = returnAValidEmail(dict[element]);
                if (!sanityValue) {
                    console.log("email incorrect");
                    reject("email incorrect");
                }
                continue;
            }
            if (dict[element] === "password") {
                var sanityValue = checkPasswordValidity(dict[element]);
                if (!sanityValue) {
                    console.log("mot de passe incorrect");
                    reject("mot de passe incorrect");
                }

            }
            var sanityValue = checkNamevalidity(dict[element]);
            if (!sanityValue) {
                console.log("name incorrect");
                reject("name incorrect");
            }
            listValue.push(sanityValue);
        }
        resolve(listValue);
    };


    return new Promise(promesse);
}

function checkPasswordValidity(password) {
    if (password.length > maxLengthPassword || password.length < minLengthPassword) {
        return false;
    }
    return password;
}

function checkNamevalidity(name) {
    if (name.length > maxLengthName || name.length == 0) {
        return false;
    }
    return name;
}

function returnAValidEmail(email) {
    email = email.toLowerCase();
    if (email.length > maxLengthName || email.length == 0) {
        return false;
    }
    return email;
}

module.exports = {
    checkExistKeyDict
};
