const express = require('express');
const router = express.Router();
const myDB = require("../../DB");
const checkData = require("../../checkData/checkData");
const token = require("../../token/token");

router.post("/editCard", (req, res) => {
    const data = req.body;
    const listdata = ["titleCard", "postName", "serviceName", "email", "companyName",
        "streetNumber", "districtName", "city", "postalCode", "phoneNumber", "id"];
    let retourFrontEnd = {};

    checkData.checkExistKeyDict(listdata, data)
        .then((valueSql) => {
            return Promise.all([
                valueSql,
                token.checkConnecting(req.cookies)
            ]);

        })
        .then(([valueSql, result]) => {
            valueSql[10] = parseInt(valueSql[10]);
            valueSql.push(result["id"]);
            console.log(valueSql);
            return myDB.insUpdDelSql("UPDATE visitCards set \
                titleCard=?, postName=?, serviceName=?, email=?, companyName=?, streetNumber=?,\
                districtName=?, city=?, postalCode=?, phoneNumber=? WHERE id=? AND idUser=?",
                valueSql);
        })
        .then(result => {
            console.log(result);
            if (result.warningStatus === 0) {
                retourFrontEnd["result"] = true;
            } else {
                throw new Error("requete sql warning" + result);
            }

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