var express = require('express');
var app1 = express();
app1.disable("x-powered-by");

let helmet = require("helmet");
let app2 = express();
app2.use(helmet.hidePoweredBy());


const mysql = require('mysql');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const { urlencoded } = require('express');

require('dotenv').config();

const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '702568242650-7mth13f0ce7gfdbp3jqkn731dquqi45q.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const mycon = mysql.createConnection({
    host     : process.env.MYSQL_URL,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE_ACC
  });

  var urlencodedParser = bodyParser.urlencoded({ extended: true });
  app2.set('view engine','ejs');
  app2.use(bodyParser.urlencoded({extended: true}));
  app2.use(bodyParser.json());
  app2.use(require('express-post-redirect'));
  app2.use(express.json());
  app2.use(cookieParser());

 module.exports = function(app){


app.get('/logout', function(req,res)
{
    res.clearCookie('session-token');
    res.redirect('/loginpage');
});


}
