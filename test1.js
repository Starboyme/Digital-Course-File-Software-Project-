var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "digitalcoursefile_db"
});

app.get('/login', function (req, res) {
    
  con.connect(function(err){
      con.query(`select * from login`,function(err,results){
          console.log(results);
          res.send("nothing");
      });
  });
});

console.log("hello");

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE mydb", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });

var server = app.listen(8080, function () {});