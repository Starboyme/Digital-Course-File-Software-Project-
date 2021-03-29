var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var m1=require('./test.js');


var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "digitalcoursefile_db"
  });

var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("./public"));
app.use(bodyParser.json());

var otp=0;
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}  

app.post('/login', urlencodedParser, function (req, res) {

    console.log(req.body)
     
    if(req.body.logintype=="admin"){
        con.connect(function(err){
            // console.log("admin connected to database")
            con.query(`select * from login where ( username='${req.body.username}' && password='${req.body.password}' && role='${req.body.logintype}'); `,function(err,results){
                if(results.length == 0){res.send("No admin records with this credentials");}
                else{res.render('admin',{username: req.body.username});}
            });
        });
    }
    else if(req.body.logintype=="faculty"){
        con.connect(function(err){
            // console.log("faculty connected to database")
            con.query(`select * from login where ( username='${req.body.username}' && password='${req.body.password}' && role='${req.body.logintype}'); `,function(err,results){
                if(results.length == 0){res.send("No faculty records with this credentials");}
                else{res.render('faculty',{username: req.body.username});}
            });
        });
    }
    else if(req.body.logintype=="student"){
        con.connect(function(err){
            // console.log("student connected to database")
            con.query(`select * from login where ( username='${req.body.username}' && password='${req.body.password}' && role='${req.body.logintype}'); `,function(err,results){
                if(results.length == 0){res.send("No student records with this credentials");}
                else{res.render('student',{username: req.body.username});}
            });
        });

    }
    else{

    }
    
    
});

app.post('/f1submit', urlencodedParser, function (req, res) {

    con.connect(function(err){
        con.query(`select * from login where ( username='${req.body.username}' && email='${req.body.email}'); `,function(err,results){
            if(results.length == 0){res.send("0");}
            else{
                x=getRndInteger(111111,999999);
                m1.sendmail(req.body.email,x);
                res.send("1");
            }
        });
    });

    
});

app.post('/f2submit', urlencodedParser, function (req, res) {
    if(req.body.otp==x){res.send("1");}
    else{res.send("0");}
});

app.post('/newpasswordreset', urlencodedParser, function (req, res) {  

    con.connect(function(err){
        con.query(`update login set password='${req.body.newpassword}' where username="${req.body.username}";`,function(){
            res.send("Password changed");
        });
    });
    
});

var server = app.listen(3000, function () {});
