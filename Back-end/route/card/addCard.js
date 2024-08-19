const express = require('express');
const router = express.Router();
const myDB = require("../../DB");
const checkData = require("../../checkData/checkData");
const token = require("../../token/token");


router.post("/addcard", (req, res) => {
    const data = req.body;
    const listdata = ["titleCard", "postName", "serviceName", "email", "companyName",
        "streetNumber", "districtName", "city", "postalCode", "phoneNumber"];
    let retourFrontEnd = {};

    checkData.checkExistKeyDict(listdata, data)
        .then((valueSql) => {
            return Promise.all([
                valueSql,
                token.checkConnecting(req.cookies)
            ]);

        })
        .then(([valueSql, result]) => {
            valueSql.unshift(result["id"]);
            return myDB.insUpdDelSql(
                "INSERT INTO visitCards(idUser, titleCard, postName, serviceName, email,\
                companyName, streetNumber, districtName, city,  postalCode, phoneNumber) \
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                valueSql);
        })
        .then(() => {
            retourFrontEnd["result"] = true;
        })
        .catch(err => {
            console.log(err);
            retourFrontEnd["result"] = false;
            retourFrontEnd["message"] = err.message;
        })
        .finally(result => {
            res.send(JSON.stringify(retourFrontEnd));
        });
});

module.exports = router;