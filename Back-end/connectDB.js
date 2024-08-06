mysql = require('mysql2/promise');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'my_card',
    password: 'm_7H_Be&uNz54A',
    database: 'my_card'
});

module.exports = connection