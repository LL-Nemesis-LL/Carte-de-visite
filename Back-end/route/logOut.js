const express = require('express');
const router = express.Router();
const myDB = require("../DB");
const token = require("../token/token");

router.get("/logout", (req, res) => {
    let retourFrontEnd = {};
    token.checkConnecting(req.cookies)
        .then((result) => {
            myDB.insUpdSql("UPDATE users SET token=? WHERE id=?", [0, result["id"],])
                .then(result => {
                    retourFrontEnd["result"] = true;
                    res.cookie("token", 0, { maxAge: 0, secure: true, httpOnly: true, sameSite: 'strict' });
                    res.cookie("connected", true, { maxAge: 0, secure: true, sameSite: 'strict' });
                })
                .catch(err => {
                    console.log(err);
                    retourFrontEnd["result"] = false;
                })
                .finally(() => {
                    res.send(JSON.stringify(retourFrontEnd))
                })
        })
        .catch(err => {
            console.log("logout :\n" + err);
            res.send(JSON.stringify(retourFrontEnd))
        })
});

module.exports = router;