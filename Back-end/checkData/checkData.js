function checkExistKeyDict(keys, dict) {
    /*
        Prends en argument une liste de clé 
        à récupérer dans un dictionnaire,
        pour ensuite créer une liste contenant les valeurs
        du dictionnaire dans l'ordre rechercher.

        Vérifie également que toutes les clé recherches soient
        présentent sinon il renvoit false.
    */
    let listValue = [];

    let i = 0;
    for (element of keys) {
        if (dict[element] === undefined) {
            console.log("pas les " + element + " demandés\ncontenue du body : " + JSON.stringify(dict));
            return false;
        }

        listValue.push(dict[element]);
        i++;
    }

    return listValue;
}

module.exports = {
    checkExistKeyDict
}
