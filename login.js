var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var m1=require('./test.js');
var path=require('path');
const { urlencoded } = require('express');


var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "digitalcoursefile_db"
  });

var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

var otp=0;
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}  

app.post('/login', urlencodedParser, function (req, res) {
    console.log(req.body);
    con.connect(function(err){
        con.query(`select * from login where ( username='${req.body.username}' && password='${req.body.password}' && role='${req.body.logintype}'); `,function(err,results){
            if(results.length == 0){res.send("No admin records with this credentials");}
            else{
                let role;
                if(req.body.logintype=="admin"){role="admin";}
                else if(req.body.logintype=="faculty"){role="faculty"}
                else{role="student"}   
                res.render(role,{username: req.body.username});             
            }
        });
    });        
});

app.post('/f1submit', urlencodedParser, function (req, res) {
    con.connect(function(err){
        con.query(`select * from login where ( username='${req.body.username}' && email='${req.body.email}'); `,function(err,results){
            if(results.length == 0){res.render('forgotpassword',{flag:2});}
            else{
                x=getRndInteger(111111,999999);
                m1.sendmail(req.body.email,x);
                res.render('forgotpassword',{flag:2.5});
            }
        });
    });
});

app.post('/f2submit', urlencodedParser, function (req, res) {
    if(req.body.otp==x){res.render('forgotpassword',{flag:3.5});}
    else{res.render('forgotpassword',{flag:3});}
});

app.post('/newpasswordreset', urlencodedParser, function (req, res) {  

    con.connect(function(err){
        con.query(`update login set password='${req.body.newpassword}' where username="${req.body.username}";`,function(){
            res.render('forgotpassword',{flag:4.5});
        });
    });
    
});

app.post('/forgotpassword',urlencodedParser,function(req,res){
    res.render('forgotpassword',{flag:1.5});
});
var server = app.listen(3000, function () {});

