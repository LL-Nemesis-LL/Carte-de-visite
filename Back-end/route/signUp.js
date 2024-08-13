const express = require('express');
const router = express.Router();
const myDB = require("../DB");
const checkData = require("../checkData/checkData");
const token = require("../token/token");
const sha256 = require("js-sha256");


router.post('/signUp', (req, res) => {
    const data = req.body;
    const listdata = ["lastName", "firstName", "email", "password"];
    let valueSql = checkData.checkExistKeyDict(listdata, data);
    if (!valueSql) {
        res.send(JSON.stringify({ "message": "erreur" }));
    }

    // Hash et rajoute un sel au mot de passe
    valueSql[3] = sha256(process.env.salt + valueSql[3]);

    // Génère un token
    let myToken = token.generate()
    valueSql.push(myToken);
    // Capture l'heure actuelle
    valueSql.push(token.timeNow());


    let retourFrontEnd = {};

    // Requête sql insert un nouvel utilisateur
    let resultRequete = myDB.insUpdSql(
        "INSERT INTO users(lastName, firstName, email, password, token, time) VALUES(?, ?, ?, ?, ?, ?)",
        valueSql
    );

    resultRequete
        .then((result) => {
            retourFrontEnd["message"] = true;
            res.cookie("token", myToken, { maxAge: process.env.msTimeCookie, secure: true, httpOnly: true, sameSite: 'strict' });
            res.cookie("connected", true, { maxAge: process.env.msTimeCookie, secure: true, sameSite: 'strict' });
        })
        .catch((erreur) => {
            console.log(erreur)
            if (erreur.errno === 1062) {
                retourFrontEnd["message"] = "E-mail déjà utilisé";
            }
        })
        .finally(() => {
            res.send(JSON.stringify(retourFrontEnd));
        })
});

module.exports = router;