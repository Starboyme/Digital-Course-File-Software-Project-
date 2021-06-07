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


const storage = new GridFsStorage({
  db: promise,
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'originalfile'
        };
        resolve(fileInfo);
    });
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 8000000} });


module.exports = function(app2){

    app2.get('/displaycourses',function(req,res){
        console.log(req.param('username'));
        mycon.connect(function(err){
        mycon.query(`select * from fc_conn where faculty_id=?`,[req.param('username')],function(err1,results){
            console.log(results);
            console.log(typeof(req.param('type')));
            if(req.param('type')=='1')
            {
              res.render('faculty_portal_page',{username:req.param('username'),course:results,addcourse:false,removecourse:false});
            }
            else
            {
              res.render('faculty_portal_page',{username:req.param('username'),removecourse:results,addcourse:false,course:false});
            }
            
        });
      });
    });

    app2.get('/showcourses',function(req,res){
      mycon.connect(function(err){
        mycon.query(`SELECT t1.course_id FROM course t1 LEFT JOIN (select * from fc_conn where faculty_id=?) t2 ON t2.course_id = t1.course_id WHERE t2.course_id IS NULL`,[req.param('username')],function(err1,results){
            console.log(results);
            res.render('faculty_portal_page',{username:req.param('username'),course:false,removecourse:false,addcourse:results});
            });
          });
      });

    app2.get('/addcourse',function(req,res){
      console.log("hi");
      mycon.connect(function(err){
        mycon.query(`insert into fc_conn values (?,?);`,[req.param('courseid'),req.param('username')],function(err1,results){
               res.redirect('/showcourses?username='+req.param('username'));
            });
          });
      });

      app2.get('/removecourse',function(req,res){
        console.log("hi I'm delete course");
        console.log(req.param('courseid'));
        console.log(req.param('username'));
        mycon.connect(function(err){
          mycon.query(`SET SQL_SAFE_UPDATES = 0;`,function(err2,resultss)
          { 
            mycon.query(`delete from fc_conn where course_id=? and faculty_id=?;`,[req.param('courseid'),req.param('username')],function(err1,results){
                  res.redirect('/displaycourses?username='+req.param('username')+'&type=2');
                });
            });
          });
        });

    app2.get('/coursepage',function(req,res){
        res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:0,files:false});
    });

    app2.post('/upload',upload.single('file'),(req, res) => {

        var date_ob=new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        var curtime = hours + ":" + minutes + ":" + seconds ; 
        var curdate = date + "-" + month + "-" + year; 
        console.log(curdate);
        console.log(curtime);


        MongoClient.connect(mongoURI, function(err, db) {
          if (err) throw err;
          var dbo = db.db("DigitalCourseFile");
          var myobj = { facultyid: req.param('username'),courseid: req.param('courseid'),filename: req.file.filename,filetype: req.param('filetype'),fileid: req.file.id,date: curdate,time: curtime };
          dbo.collection("FileDetails").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
        });
        res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type='+req.param('type')+'&filetype='+req.param('filetype'));
    });
    
    app2.post('/search', urlencodedParser,(req, res) => {


          MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
            if (err) throw err;
            var dbo = db.db("DigitalCourseFile");
            dbo.collection("FileDetails").find({courseid:req.param('courseid'),facultyid:req.param('username'),filename:req.body.fname}).toArray(function(err, result) {
                var fileid=[]
                result.forEach(user=>{
                fileid.push(ObjectId(user.fileid));
              });

              // console.log(fileid);

              gfs.files.find({"_id" : {"$in" : fileid}}).toArray((err, files) => {
                var x;
                if (!files || files.length === 0) {x=false}
                else {x=files}
                res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:req.param('type'),files:x});
              });

            });
            db.close();
          });


    });

    app2.get('/feedbacks', (req, res) => {
      // console.log("Im in bro");
      // console.log(req.param('courseid'));
      // console.log(req.param('username'));
      mycon.connect(function(err){
          mycon.query(`select * from feedback where course_id=? and faculty_id=?;`,[req.param('courseid'),req.param('username')],function(err1,result){
            console.log(result);
            if(result.length != 0)
            {
              res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:req.param('type'),results:result});
            }
            else
            {
              // console.log("Nothing");
              res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:req.param('type'),results:false});
            }
            
              });
          });
    });

    app2.get('/displayfiles', (req, res) => {

        MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
            if (err) throw err;
            var dbo = db.db("DigitalCourseFile");
            // console.log(req.param('courseid'));
            // console.log(req.param('username'));
            // console.log(req.param('filetype'));
            dbo.collection("FileDetails").find({courseid:req.param('courseid'),facultyid:req.param('username'),filetype:req.param('filetype')}).toArray(function(err, result) {
                var fileid=[]
                result.forEach(user=>{
                fileid.push(ObjectId(user.fileid));
              });

              // console.log(fileid);

              gfs.files.find({"_id" : {"$in" : fileid}}).toArray((err, files) => {
                var x;
                if (!files || files.length === 0) {x=false}
                else {x=files}
                res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:req.param('type'),files:x});
              });


            });
            db.close();
          });
      
    });

    app2.get('/file/:filename', (req, res) => {
      gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
          const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res);
      });
    });

    app2.get('/facultyback', (req, res) => {
       res.render('faculty_portal_page',{username:req.param('username'),course:false,addcourse:false,removecourse:false});
    });

    app2.get('/files/:id', (req, res) => {


        MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
          var dbo = db.db("DigitalCourseFile");
          // console.log("raj"+req.params.id);
          // var myquery = { fileid: req.params.id };
          dbo.collection("FileDetails").deleteOne({fileid:ObjectId(req.params.id)}, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
          });

        });

        gfs.remove({ _id: req.params.id, root: 'originalfile' }, (err, gridStore) => {
          if (err) {
            return res.status(404).json({ err: err });
          }
          res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type='+req.param('type')+'&filetype='+req.param('filetype'));
        });
     
    });

    app2.get('/facultyprofile',function(req,res){
      
      mycon.connect(function(err){
          mycon.query(`select faculty_id,firstName,lastName,phoneNo,address from personaldetails_f where faculty_id=?`,[req.param('username')],function(err1,results){
              console.log(results);
              console.log(req.param('changep')); 
              console.log(typeof(req.param('changep')));     
              res.render('faculty_profile',{profdetails:results,changep:req.param('changep')});
          });
        });
    });

    app2.post('/changepassword', urlencodedParser,function(req,res){
      mycon.connect(function(err){
        var cipher = crypto.createCipher(algorithm, key);   
        var encrypted = cipher.update(req.param('oldpassword'), 'utf8', 'hex') + cipher.final('hex');
        console.log(encrypted);
        var x;
        var str;
        str=`select * from login where (username='${req.param('username')}' and password='${encrypted}');`;
        console.log(str);
        mycon.query(`select * from login where (username=? and password=?);`,[req.param('username'),encrypted],function(err1,results){
          x=results;
          console.log(x);
          if(x.length==0){res.send("password did not match");}
          else{
            var cipher1 = crypto.createCipher(algorithm, key);   
            var encrypted1 = cipher1.update(req.param('newpassword'), 'utf8', 'hex') + cipher1.final('hex');
            mycon.query(`update login set password=? where username=?`,[encrypted1,req.param('username')],function(err2,results1){
              res.send("new password changed");
            });
          }
        });
        
      });
    });

    app2.get('/changepasswordbutton',function(req,res){
      res.redirect('/faculty_profile?username='+req.param('username')+'&changep=true');
    });

    app2.post('/editprofile', urlencodedParser,function(req,res){
      console.log(req.param('username'));
      console.log(req.body);
      mycon.connect(function(err){
        mycon.query(`UPDATE personaldetails_f SET phoneNo =? ,address=? WHERE faculty_id=?`,[req.param('PhoneNo'),req.param('address'),req.param('username')],function(err1,results){
        });
        res.redirect('/facultyprofile?username='+req.param('username')+'&changep=false');
      });

      
  });

  app2.get('/coursepage',function(req,res){
      console.log(req.param('courseid'));
  });

  app2.get('/autocomplete',function(req,res,next){

    var regex=new RegExp(req.query["term"],'i');
    console.log(regex);
    console.log(req.param('courseid'));
    
    MongoClient.connect(mongoURI, function(err, db) {
      if (err) throw err;
      var dbo = db.db("DigitalCourseFile");
      dbo.collection("FileDetails").find({filename:regex,courseid:req.param('courseid'),facultyid:req.param('username')}).toArray(function(err, result) {
        
        if(result && result.length && result.length>0){
          var results=[];
          result.forEach(user=>{
            let obj={
              id:user._id,
              label: user.filename
            };
            results.push(obj);
          });
          res.jsonp(results);
        }
        db.close();
      });

    });
  
  });


  

}