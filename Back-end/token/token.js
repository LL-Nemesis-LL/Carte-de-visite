const myDB = require("../DB");
const crypto = require("crypto");

function checkConnecting(cookie, res) {
    const checkToken = (resolve, reject) => {
        if (cookie["token"] != undefined) {
            //check if the cookie "token" was comunicated 
            myDB.selSql("SELECT * FROM users WHERE token = ?", [cookie["token"]])
                .then((result) => {
                    if (result['token'] != undefined) {
                        if (result["token"] != 0) {
                            resolve(updateTokenConnecting(result, res));
                        } else {
                            reject(new Error("l'utilisateur est déconnecté"));
                        }
                    } else {
                        reject(new Error("token plus valide"));
                    }
                })
                .catch(err => reject(err))
        } else {
            reject(new Error("pas de token"));
        }
    }
    return new Promise(checkToken)

}

function updateTokenConnecting(rowUser, res) {
    /*
        If the token's life is older that the updateTimeToken,
        the token's value will be change.

        If the token's life id older that the revokeTimeToken,
        the user will be disconnecting
    */
    const updateTokenConnectingPromise = (resolve, reject) => {
        let timeNow = timeNowInMinutes();
        let timeTokenUpdate = convertMsSecondsToMinutes(process.env.msTimeTokenUpdate);
        let timeTokenRevoke = convertMsSecondsToMinutes(process.env.msTimeTokenRevoke);
        console.log(timeTokenUpdate);
        if (rowUser["time"] + timeTokenRevoke > timeNow) {
            console.log("le temps de revocation du token est valide");
            // If the token revoke life is valide
            if (rowUser["time"] + timeTokenUpdate <= timeNow) {
                console.log("le temps d'update du token est dépasser");
                // If the token update life is available
                let newToken = generate();
                myDB.insUpdDelSql("UPDATE users set token=?, time=? WHERE id=?", [newToken, timeNow, rowUser["id"]])
                    .then((result) => {
                        res.cookie("token", newToken, { maxAge: process.env.msTimeTokenRevoke, secure: true, httpOnly: true, sameSite: 'strict' });
                        res.cookie("connected", true, { maxAge: process.env.msTimeTokenRevoke, secure: true, sameSite: 'strict' });
                        resolve(rowUser);
                    })
            } else {
                resolve(rowUser);
            }
        } else {
            console.log("le temps du token est révoquer")
            myDB.insUpdDelSql("UPDATE users set token=? WHERE id=?", [0, rowUser["id"]])
                .then((result) => {
                    res.cookie("token", 0, { maxAge: 0, secure: true, httpOnly: true, sameSite: 'strict' });
                    res.cookie("connected", true, { maxAge: 0, secure: true, sameSite: 'strict' });
                    reject(new Error("Token invalide"));
                })
        }
    }
    return new Promise(updateTokenConnectingPromise);
}

function convertMsSecondsToMinutes(msTime) {
    let minTime = Math.round(msTime / 1000);
    minTime = Math.floor(minTime / 60);
    return minTime;
}


function generate() {
    // Génère un token de 32 bytes convertie en hexadécimal
    return crypto.randomBytes(32).toString('hex');
}

function timeNowInMinutes() {
    let tempsNow = new Date();
    let seconds = Math.round(tempsNow.getTime() / 1000);
    let minutes = Math.floor(seconds / 60);
    return minutes;
}

module.exports = {
    checkConnecting,
    generate,
    timeNowInMinutes
}