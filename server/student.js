var express = require('express');
var app = express();
app.disable("x-powered-by");

let helmet = require("helmet");
let app1 = express();
app1.use(helmet.hidePoweredBy());

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

const mongoURI='mongodb://127.0.0.1:27017/DigitalCourseFile';
const conn = mongoose.createConnection("mongodb://127.0.0.1:27017/DigitalCourseFile", { useNewUrlParser: true });
const promise = mongoose.connect(mongoURI, { useNewUrlParser: true });
var MongoClient = require('mongodb').MongoClient;

let gfs

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('originalfile');
});

let corsOptions = {
  origin: 'trustedwebsite.com' // Compliant
};

var urlencodedParser = bodyParser.urlencoded({ extended: true });
app1.set('view engine','ejs');
app1.use(bodyParser.urlencoded({extended: true}));
app1.use(express.static(path.join(__dirname,'public')));
app1.use(express.json());
app1.use(require('express-post-redirect'));
app1.use(bodyParser.json());
app1.use(methodOverride('_method'));
app1.use(cors(corsOptions));

module.exports = function(app2){

    app2.get('/student_displaycourses',function(req,res){
      console.log(req.param('username'));
      mycon.connect(function(err){
      mycon.query(`select s1.course_id,s1.faculty_id,s2.firstName from sc_conn s1,personaldetails_f s2 where s1.faculty_id=s2.faculty_id and student_id=?;`,[req.param('username')],function(err1,results){
          console.log(results);
          res.render('student_portal_page',{username:req.param('username'),studentname:req.param('studentname'),course:results});
          });
        });
      });

      app2.get('/student_coursepage',function(req,res){

          mycon.connect(function(err){
          mycon.query(`select firstName from personaldetails_f where faculty_id=?`,[req.param('faculty_id')],function(err1,results){
              mycon.query(`select course_name from course where course_id = ?;`,[req.param('courseid')],function(err2,results2)
              { 
                res.render('student_course_page',{username:req.param('username'),studentname:req.param('studentname'),coursename:results2[0].course_name,courseid:req.param('courseid'),faculty_id:req.param('faculty_id'),facultyname:results[0].firstName,type:0,files:false});
              });
              });
            });
      });

      app2.get('/studentfeedback', (req, res) => {
        res.render('student_course_page',{username:req.param('username'),coursename:req.param('coursename'),studentname:req.param('studentname'),courseid:req.param('courseid'),faculty_id:req.param('faculty_id'),facultyname:req.param('facultyname'),type:req.param('type'),files:false});
      });

      app2.post('/feedbackupdate',urlencodedParser, (req, res) => {
        let message = req.param('feedbackmsg');
        let curdate = date.toLocaleDateString();
        let curtime = date.toLocaleTimeString();
        mycon.connect(function(err){
          mycon.query(`insert into feedback values(?,?,?,?,?,?);`,[req.param('courseid'),req.param('faculty_id'),req.param('username'),message,curdate,curtime],function(err1,result){
            res.render('student_course_page',{username:req.param('username'),coursename:req.param('coursename'),studentname:req.param('studentname'),courseid:req.param('courseid'),faculty_id:req.param('faculty_id'),facultyname:req.param('facultyname'),type:req.param('type'),files:false,results:"Thank you for the feedback!"});
              });
          });
      });

      app2.get('/student_displayfiles', (req, res) => {

        MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
            if (err) throw err;
            var dbo = db.db("DigitalCourseFile");
            dbo.collection("FileDetails").find({courseid:req.param('courseid'),facultyid:req.param('faculty_id'),filetype:req.param('filetype')}).toArray(function(err1, result) {
                var fileid=[]
                result.forEach(user=>{
                fileid.push(ObjectId(user.fileid));
              });
              gfs.files.find({"_id" : {"$in" : fileid}}).toArray((err2, files) => {
                var x;
                if (!files || files.length === 0) {x=false}
                else {x=files}
                res.render('student_course_page',{username:req.param('username'),coursename:req.param('coursename'),studentname:req.param('studentname'),courseid:req.param('courseid'),faculty_id:req.param('faculty_id'),facultyname:req.param('facultyname'),type:req.param('type'),files:x});
              });
            });
            db.close();
          });

    });

    app2.post('/student_editprofile', urlencodedParser,function(req,res){
      console.log(req.param('username'));
      console.log(req.body);
      mycon.connect(function(err){
        mycon.query(`UPDATE personaldetails_s SET phoneNo =? ,address=? WHERE student_id=?`,[req.param('PhoneNo'),req.param('address'),req.param('username')],function(err1,results){
          console.log("success")
        });
        res.redirect('/student_profile?username='+req.param('username')+'&studentname='+req.param('studentname')+'&changep=false');
      });
    });



    app2.post('/student_search', urlencodedParser,(req, res) => {
      MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
        if (err) throw err;
        var dbo = db.db("DigitalCourseFile");
        dbo.collection("FileDetails").find({courseid:req.param('courseid'),facultyid:req.param('faculty_id'),filename:req.body.fname}).toArray(function(err1, result) {
            var fileid=[]
            result.forEach(user=>{
            fileid.push(ObjectId(user.fileid));
          });
          gfs.files.find({"_id" : {"$in" : fileid}}).toArray((err2, files) => {
            var x;
            if (!files || files.length === 0) {x=false}
            else {x=files}
            res.render('student_course_page',{username:req.param('username'),coursename:req.param('coursename'),studentname:req.param('studentname'),courseid:req.param('courseid'),faculty_id:req.param('faculty_id'),facultyname:req.param('facultyname'),type:req.param('type'),files:x});
          });
        });
        db.close();
      });
    });
  
    app2.get('/studentback', (req, res) => {
      res.render('student_portal_page',{username:req.param('username'),studentname:req.param('studentname'),course:false});
   });

   app2.get('/student_profile',function(req,res){
      
    mycon.connect(function(err){
        mycon.query(`select student_id,firstName,lastName,phoneNo,address from personaldetails_s where student_id=?`,[req.param('username')],function(err1,results){
            console.log(results);
            console.log(req.param('changep')); 
            console.log(typeof(req.param('changep')));     
            res.render('student_profile',{username:req.param('username'),studentname:req.param('studentname'),studentdetails:results,changep:req.param('changep')});
           });
        });
     });

}