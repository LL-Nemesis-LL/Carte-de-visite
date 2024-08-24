const express = require('express');
const router = express.Router();
const myDB = require("../../DB");
const token = require("../../token/token");
const checkData = require("../../checkData/checkData");

router.get("/getCards", (req, res) => {
    let retourFrontEnd = {};
    token.checkConnecting(req.cookies)
        .then(result => {
            return myDB.selSql("SELECT * FROM visitCards WHERE idUser=?", [result["id"]], allRows = true);
        })
        .then(cards => {
            cards = checkData.removeData(cards, ["companyLogo", "profilPicture", "idUser", 'id'], true);
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