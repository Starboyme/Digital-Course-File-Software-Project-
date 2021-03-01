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


app.post('/login', urlencodedParser, function (req, res) {

    console.log(req.body)

    if(req.body.logintype=="admin"){
        con.connect(function(err){
            console.log("admin connected to database")
            con.query(`select * from login where ( username='${req.body.username}' && password='${req.body.password}' && role='${req.body.logintype}'); `,function(err,results){
                console.log(req.body);
                if(results.length == 0){res.send("No admin records with this credentials");}
                else{res.render('admin',{username: req.body.username});}
            });
        });
    }
    else if(req.body.logintype="faculty"){
        con.connect(function(err){
            console.log("admin connected to database")
            con.query(`select * from login where ( username='${req.body.username}' && password='${req.body.password}' && role='${req.body.logintype}'); `,function(err,results){
                console.log(req.body);
                if(results.length == 0){res.send("No faculty records with this credentials");}
                else{res.render('faculty',{username: req.body.username});}
            });
        });
    }
    else if(req.body.logintype="student"){
        con.connect(function(err){
            console.log("admin connected to database")
            con.query(`select * from login where ( username='${req.body.username}' && password='${req.body.password}' && role='${req.body.logintype}'); `,function(err,results){
                console.log(req.body);
                if(results.length == 0){res.send("No student records with this credentials");}
                else{res.render('student',{username: req.body.username});}
            });
        });

    }
    else{

    }
    
    
});

var server = app.listen(3000, function () {});
