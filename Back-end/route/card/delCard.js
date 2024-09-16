const express = require('express');
const router = express.Router();
const myDB = require("../../DB");
const checkData = require("../../checkData/checkData");
const token = require("../../token/token");

router.post("/delCard", (req, res) => {
    let retourFrontEnd = {};
    checkData.checkExistKeyDict(["id"], req.body)
        .then(valueSql => {
            return Promise.all([
                valueSql,
                token.checkConnecting(req.cookies, res)
            ]);
        })
        .then(([valueSql, result]) => {
            valueSql.push(result["id"]);
            return myDB.insUpdDelSql("DELETE FROM visitCards WHERE id=? AND idUser=?", valueSql);
        })
        .then(() => {
            retourFrontEnd["result"] = true;
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