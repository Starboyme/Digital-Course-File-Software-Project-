const cookieParser = require('cookie-parser');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
const cors= require('cors');

require('dotenv').config();

require('./server/login.js')(app);
require('./server/faculty.js')(app);
require('./server/student.js')(app);
require('./server/admin.js')(app);
const { urlencoded } = require('express');
const mysql = require('mysql');

// Google Auth library - checks the integrity of the token_ID sent to your server
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '702568242650-7mth13f0ce7gfdbp3jqkn731dquqi45q.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

let corsOptions = {
    origin: 'trustedwebsite.com' // Compliant
  };

const mycon = mysql.createConnection({
    host     : process.env.MYSQL_URL,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD
  });

var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(require('express-post-redirect'));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.post('/googlelogin', urlencodedParser, function(req,res)
{
    var token_id = req.body.token;
    console.log(req.body);
    
    async function verify() 
    {
        const ticket = await client.verifyIdToken(
        {
            idToken: token_id,
            audience: CLIENT_ID, 
        });
        const payload = ticket.getPayload(); //payload stores user details
        console.log(payload);
    }
    verify()
    .then(function()
    {
        res.cookie('session-token',token_id);
        res.send('success');
    }).
    catch(console.error);
});

app.get('/dashboard', checkAuthenticated, function(req,res)
{
    let user = req.user;
    mycon.connect(function(err){
        mycon.query(`select * from login where email=?`,[user.email],function(err1,results){
            if(results.length==0){res.redirect('/loginpage');}
            else{
                mycon.query(`(select firstName from personaldetails_s where student_id=?) union (select firstName from personaldetails_f where faculty_id=?)`,[results[0].username,results[0].username],function(err1,results2){
                    if(results[0].role=="admin"){let role="admin_portal_page";res.render(role,{username:results[0].username,course:false,faculty:false,filedetails:false});}
                    else if(results[0].role=="faculty"){let role="faculty_portal_page";res.render(role,{username: results[0].username,facultyname:results2[0].firstName,course:false,addcourse:false,removecourse:false});}
                    else{let role="student_portal_page";res.render(role,{username: results[0].username,studentname:results2[0].firstName,course:false});}    
                });  
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
        const payload = ticket.getPayload();
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

var server = app.listen(3000, function () {console.log("Connected Successfully")});
module.exports.app = app;