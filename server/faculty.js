var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
const { urlencoded } = require('express');
const url = require('url');


var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "digitalcoursefile_db"
  });


var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(require('express-post-redirect'));
app.use(express.json());

module.exports = function(app){
    app.get('/displaycourses',function(req,res){
        console.log(req.param('username'));
        con.connect(function(err){
        con.query(`select * from fc_conn where faculty_id='F.001';`,function(err,results){
            console.log(results);
            res.render('faculty_portal_page',{username:req.param('username'),course:results});
        });
      });
    });

    app.get('/coursepage',function(req,res){
        console.log(req.param('courseid'));
    });

}