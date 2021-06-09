var express = require('express');
var app = express();
app.disable("x-powered-by");

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
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(require('express-post-redirect'));
app.use(express.json());


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
                    if(req.body.logintype=="admin"){role="admin_portal_page";res.render(role,{username:req.body.username,course:false,faculty:false,filedetails:false});}
                    else if(req.body.logintype=="faculty"){role="faculty_portal_page";res.render(role,{username: req.body.username,course:false,addcourse:false,removecourse:false});}
                    else{role="student_portal_page";res.render(role,{username: req.body.username,course:false});}      
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
        
        mycon.connect(function(err){
            mycon.query(`drop database digitalcoursefile_db;`,function(err1,results){});
            mycon.query(`create database digitalcoursefile_db;`,function(err1,results){});
            mycon.query(`use digitalcoursefile_db;`,function(err1,results){});
            mycon.query(`create table login(username varchar(90),password varchar(90),role varchar(90),email varchar(90),primary key(username));`,function(err1,results){});
            mycon.query(`create table course(course_id varchar(30),course_name varchar(30),syllabus_id varchar(30));`,function(err1,results){});
            mycon.query(`create table fc_conn(course_id varchar(30),faculty_id varchar(30));`,function(err1,results){});
            mycon.query(`create table sc_conn(course_id varchar(30),faculty_id varchar(30),student_id varchar(30));`,function(err1,results){});
            mycon.query(`create table Allotment(course_id varchar(30),student_id varchar(30),faculty_id varchar(30));`,function(err1,results){});
            mycon.query(`create table PersonalDetails_F(faculty_id varchar(30),firstName varchar(30),lastName varchar(30),DoB date,designation varchar(30),address varchar(30),phoneNo numeric,yearOfJoining date,department varchar(30));`,function(err1,results){});
            mycon.query(`create table PersonalDetails_S(student_id varchar(30),firstName varchar(30),lastName varchar(30),DoB date,degree varchar(30),department varchar(30),address varchar(30),phoneNo numeric,yearOfJoining date);`,function(err1,results){});
            mycon.query(`create table feedback(course_id varchar(30),faculty_id varchar(30),student_id varchar(30),message longtext,curdate varchar(20),curtime varchar(20));`,function(err1,results){});
            mycon.query(`insert into login(username,password,role,email) values ("A.001","784b67ab091169ab8760584266d786db","admin","vsk22vsk@gmail.com");`,function(err1,results){});
            mycon.query(`insert into login(username,password,role,email) values ("F.001","784b67ab091169ab8760584266d786db","faculty","ashwithjason@gmail.com");`,function(err1,results){});
            mycon.query(`insert into login(username,password,role,email) values ("S.001","784b67ab091169ab8760584266d786db","student","rajpradeepkrr@gmail.com");`,function(err1,results){});
            mycon.query(`insert into login values ('F.002','784b67ab091169ab8760584266d786db','faculty','rajeshkumar@gmail.com');`,function(err1,results){});
            mycon.query(`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'`,function(err1,results){});
            mycon.query(`insert into course values ('15CSE311','compiler design','Designing compiler');`,function(err1,results){});
            mycon.query(`insert into course values ('15CSE312','computer networks','Understanding networks');`,function(err1,results){});
            mycon.query(`insert into course values ('15CSE313','software engineering','Developing a software');`,function(err1,results){});
            mycon.query(`insert into course values ('15CSE336','biometrics','Studying biometric models');`,function(err1,results){});
            mycon.query(`insert into course values ('15CSE432','principles of machine learning','Basics of ml');`,function(err1,results){});
            mycon.query(`insert into course values ('15SSK331','soft skills','CIR');`,function(err1,results){});
            mycon.query(`insert into fc_conn values ('15CSE311','F.001');`,function(err1,results){});
            mycon.query(`insert into fc_conn values ('15CSE312','F.001');`,function(err1,results){});
            mycon.query(`insert into fc_conn values ('15CSE313','F.001');`,function(err1,results){});
            mycon.query(`insert into fc_conn values ("15CSE311","F.002");`,function(err1,results){});
            mycon.query(`insert into sc_conn values ('15CSE311','F.001','S.001');`,function(err1,results){});
            mycon.query(`insert into sc_conn values ('15CSE312','F.001','S.001');`,function(err1,results){});
            mycon.query(`insert into sc_conn values ('15CSE313','F.001','S.001');`,function(err1,results){});
            mycon.query(`insert into personaldetails_f values ('F.001','aswith','jason','2000-01-01','HOD','ooty','9442233224','2000-01-01','computer science');`,function(err1,results){});
            mycon.query(`insert into personaldetails_f values ('F.002','rajesh','kumar','1990-01-02','Asst Prof','Thiruchi','9442683347','2000-01-01','Computer Science');`,function(err1,results){});
            mycon.query(`insert into personaldetails_s values ("S.001","raj","pradeep","2000-10-27","BTech","CSE","Karur",9442683333,"2018-05-01");`,function(err1,results){});
            mycon.query(`SET SQL_SAFE_UPDATES = 0;`,function(err1,results){});
            
        });


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