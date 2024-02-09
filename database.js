const mysql = require('mysql');
const config = require("./config.json");

function connection(){
    return mysql.createConnection({

        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database
        
    });
}

module.exports = connection;