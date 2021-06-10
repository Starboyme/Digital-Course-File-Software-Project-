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

    app2.get('/admin_displaycourses',function(req,res){
        console.log(req.param('username'));
        mycon.connect(function(err){
        mycon.query(`select * from course`,function(err1,results){
            console.log(results);
            res.render('admin_portal_page',{username:req.param('username'),course:results,faculty:false,filedetails:false});
        });
      });
    });

    app2.get('/admin_coursepage',function(req,res){
        console.log(req.param('courseid'));
        mycon.connect(function(err){
          mycon.query(`select t1.faculty_id,t2.firstName,t2.lastName from fc_conn t1,personaldetails_f t2 where t1.course_id=? and t1.faculty_id=t2.faculty_id;`,[req.param('courseid')],function(err1,results){
              console.log(results);
              res.render('admin_portal_page',{username:req.param('username'),faculty:results,course:false,filedetails:false});
          });
        });
    });

    app2.get('/admin_filesfromdates',function(req,res){
  
            MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
              if (err) throw err;
              var dbo = db.db("DigitalCourseFile");
              dbo.collection("FileDetails").find({date:{ $gt: req.param('fromdate'), $lt: req.param('todate')}}).toArray(function(err1, result) {
                  console.log(result);
                  res.render('admin_portal_page',{username:req.param('username'),faculty:false,course:false,filedetails:result});
                db.close();
              });
          });

    });

    

}