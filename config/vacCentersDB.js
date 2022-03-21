const mysql = require("mysql");

var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Gum089072484+",
  database: "vacCenter",
});

module.exports = connection;
