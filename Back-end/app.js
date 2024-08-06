mysql = require('mysql2/promise');
const port = 3003;
const host = "127.0.0.1";
//const myDB = require("./connectDB");
const express = require("express");
const cors = require("cors");
const sha256 = require('js-sha256');
const app = express();
const salt = "iYEhs_92b'7O2";

function verifyExistKeyDict(keys, dict) {
    let listValue = [];
    let i = 0;
    for (element of keys) {
        if (dict[element] == undefined) {
            return 0;
        }
        listValue.push(dict[element]);
        i++;
    }
    return listValue;
}
async function requeteSql(requetePrepared, valueSql) {
    try {
        const myDB = await mysql.createConnection({
            host: 'localhost',
            user: 'my_card',
            password: 'm_7H_Be&uNz54A',
            database: 'my_card'
        });
        const [rows, fields] = await myDB.execute(
            requetePrepared,
            valueSql);
        return [rows, fields]
    } catch (err) {
        throw new Error(err);
    }
}





app.use(express.json());
app.use(cors());

app.post('/inscription', (req, res) => {
    const data = req.body;
    const listdata = ["nom", "prenom", "email", "password"]
    let valueSql = verifyExistKeyDict(listdata, data);
    if (valueSql == 0) {
        res.send(JSON.stringify({ "message": "erreur" }));
    }
    valueSql[3] = sha256(salt + valueSql[3]);
    requeteSql("INSERT INTO utilisateurs(nom, prenom, email, password) VALUES(?, ?, ?, ?)", valueSql)
        .then((result) => {
            console.log(result);
            res.send();
        })
        .catch((erreur) => {
            console.log(erreur);
            res.send(JSON.stringify({ "message": "erreur" }));
        })
});

app.post("/seconnecter", (req, res) => {
    const data = req.body;
    const listdata = ["email", "password"];
    let valueSql = verifyExistKeyDict(listdata, data);
    if (valueSql == 0) {
        res.send(JSON.stringify({ "message": "erreur" }));
    }
    requeteSql("SELECT password FROM utilisateurs WHERE email=?", [valueSql[0]])
        .then((result) => {
            let rows = result[0][0]
            if (rows.length == 1) {
                let password = rows;
                console.log("longueur password :\n" + password.length);
                if (password.keys().length != 1) {
                    console.log("erreur plusieur password");
                    if (sha256(salt + valueSql[1]) == password["password"]) {
                        console.log("yes password");
                        res.send(JSON.stringify({ "message": "reussi" }));
                    } else {
                        console.log("no password");
                    }
                }
            }
            console.log(result);
        })
        .catch((erreur) => {
            console.log(erreur);
        });
    res.send();

});

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});