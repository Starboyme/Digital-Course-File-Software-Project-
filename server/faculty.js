var express = require('express');
var app = express();
var mysql = require('mysql');
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


var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "digitalcoursefile_db"
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
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(require('express-post-redirect'));
app.use(express.json());
app.use(methodOverride('_method'));


const storage1 = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    // console.log("raj");
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
    // console.log("hi");
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
    // console.log("hi");
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
    // console.log("hi");
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
const upload1 = multer({ storage: storage1 });
const upload2 = multer({ storage: storage2});
const upload3 = multer({ storage: storage3});
const upload4 = multer({ storage: storage4});


module.exports = function(app){
    app.get('/displaycourses',function(req,res){
        console.log(req.param('username'));
        con.connect(function(err){
        con.query(`select * from fc_conn where faculty_id='F.001';`,function(err,results){
            console.log(results);
            res.render('faculty_portal_page',{username:req.param('username'),course:results,type:0,files:false});
        });
      });
    });

    app.get('/coursepage',function(req,res){
        res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:0,files:false});
    });

    app.get('/type',function(req,res){
      res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type='+req.param('a'));
      // res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:req.param('a'),files:false});
    });

    app.post('/uploadquestionpaper',upload1.single('file'),(req, res) => {
        res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type=1');
        // res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:1});
    });
    app.post('/uploadprojectmaterial', upload2.single('file'), (req, res) => {
        res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type=2');
        // res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:2});
    });
    app.post('/uploadclassmaterial', upload3.single('file'), (req, res) => {
        res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type=3');
        // res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:3});
    });
    app.post('/uploadgrades', upload4.single('file'), (req, res) => {
         res.redirect('/displayfiles?username='+req.param('username')+'&courseid='+req.param('courseid')+'&type=4');
        // res.render('faculty_course_page',{username:req.param('username'),courseid:req.param('courseid'),type:4});
    });

    app.get('/displayfiles', (req, res) => {

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

    app.get('/file/:filename', (req, res) => {
      gfs1.files.findOne({ filename: req.params.filename }, (err, file) => {
          const readstream = gfs1.createReadStream(file.filename);
          readstream.pipe(res);
      });
    });

    app.get('/facultyback', (req, res) => {
       res.render('faculty_portal_page',{username:req.param('username'),course:false});
    });

    app.post('/files/:id', (req, res) => {

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

}