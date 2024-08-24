const express = require('express');
const router = express.Router();
const myDB = require("../../DB");
const checkData = require("../../checkData/checkData");
const token = require("../../token/token");
const sha256 = require("js-sha256");


router.post("/signin", (req, res) => {
    /*
        Réalise de manière asynchrone les vérifications et
        l'attribution d'un token pour l'utilisateur. 
    */
    const data = req.body;
    const listdata = ["email", "password"];
    let retourFrontEnd = {};
    checkData.checkExistKeyDict(listdata, data)
        .then((valueSql) => {
            // Requête sql SELECT password de l'utilisateur
            return Promise.all([
                valueSql,
                myDB.selSql("SELECT password FROM users WHERE email=?", [valueSql[0]])
            ]);
        })
        .then(([valueSql, result]) => {
            // Vérifie s'ils correspondent

            if (result["password"] != undefined) {
                if (sha256(process.env.salt + valueSql[1]) == result["password"]) {
                    // Génère un token
                    return valueSql;

                } else {
                    throw new Error("Mauvais mot de passe");
                }
            } else {
                throw new Error("E-mail pas enregistré");
            }
        })
        .then((valueSql) => {
            // Génère un token et Capture l'heure actuelle
            let myToken = token.generate();
            let time = token.timeNow();

            // Requête SQL UPDATE pour changer le token enregistrer en DB et l'heure de création du token
            return Promise.all([
                myToken,
                myDB.insUpdDelSql("Update users set token=?, time=? WHERE email=?", [myToken, time, valueSql[0]])
            ]);
        })
        .then(([myToken, result]) => {
            // Création des cookies de connexion
            res.cookie("token", myToken, { maxAge: process.env.msTimeCookie, secure: true, httpOnly: true, sameSite: 'strict' });
            res.cookie("connected", true, { maxAge: process.env.msTimeCookie, secure: true, sameSite: 'strict' });
            retourFrontEnd["result"] = true;
        })
        .catch((erreur) => {
            retourFrontEnd["result"] = false;
            retourFrontEnd["message"] = erreur.message;
        })
        .finally(() => {
            res.send(JSON.stringify(retourFrontEnd))
        });
});

module.exports = router;