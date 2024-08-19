const mysql = require('mysql2/promise');
const codeError = [1062, 1406];
const nameError = ["Email déjà utilisé", "valeur input trop longue"];
const pool = mysql.createPool({
    host: process.env.host_DB,
    user: process.env.user_DB,
    password: process.env.password_DB,
    database: process.env.name_DB,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

function requeteSql(requetePrepared, valueSql) {
    /*
        Prends en argument une requête SQL préparé et 
        sa liste d'argument à insérer.

        Renvoit une promesse.
    */
    const myDB = pool.getConnection();

    const requete = myDB
        .then(db => {
            let resultRequest = db.execute(requetePrepared, valueSql);
            pool.releaseConnection(db);
            return resultRequest;

        })
    return requete;
}

function selSql(requetePrepared, valueSql, allRows = false) {
    return requeteSql(requetePrepared, valueSql)
        .then(rows => {
            if (allRows) {
                return rows[0];
            } else {
                if (rows[0].length === 0) {
                    return [];
                } else if (rows[0].length === 1) {
                    return rows[0][0];
                }
                else {
                    throw new Error("Doit retourné une ligne alors qu'elle en retourne plusieurs :\n" + rows[0]);
                }
            }
        });

}

function insUpdDelSql(requetePrepared, valueSql) {
    return requeteSql(requetePrepared, valueSql)
        .then(rows => rows[0])
        .then((result) => {
            if (result.warningStatus == 0 || result.changedRows === 1) {
                return true;
            }
            console.log(result);
            throw new Error("changement non effectif");
        })
        .catch(err => {
            console.log(err);
            for (let i = 0; i < codeError.length; i++) {
                if (err.errno === codeError[i])
                    throw new Error(nameError[i]);
            }
            throw new Error("Erreur inconnue");
        });
}

module.exports = {
    requeteSql,
    selSql,
    insUpdDelSql,
}