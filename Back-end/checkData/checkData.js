const maxLengthPassword = 100;
const minLengthPassword = 8;
const maxLengthName = 100;

function removeKeyDict(dict, keys) {
    tempDict = {};
    for (keyDict of Object.keys(dict)) {
        let copy = true;
        for (keyList of keys) {
            if (keyDict == keyList) {
                copy = false;
                break;
            }
        }
        if (copy) {
            tempDict[keyDict] = dict[keyDict];
        }
    }
    return tempDict;
}

function removeData(dict, keys, rows = false) {
    if (rows === false) {
        return removeKeyDict(dict, keys)
    } else {
        tempList = [];
        for (row of dict) {
            tempList.push(removeKeyDict(row, keys));
        }
        return tempList;
    }
}

function checkFileFieldName(fieldNames, files) {
    const promesse = (resolve, reject) => {
        let listFiles = [];
        for (fieldName of fieldNames) {
            for (file of files) {
                if (file.fieldname == fieldName) {
                    listFiles.push(file);
                    break;
                }
            }
        }
        if (listFiles.length != fieldNames.length) {
            reject(new Error("fieldName manquant"));
        } else {
            resolve(listFiles);
        }

    }
    return new Promise(promesse);

}

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
                reject(new Error("clé erreur"));
            }
            switch (element) {
                case "email":
                    var sanityValue = returnAValidEmail(dict[element]);
                    if (!sanityValue) {
                        reject(new Error("email incorrect"));
                    }
                    break;
                case "password":
                    var sanityValue = checkPasswordValidity(dict[element]);
                    if (!sanityValue) {
                        reject(new Error("mot de passe incorrect"));
                    }
                    break;
                default:
                    var sanityValue = checkNamevalidity(dict[element]);
                    if (!sanityValue) {
                        reject(new Error("name incorrect"));
                    }

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
    checkExistKeyDict, checkFileFieldName, removeData
};
