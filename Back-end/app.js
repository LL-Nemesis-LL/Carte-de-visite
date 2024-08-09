mysql = require('mysql2/promise');
const port = 3003;
const host = "127.0.0.1";
const express = require("express");
const cors = require("cors");
const cookie = require("cookie-parser")
const sha256 = require('js-sha256');
const crypto = require("crypto");
const app = express();
const salt = "iYEhs_92b'7O2";
const errTab = ["pas de base de données", "pas de mot de passe", "mauvais mot de passe"]

app.use(express.json());
app.use(cors());
app.use(cookie());



function generateSecureToken() {
    // Génère un token de 32 bytes convertie en hexadécimal
    return crypto.randomBytes(32).toString('hex');
}



function verifyExistKeyDict(keys, dict) {
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
            return false;
        }

        listValue.push(dict[element]);
        i++;
    }

    return listValue;
}

function verifyTokenConnecting(token) {
    let promesseSql = requeteSql("SELECT * FROM utilisateurs WHERE token = ?", [token]);
}


function timeNow() {
    let tempsNow = new Date();
    let tempsString = new Date();
    return tempsString.toISOString(tempsNow.getTime());
}



function requeteSql(requetePrepared, valueSql) {
    /*
        Prends en argument une requête SQL préparé et 
        sa liste d'argument à insérer.

        Renvoit une promesse.
    */
    const promesseSQL = function (resolve, reject) {
        try {
            const myDB = mysql.createConnection({
                host: 'localhost',
                user: 'my_card',
                password: 'm_7H_Be&uNz54A',
                database: 'my_card'
            });

            const [rows, fields] = myDB.execute(
                requetePrepared,
                valueSql);

            resolve([rows, fields]);

        } catch (err) {
            reject(err);
        }
        return;
    };
    return new Promise(promesseSQL);
}



app.post('/inscription', (req, res) => {
    const data = req.body;
    const listdata = ["nom", "prenom", "email", "password"];
    let valueSql = verifyExistKeyDict(listdata, data);
    if (valueSql == 0) {
        res.send(JSON.stringify({ "message": "erreur" }));
    }

    // Hash et rajoute un sel au mot de passe
    valueSql[3] = sha256(salt + valueSql[3]);

    // Génère un token
    let token = generateSecureToken()
    valueSql.push(token);
    // Capture l'heure actuelle
    let tempsNow = new Date();
    let tempsString = new Date();
    valueSql.push(tempsString.toISOString(tempsNow.getTime()));

    let retourFrontEnd = {};

    // Requête sql insert un nouvel utilisateur
    let resultRequete = requeteSql(
        "INSERT INTO utilisateurs(nom, prenom, email, password, token, time) VALUES(?, ?, ?, ?, ?, ?)",
        valueSql
    );

    resultRequete
        .then((result) => {
            console.log(result);
            retourFrontEnd["message"] = "true";
            res.cookie("token", token, { maxAge: 900000, httpOnly: true, secure: true });
        })
        .catch((erreur) => {
            console.log(erreur);
            retourFrontEnd["message"] = false;
        })
        .finally(() => {
            res.send(JSON.stringify(retourFrontEnd));
        })
});


app.post("/seconnecter", (req, res) => {
    /*
        Réalise de manière asynchrone les vérifications et
        l'attribution d'un token pour l'utilisateur. 
    */
    const listdata = ["email", "password"];

    let valueSql = verifyExistKeyDict(listdata, data);
    if (valueSql === 0) {
        res.send(JSON.stringify({ "message": "erreur" }));
    }

    let retourFrontEnd = {};

    // Requête sql SELECT password de l'utilisateur
    let catchPassword = requeteSql(
        "SELECT password FROM utilisateurs WHERE email=?",
        [valueSql[0]]
    );
    catchPassword
        .then((rows) => {
            let result = rows[0][0];

            // Vérifie qu'il existe
            if (result["password"].length > 0) {

                // Vérifie s'ils correspondent
                if (sha256(salt + valueSql[1]) == result["password"]) {

                    retourFrontEnd["message"] = true;

                    // Génère un token
                    let token = generateSecureToken();
                    res.cookie("token", token, { maxAge: 60, httpOnly: true, secure: true });
                    return token;

                } else {
                    retourFrontEnd["message"] = "mauvais mot_de_passe";
                    throw new Error(2);
                }
            }
            else {
                retourFrontEnd["message"] = "pas de mot_de_passe";
                throw new Error(1);
            }
        })
        .then((token) => {
            //Capture l'heure actuelle
            let time = timeNow();

            // Requête SQL UPDATE pour changer le token enregistrer en DB et l'heure de création du token
            try {
                const myDB = mysql.createConnection({
                    host: 'localhost',
                    user: 'my_card',
                    password: 'm_7H_Be&uNz54A',
                    database: 'my_card'
                });

                const [rows, fields] = myDB.execute(
                    "Update set token=?, time=? FROM utilisateurs WHERE email=?",
                    [token, time, valueSql[0]]);

                console.log([rows, fields]);

            } catch (err) {
                console.log(err);
                throw new Error(0);
            }
        })
        .catch((erreur) => {
            if (erreur > 0 && erreur < errTab.length) {
                console.log(errTab[erreur]);
            } else {
                console.log("erreur inconnue : " + erreur);
            }
        })
        .finally(() => {
            res.send(JSON.stringify(retourFrontEnd));
        })
});

app.post("/ajoutcarte", (req, res) => {
    const data = req.body;
    const listdata = ["nomPoste", "email", "numeroRue", "nomQuartier", "codePostal", "telephone"];

    let valueSql = verifyExistKeyDict(listdata, data);
    if (valueSql === 0) {
        res.send(JSON.stringify({ "message": "erreur" }));
    }

    let retourFrontEnd = {};

    let insertCarte = requeteSql("INSERT INTO carteDeVisite()")

});



app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});