const mysql = require("mysql2");

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};

const dbConnection = mysql.createConnection(dbConfig);

dbConnection.connect(err => {

    if (err) { throw err; }

    console.log("Connected to MySQL");

});

module.exports = dbConnection;