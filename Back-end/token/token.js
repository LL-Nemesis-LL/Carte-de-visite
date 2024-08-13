const myDB = require("../DB");
const crypto = require("crypto");

function checkConnecting(cookie) {
    const checkToken = (resolve, reject) => {
        if (cookie["token"] != undefined) {
            const request = myDB.selSql("SELECT * FROM users WHERE token = ?", [cookie["token"]])
            const resultRequest = request
                .then((result) => {
                    if (result['token'] != undefined) {
                        if (result["token"] != 0) {
                            resolve(result);
                        } else {
                            reject("l'utilisateur est déconnecté");
                        }

                    } else {
                        reject("token plus valide");
                    }
                })
                .catch(err => reject(err))
        } else {
            reject("pas de token");
        }
    }
    return new Promise(checkToken)

}

function updateTokenConnecting(id) {

}


function generate() {
    // Génère un token de 32 bytes convertie en hexadécimal
    return crypto.randomBytes(32).toString('hex');
}

function timeNow() {
    let tempsNow = new Date();
    let seconds = Math.round(tempsNow.getTime() / 1000);
    let minutes = Math.floor(seconds / 60);
    return minutes;
}

module.exports = {
    checkConnecting,
    generate,
    timeNow
}