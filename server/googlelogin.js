var express = require('express');
var app = express();
app.disable("x-powered-by");

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
  app.set('view engine','ejs');
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(require('express-post-redirect'));
  app.use(express.json());
  app.use(cookieParser());

 module.exports = function(app){
   
app.get('/dashboard', checkAuthenticated, function(req,res)
{
    let user = req.user;
    mycon.connect(function(err){
        mycon.query(`select * from login where email=?`,[user.email],function(err1,results){
            if(results.length==0){res.redirect('/loginpage');}
            else{
                if(results[0].role=="admin"){role="admin_portal_page";res.render(role,{username:req.body.username,course:false,faculty:false,filedetails:false});}
                else if(results[0].role=="faculty"){role="faculty_portal_page";res.render(role,{username: req.body.username,course:false,addcourse:false,removecourse:false});}
                else{console.log("hello");role="student_portal_page";res.render(role,{username: req.body.username,course:false});}
            }
        });
    });
    
});

app.get('/logout', function(req,res)
{
    res.clearCookie('session-token');
    res.redirect('/loginpage');
});


function checkAuthenticated(req, res, next)
{
    let token_id = req.cookies['session-token'];

    let user = {};
    async function verify() 
    {
        const ticket = await client.verifyIdToken(
        {
            idToken: token_id,
            audience: CLIENT_ID, 
        });
        const payload = ticket.getPayload(); //stores user details
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
    verify()
    .then(function()
    {
        req.user = user;
        next();
    }).
    catch(function(err)
    {
        res.redirect('/loginpage');
    });
}
 }
