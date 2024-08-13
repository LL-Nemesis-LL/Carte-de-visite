const mysql = require('mysql2/promise');
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
        .catch(err => { throw new Error(err) });
    return requete;
}

function selSql(requetePrepared, valueSql, allRows = false) {
    const requete = requeteSql(requetePrepared, valueSql)
    const resultRequete = requete
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
        })
        .catch(err => { throw new Error("selSql :\n" + err) });
    return resultRequete;
}

function insUpdSql(requetePrepared, valueSql) {
    const requete = requeteSql(requetePrepared, valueSql)
    const resultRequete = requete
        .then(rows => rows[0])
        .catch(err => { throw new Error(err) });
    return resultRequete;
}

module.exports = {
    requeteSql,
    selSql,
    insUpdSql
}