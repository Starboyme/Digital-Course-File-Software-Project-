var express = require('express');
var app1 = express();
app1.disable("x-powered-by");

let helmet = require("helmet");
let app2 = express();
app2.use(helmet.hidePoweredBy());

const mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var m1=require('./email.js');
const { urlencoded } = require('express');
var crypto = require('crypto');
var assert = require('assert');
const digitGenerator = require('crypto-secure-random-digit');
const { reset } = require('nodemon');
require('dotenv').config();

var algorithm = 'aes256';
var key = 'password';

const mycon = mysql.createConnection({
    host     : process.env.MYSQL_URL,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE_ACC
  });

const randomDigits = digitGenerator.randomDigits(6);
var otp = 0;
for(var i=0;i<randomDigits.length;i++){
    otp = (otp*10) + randomDigits[i];
}

var urlencodedParser = bodyParser.urlencoded({ extended: true });
app2.set('view engine','ejs');
app2.use(bodyParser.urlencoded({extended: true}));
app2.use(express.static(path.join(__dirname,'public')));
app2.use(bodyParser.json());
app2.use(require('express-post-redirect'));
app2.use(express.json());


module.exports = function(app){

    app.post('/login', urlencodedParser, function (req, res) {
        var cipher = crypto.createCipher(algorithm, key);   
        var encrypted = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');
        mycon.connect(function(err){
            mycon.query(`select * from login where ( username=? && password=? && role=?); `,[req.body.username,encrypted,req.body.logintype],function(err1,results){
                if(results.length == 0){
                    if(req.body.logintype=="admin"){res.render('login',{success:"No admin records with this credentials"});}
                    else if(req.body.logintype=="faculty"){res.render('login',{success:"No faculty records with this credentials"});}
                    else{res.render('login',{success:"No student records with this credentials"});}
                }
                else{   
                    mycon.query(`(select firstName from personaldetails_s where student_id=?) union (select firstName from personaldetails_f where faculty_id=?)`,[req.body.username,req.body.username],function(err2,results){
                        if(req.body.logintype=="admin"){let role="admin_portal_page";res.render(role,{username:req.body.username,course:false,faculty:false,filedetails:false});}
                        else if(req.body.logintype=="faculty"){let role="faculty_portal_page";res.render(role,{username: req.body.username,facultyname:results[0].firstName,course:false,addcourse:false,removecourse:false});}
                        else{let role="student_portal_page";res.render(role,{username: req.body.username,studentname:results[0].firstName,course:false});}    
                    });     
                }
            });
        });        
    });
    
    app.post('/f1submit', urlencodedParser, function (req, res) {
        mycon.connect(function(err){
            mycon.query(`select * from login where ( username=? && email=?); `,[req.body.username,req.body.email],function(err1,results){
                if(results.length == 0){res.render('forgotpassword',{flag:2.2});}
                else{
                    m1.sendmail(req.body.email,otp);
                    res.render('forgotpassword',{flag:2});
                }
            });
        });
    });
    
    app.post('/f2submit', urlencodedParser, function (req, res) {
        if(req.body.otp==otp){res.render('forgotpassword',{flag:3});}
        else{res.render('forgotpassword',{flag:3.3});}
    });
    
    app.post('/newpasswordreset', urlencodedParser, function (req, res) {  
    
        mycon.connect(function(err){
            var cipher = crypto.createCipher(algorithm, key);   
            var encrypted = cipher.update(req.body.newpassword, 'utf8', 'hex') + cipher.final('hex');
            mycon.query(`update login set password=? where username=?`,[encrypted,req.body.username],function(){
                res.render('forgotpassword',{flag:4});
            });
        });
        
    });
    
    app.post('/forgotpassword',urlencodedParser,function(req,res){
        res.render('forgotpassword',{flag:1});
    });
    
    app.get('/loginpage',function(req,res){
        res.render('login',{success:false});
    });

    app.get('/page1',function(req,res){
        res.render('page1');
    });
    app.get('/page2',function(req,res){
        res.render('page2');
    });
    app.get('/page3',function(req,res){
        res.render('page3');
    });
    app.get('/page4',function(req,res){
        res.render('page4');
    });
    app.get('/googlelogin',function(req,res){
        res.render('glogin');
    });
    app.get('/otpgen',function(req,res){
        res.render('otppage');
    });
    app.get('/passreset',function(req,res){
        res.render('passwordreset');
    });
    app.get('/alterpro',function(req,res){
        res.render('alterprofile');
    });
    app.get('/qpaper',function(req,res){
        res.render('questionpaper');
    });
    app.get('/page1',function(req,res){
        res.render('page1');
    });
    app.get('/page2',function(req,res){
        res.render('page2');
    });
    app.get('/page3',function(req,res){
        res.render('page3');
    });
    app.get('/page4',function(req,res){
        res.render('page4');
    });
    app.get('/googlelogin',function(req,res){
        res.render('glogin');
    });
    app.get('/otpgen',function(req,res){
        res.render('otppage');
    });
    app.get('/passreset',function(req,res){
        res.render('passwordreset');
    });
    app.get('/alterpro',function(req,res){
        res.render('alterprofile');
    });
    app.get('/qpaper',function(req,res){
        res.render('questionpaper');
    });
}