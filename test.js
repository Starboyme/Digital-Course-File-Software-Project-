var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rajulkrishnankrr@gmail.com',
    pass: 'Nodejs@123'
  }
});

var mailOptions = {
  from: 'rajulkrishnankrr@gmail.com',
  to: 'sureshjagan99notout@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy buddy!'
};

for(let i=0;i<50;i++){
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

