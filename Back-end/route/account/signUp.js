const express = require('express');
const router = express.Router();
const myDB = require("../../DB");
const checkData = require("../../checkData/checkData");
const token = require("../../token/token");
const sha256 = require("js-sha256");


router.post('/signUp', (req, res) => {
    const data = req.body;
    const listdata = ["lastName", "firstName", "email", "password"];
    let retourFrontEnd = {};
    checkData.checkExistKeyDict(listdata, data)
        .then(valueSql => {
            console.log(valueSql);
            // Hash et rajoute un sel au mot de passe
            valueSql[3] = sha256(process.env.salt + valueSql[3]);

            // Génère un token et Capture l'heure actuelle
            let myToken = token.generate();
            let time = token.timeNowInMinutes()
            valueSql.push(myToken, time);

            // Requête sql insert un nouvel utilisateur
            return Promise.all([
                myToken,
                myDB.insUpdDelSql(
                    "INSERT INTO users(lastName, firstName, email, password, token, time) VALUES(?, ?, ?, ?, ?, ?)",
                    valueSql)
            ]);
        })
        .then(([myToken, result]) => {
            retourFrontEnd["result"] = true;
            res.cookie("token", myToken, { maxAge: process.env.msTimeTokenRevoke, secure: true, httpOnly: true, sameSite: 'strict' });
            res.cookie("connected", true, { maxAge: process.env.msTimeTokenRevoke, secure: true, sameSite: 'strict' });
        })
        .catch((erreur) => {
            console.log(erreur);
            retourFrontEnd["result"] = false;
            retourFrontEnd["message"] = erreur.message;
        })
        .finally(() => {
            res.send(JSON.stringify(retourFrontEnd));
        });
});

module.exports = router;