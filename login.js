const cookieParser = require('cookie-parser');
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var m1=require('./email.js');
var path=require('path');
const { urlencoded } = require('express');

//Google Auth library - checks the integrity of the token_ID sent to your server
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
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-post-redirect'));


var otp=0;
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}  

app.post('/login', urlencodedParser, function (req, res) {
    console.log(req.body);
    con.connect(function(err){
        con.query(`select * from login where ( username='${req.body.username}' && password='${req.body.password}' && role='${req.body.logintype}'); `,function(err,results){
            if(results.length == 0){res.send("No admin records with this credentials");}
            else{
                let role;
                if(req.body.logintype=="admin"){role="admin";}
                else if(req.body.logintype=="faculty"){role="faculty"}
                else{role="student"}   
                res.render(role,{username: req.body.username});             
            }
        });
    });        
});

app.post('/f1submit', urlencodedParser, function (req, res) {
    con.connect(function(err){
        con.query(`select * from login where ( username='${req.body.username}' && email='${req.body.email}'); `,function(err,results){
            if(results.length == 0){res.render('forgotpassword',{flag:2.2});}
            else{
                x=getRndInteger(111111,999999);
                m1.sendmail(req.body.email,x);
                res.render('forgotpassword',{flag:2});
            }
        });
    });
});

app.post('/f2submit', urlencodedParser, function (req, res) {
    if(req.body.otp==x){res.render('forgotpassword',{flag:3});}
    else{res.render('forgotpassword',{flag:3.3});}
});

app.post('/newpasswordreset', urlencodedParser, function (req, res) {  

    con.connect(function(err){
        con.query(`update login set password='${req.body.newpassword}' where username="${req.body.username}";`,function(){
            res.render('forgotpassword',{flag:4});
        });
    });
    
});

app.post('/forgotpassword',urlencodedParser,function(req,res){
    res.render('forgotpassword',{flag:1});
});

app.get('/loginpage',function(req,res){
    res.render('login');
});



app.post('/googlelogin', function(req,res)
{
    var token_id = req.body.token;
    console.log(token_id);
    
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
    res.render('admin', {user});
});

// app.get('/protected',checkAuthenticated, function(req,res)
// {
//     res.render('protected');
// });

app.get('/logout', function(req,res)
{
    res.clearCookie('session-token');
    res.redirect(307,'/loginpage');
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