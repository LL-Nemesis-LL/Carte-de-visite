const express = require('express');
const router = express.Router();
const myDB = require("../DB");
const checkData = require("../checkData/checkData");
const token = require("../token/token");
const sha256 = require("js-sha256");


router.post("/signin", (req, res) => {
    console.log(req.body);
    /*
        Réalise de manière asynchrone les vérifications et
        l'attribution d'un token pour l'utilisateur. 
    */
    const data = req.body;
    const listdata = ["email", "password"];

    let valueSql = checkData.checkExistKeyDict(listdata, data);
    if (!valueSql) {
        res.send(JSON.stringify({ "message": "erreur" }));
        return;
    }

    let retourFrontEnd = {};

    // Requête sql SELECT password de l'utilisateur
    let catchPassword = myDB.selSql(
        "SELECT password FROM users WHERE email=?",
        [valueSql[0]]
    );
    catchPassword
        .then((result) => {
            // Vérifie s'ils correspondent
            if (result["password"] != undefined) {
                if (sha256(process.env.salt + valueSql[1]) == result["password"]) {
                    // Génère un token
                    let myToken = token.generate();
                    return myToken;

                } else {
                    retourFrontEnd["message"] = "mauvais mot_de_passe";
                    throw new Error(2);
                }
            } else {
                retourFrontEnd["message"] = "E-mail pas enregistrer";
                throw new Error(1)
            }

        })
        .then((myToken) => {
            //Capture l'heure actuelle
            let time = token.timeNow();

            // Requête SQL UPDATE pour changer le token enregistrer en DB et l'heure de création du token
            myDB.insUpdSql("Update users set token=?, time=? WHERE email=?", [myToken, time, valueSql[0]])
                .then((result) => {
                    console.log(result);
                    res.cookie("token", myToken, { maxAge: process.env.msTimeCookie, secure: true, httpOnly: true, sameSite: 'strict' });
                    res.cookie("connected", true, { maxAge: process.env.msTimeCookie, secure: true, sameSite: 'strict' });
                    retourFrontEnd["message"] = true;
                })
                .catch(err => console.log(err))
                .finally(() => {
                    res.send(JSON.stringify(retourFrontEnd));
                })

        })
        .catch((erreur) => {

            if (erreur > 0 && erreur < errTab.length) {
                console.log(errTab[erreur]);
            } else {
                console.log("erreur inconnue : " + erreur);
            }
            res.send(JSON.stringify(retourFrontEnd));
        })
});

module.exports = router;