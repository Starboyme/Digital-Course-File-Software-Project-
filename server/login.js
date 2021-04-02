var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var m1=require('./email.js');
const { urlencoded } = require('express');


var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "digitalcoursefile_db"
  });

var otp=0;
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}  

var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(require('express-post-redirect'));
app.use(express.json());


module.exports = function(app){

    app.post('/login', urlencodedParser, function (req, res) {
        console.log(req.body);
        con.connect(function(err){
            con.query(`select * from login where ( username='${req.body.username}' && password='${req.body.password}' && role='${req.body.logintype}'); `,function(err,results){
                if(results.length == 0){res.send("No admin records with this credentials");}
                else{
                    let role;
                    if(req.body.logintype=="admin"){role="admin";}
                    else if(req.body.logintype=="faculty"){role="faculty_portal_page"}
                    else{role="student"}   
                    res.render(role,{username: req.body.username});             
                }
            });
        });        
    });
    
    app.post('/f1submit', urlencodedParser, function (req, res) {
        con.connect(function(err){
            con.query(`select * from login where ( username='${req.body.username}' && email='${req.body.email}'); `,function(err,results){
                if(results.length == 0){res.render('forgotpassword',{flag:2.2});}
                else{
                    x=getRndInteger(111111,999999);
                    m1.sendmail(req.body.email,x);
                    res.render('forgotpassword',{flag:2});
                }
            });
        });
    });
    
    app.post('/f2submit', urlencodedParser, function (req, res) {
        if(req.body.otp==x){res.render('forgotpassword',{flag:3});}
        else{res.render('forgotpassword',{flag:3.3});}
    });
    
    app.post('/newpasswordreset', urlencodedParser, function (req, res) {  
    
        con.connect(function(err){
            con.query(`update login set password='${req.body.newpassword}' where username="${req.body.username}";`,function(){
                res.render('forgotpassword',{flag:4});
            });
        });
        
    });
    
    app.post('/forgotpassword',urlencodedParser,function(req,res){
        res.render('forgotpassword',{flag:1});
    });
    
    app.get('/loginpage',function(req,res){
        res.render('login');
    });
}