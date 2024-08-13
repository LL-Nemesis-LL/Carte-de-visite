const express = require('express');
const router = express.Router();
const myDB = require("../DB");
const checkData = require("../checkData/checkData");
const token = require("../token/token");


router.post("/addcard", (req, res) => {
    const data = req.body;
    const listdata = ["titleCard", "postName", "serviceName", "email", "companyName", "streetNumber", "districtName", "city", "postalCode", "phoneNumber"];

    let valueSql = checkData.checkExistKeyDict(listdata, data);
    if (valueSql === 0) {
        res.send(JSON.stringify({ "result": "clé erreur" }));
        return;
    }

    let retourFrontEnd = {};
    token.checkConnecting(req.cookies)
        .then(result => {
            if (result) {
                valueSql.unshift(result["id"]);
                myDB.insUpdSql(
                    "INSERT INTO visitCards(idUser, titleCard, postName, serviceName, email, companyName, streetNumber, districtName, city,  postalCode, phoneNumber) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    valueSql)
                    .then(result => {
                        retourFrontEnd["result"] = true;
                    })
                    .catch(err => {
                        console.log(err);
                        retourFrontEnd["result"] = false;
                    }).finally(result => {
                        res.send(JSON.stringify(retourFrontEnd));
                    })
            } else {
                retourFrontEnd["result"] = false;

                res.send(JSON.stringify(retourFrontEnd));
            }

        })

        .catch(err => {
            console.log(err)
            retourFrontEnd["result"] = "pas connecté";
            res.send(JSON.stringify(retourFrontEnd));
        })
});

module.exports = router;