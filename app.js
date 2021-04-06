const cookieParser = require('cookie-parser');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

require('./server/login.js')(app);
require('./server/faculty.js')(app);
require('./server/student.js')(app);
// require('./server/googlelogin.js')(app);
const { urlencoded } = require('express');
var mysql = require('mysql');

// Google Auth library - checks the integrity of the token_ID sent to your server
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '702568242650-7mth13f0ce7gfdbp3jqkn731dquqi45q.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);


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
app.use(cookieParser());

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
        const userid = payload['sub'];
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
    con.connect(function(err){
        con.query(`select * from login where email='${user.email}';`,function(err,results){
            if(results.length==0){res.redirect('/loginpage');}
            else{
                if(results[0].role=="admin"){res.render('admin', {username: results[0].username});}
                else if(results[0].role=="faculty"){res.render('faculty_portal_page', {username: results[0].username,course:false});}
                else{res.render('student', {username: results[0].username});}
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

var server = app.listen(3000, function () {});