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

require('dotenv').config();

var algorithm = 'aes256';
var key = 'password';

const mycon = mysql.createConnection({
  host     : process.env.MYSQL_URL,
  user     : process.env.MYSQL_USERNAME,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE_ACC
});

const mongoURI='mongodb://127.0.0.1:27017';
const conn = mongoose.createConnection("mongodb://localhost:27017/test", { useNewUrlParser: true });
let gfs1;
let gfs2;
let gfs3;
let gfs4;

conn.once('open', () => {
  gfs1 = Grid(conn.db, mongoose.mongo);
  gfs2 = Grid(conn.db, mongoose.mongo);
  gfs3 = Grid(conn.db, mongoose.mongo);
  gfs4 = Grid(conn.db, mongoose.mongo);
  gfs1.collection('Questionpaper');
  gfs2.collection('ProjectMaterials');
  gfs3.collection('ClassMaterials');
  gfs4.collection('Grades');
});



var urlencodedParser = bodyParser.urlencoded({ extended: true });
app2.set('view engine','ejs');
app2.use(bodyParser.urlencoded({extended: true}));
app2.use(express.static(path.join(__dirname,'public')));
app2.use(bodyParser.json());
app2.use(require('express-post-redirect'));
app2.use(express.json());
app2.use(methodOverride('_method'));


const storage1 = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'Questionpaper'
        };
        resolve(fileInfo);
    });
  }
});
const storage2 = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'ProjectMaterials'
        };
        resolve(fileInfo);
    });
  }
});
const storage3 = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'ClassMaterials'
        };
        resolve(fileInfo);
    });
  }
});
const storage4 = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'Grades'
        };
        resolve(fileInfo);
    });
  }
});
const upload1 = multer({ storage: storage1, limits: { fileSize: 8000000} });
const upload2 = multer({ storage: storage2, limits: { fileSize: 8000000}});
const upload3 = multer({ storage: storage3, limits: { fileSize: 8000000}});
const upload4 = multer({ storage: storage4, limits: { fileSize: 8000000}});


module.exports = function(app2){
    app2.get('/displaycourses',function(req,res){
        console.log(req.param('username'));
        mycon.connect(function(err){
        mycon.query(`select * from fc_conn where faculty_id=?`,[req.param('username')],function(err1,results){
            console.log(results);
            res.render('faculty_portal_page',{username:req.param('username'),course:results,addcourse:false});
        });
      });
    });

    app2.get('/showcourses',function(req,res){
      mycon.connect(function(err){
        mycon.query(`SELECT t1.course_id FROM course t1 LEFT JOIN (select * from fc_conn where faculty_id=?) t2 ON t2.course_id = t1.course_id WHERE t2.course_id IS NULL`,[req.param('username')],function(err1,results){
            console.log(results);
            res.render('faculty_portal_page',{username:req.param('username'),course:false,addcourse:results});
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

    app2.get('/coursepage',function(req,res){
        res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:0,files:false});
    });

    app2.get('/type',function(req,res){
      res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type='+req.param('a'));
    });

    app2.post('/uploadquestionpaper',upload1.single('file'),(req, res) => {
        res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type=1');
    });
    app2.post('/uploadprojectmaterial', upload2.single('file'), (req, res) => {
        res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type=2');
    });
    app2.post('/uploadclassmaterial', upload3.single('file'), (req, res) => {
        res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type=3');
    });
    app2.post('/uploadgrades', upload4.single('file'), (req, res) => {
         res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type=4');
    });

    app2.get('/displayfiles', (req, res) => {

      if(req.param('type')==1){
          gfs1.files.find().toArray((err, files) => {
            var x;
            if (!files || files.length === 0) {x=false}
            else {x=files}
            res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:1,files:x});
          });
      }
      else if(req.param('type')==2){
          gfs2.files.find().toArray((err, files) => {
            var x;
            if (!files || files.length === 0) {x=false}
            else {x=files}
            res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:2,files:x});
          });
      }
      else if(req.param('type')==3){
          gfs3.files.find().toArray((err, files) => {
            var x;
            if (!files || files.length === 0) {x=false}
            else {x=files}
            res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:3,files:x});
          });
      }
      else{
          gfs4.files.find().toArray((err, files) => {
            var x;
            if (!files || files.length === 0) {x=false}
            else {x=files}
            res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:4,files:x});
          });
      }

     
      
    });

    app2.get('/file/:filename', (req, res) => {
      gfs1.files.findOne({ filename: req.params.filename }, (err, file) => {
          const readstream = gfs1.createReadStream(file.filename);
          readstream.pipe(res);
      });
    });

    app2.get('/facultyback', (req, res) => {
       res.render('faculty_portal_page',{username:req.param('username'),course:false,addcourse:false});
    });

    app2.get('/files/:id', (req, res) => {

      if(req.param('type')==1){
        gfs1.remove({ _id: req.params.id, root: 'Questionpaper' }, (err, gridStore) => {
          if (err) {
            return res.status(404).json({ err: err });
          }
          res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type='+req.param('type'));
        });
      }
      else if(req.param('type')==2){
        gfs2.remove({ _id: req.params.id, root: 'ProjectMaterials' }, (err, gridStore) => {
          if (err) {
            return res.status(404).json({ err: err });
          }
          res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type='+req.param('type'));
        });
      }
      else if(req.param('type')==3){
        gfs3.remove({ _id: req.params.id, root: 'ClassMaterials' }, (err, gridStore) => {
          if (err) {
            return res.status(404).json({ err: err });
          }
          res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type='+req.param('type'));
        });
      }
      else{
        gfs4.remove({ _id: req.params.id, root: 'Grades' }, (err, gridStore) => {
          if (err) {
            return res.status(404).json({ err: err });
          }
          res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type='+req.param('type'));
        });
      }
     
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
      res.redirect('/facultyprofile?username='+req.param('username')+'&changep=true');
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


  

}