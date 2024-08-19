const express = require('express');
const router = express.Router();
const myDB = require("../../DB");
const token = require("../../token/token");

router.get("/getCards", (req, res) => {
    let retourFrontEnd = {};
    token.checkConnecting(req.cookies)
        .then(result => {
            return myDB.selSql("SELECT * FROM visitCards WHERE idUser=?", [result["id"]], allRows = true);
        })
        .then(cards => {
            console.log(cards);
            retourFrontEnd["result"] = true;
            retourFrontEnd["cards"] = cards;
        })
        .catch(err => {
            console.log(err);
            retourFrontEnd["result"] = false;
        })
        .finally(() => {
            res.send(JSON.stringify(retourFrontEnd));
        });
});

module.exports = router;