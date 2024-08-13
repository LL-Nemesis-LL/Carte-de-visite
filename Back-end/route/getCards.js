const express = require('express');
const router = express.Router();
const myDB = require("../DB");
const checkData = require("../checkData/checkData");
const token = require("../token/token");

router.get("/getCards", (req, res) => {
    let retourFrontEnd = {};
    token.checkConnecting(req.cookies)
        .then(result => {
            myDB.selSql("SELECT * FROM visitCards WHERE idUser=?", [result["id"]], allRows = true)
                .then(cards => {
                    retourFrontEnd["result"] = true;
                    retourFrontEnd["cards"] = cards;
                })
                .catch(err => {
                    retourFrontEnd["result"] = false;
                    console.log(err);
                })
                .finally(() => {
                    res.send(JSON.stringify(retourFrontEnd));
                })
        })
        .catch(err => {
            console.log(err);
            retourFrontEnd["result"] = false;
            res.send(JSON.stringify(retourFrontEnd));
        })
});

module.exports = router;