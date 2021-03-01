var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "digitalcoursefile_db"
  });
  
var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get('/login', urlencodedParser, function (req, res) {
    con.connect(function(err){
        console.log("connected to database");
        
        // con.query(`select * from login`,function(err,results){
        //     res.send(results.length);
        // });
    });
    
});

var server = app.listen(8080, function () {});
