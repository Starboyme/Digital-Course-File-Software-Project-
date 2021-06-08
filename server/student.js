var express = require('express');
var app = express();
app.disable("x-powered-by");

let helmet = require("helmet");
let app2 = express();
app2.use(helmet.hidePoweredBy());

const mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
const { urlencoded } = require('express');
const url = require('url');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const { type } = require('os');
const { Console } = require('console');
var crypto = require('crypto');
var assert = require('assert');
const cors=require('cors');
var ObjectId = require('mongodb').ObjectID;
var date = new Date()

require('dotenv').config();

var algorithm = 'aes256';
var key = 'password';

const mycon = mysql.createConnection({
  host     : process.env.MYSQL_URL,
  user     : process.env.MYSQL_USERNAME,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE_ACC
});

const mongoURI='mongodb://localhost:27017/DigitalCourseFile';
const conn = mongoose.createConnection("mongodb://localhost:27017/DigitalCourseFile", { useNewUrlParser: true });
const promise = mongoose.connect(mongoURI, { useNewUrlParser: true });
var MongoClient = require('mongodb').MongoClient;

let gfs

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('originalfile');
});


var urlencodedParser = bodyParser.urlencoded({ extended: true });
app2.set('view engine','ejs');
app2.use(bodyParser.urlencoded({extended: true}));
app2.use(express.static(path.join(__dirname,'public')));
app2.use(express.json());
app2.use(require('express-post-redirect'));
app2.use(bodyParser.json());
app2.use(methodOverride('_method'));
app2.use(cors());

module.exports = function(app2){

    app2.get('/student_displaycourses',function(req,res){
      console.log(req.param('username'));
      mycon.connect(function(err){
      mycon.query(`select s1.course_id,s1.faculty_id,s2.firstName from sc_conn s1,personaldetails_f s2 where s1.faculty_id=s2.faculty_id and student_id=?;`,[req.param('username')],function(err1,results){
          console.log(results);
          res.render('student_portal_page',{username:req.param('username'),course:results});
          });
        });
      });

      app2.get('/student_coursepage',function(req,res){
          res.render('student_course_page',{username:req.param('username'),courseid:req.param('courseid'),faculty_id:req.param('faculty_id'),type:0,files:false});
      });

      app2.get('/studentfeedback', (req, res) => {
        res.render('student_course_page',{username:req.param('username'),courseid:req.param('courseid'),faculty_id:req.param('faculty_id'),type:req.param('type'),files:false});
      });

      app2.post('/feedbackupdate',urlencodedParser, (req, res) => {
        message = req.param('feedbackmsg');
        curdate = date.toLocaleDateString();
        curtime = date.toLocaleTimeString();
        // console.log(message);
        // console.log(req.param('courseid'));
        // console.log(req.param('username'));
        // console.log(req.param('faculty_id'));
        mycon.connect(function(err){
          mycon.query(`insert into feedback values(?,?,?,?,?,?);`,[req.param('courseid'),req.param('faculty_id'),req.param('username'),message,curdate,curtime],function(err1,result){
            res.render('student_course_page',{username:req.param('username'),courseid:req.param('courseid'),faculty_id:req.param('faculty_id'),type:req.param('type'),files:false,results:"Thank you for the feedback!"});
              });
          });
      });

      app2.get('/student_displayfiles', (req, res) => {

        MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
            if (err) throw err;
            var dbo = db.db("DigitalCourseFile");
            dbo.collection("FileDetails").find({courseid:req.param('courseid'),facultyid:req.param('faculty_id'),filetype:req.param('filetype')}).toArray(function(err, result) {
                var fileid=[]
                result.forEach(user=>{
                fileid.push(ObjectId(user.fileid));
              });
              gfs.files.find({"_id" : {"$in" : fileid}}).toArray((err, files) => {
                var x;
                if (!files || files.length === 0) {x=false}
                else {x=files}
                res.render('student_course_page',{username:req.param('username'),courseid:req.param('courseid'),faculty_id:req.param('faculty_id'),type:req.param('type'),files:x});
              });
            });
            db.close();
          });

    });


    app2.post('/student_search', urlencodedParser,(req, res) => {
      MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
        if (err) throw err;
        var dbo = db.db("DigitalCourseFile");
        dbo.collection("FileDetails").find({courseid:req.param('courseid'),facultyid:req.param('username'),filename:req.body.fname}).toArray(function(err, result) {
            var fileid=[]
            result.forEach(user=>{
            fileid.push(ObjectId(user.fileid));
          });
          gfs.files.find({"_id" : {"$in" : fileid}}).toArray((err, files) => {
            var x;
            if (!files || files.length === 0) {x=false}
            else {x=files}
            res.render('student_course_page',{username:req.param('username'),courseid:req.param('courseid'),faculty_id:req.param('faculty_id'),type:req.param('type'),files:x});
          });
        });
        db.close();
      });
    });
  
    app2.get('/studentback', (req, res) => {
      res.render('student_portal_page',{username:req.param('username'),course:false});
   });

   app2.get('/student_profile',function(req,res){
      
    mycon.connect(function(err){
        mycon.query(`select student_id,firstName,lastName,phoneNo,address from personaldetails_s where student_id=?`,[req.param('username')],function(err1,results){
            console.log(results);
            console.log(req.param('changep')); 
            console.log(typeof(req.param('changep')));     
            res.render('student_profile',{username:req.param('username'),profdetails:results,changep:req.param('changep')});
           });
        });
     });

      app2.get('/student_changepasswordbutton',function(req,res){
      res.redirect('/student_profile?username='+req.param('username')+'&changep=true');
    });



}