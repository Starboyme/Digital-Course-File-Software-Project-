var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rajulkrishnankrr@gmail.com',
    pass: 'Nodejs@123'
  }
});

exports.sendmail=function(tomail,otp){

  var mailOptions = {
    from: 'rajulkrishnankrr@gmail.com',
    to: tomail,
    subject: `Digital course Account - ${otp} is your verification code for secure access`,
    text: `
    Hi,\n
    Greetings!\n
    You are just a step away from accessing your Digital Course File account\n
    We are sharing a verification code to access your account. The code is valid for 10 minutes and usable only once.\n
    Once you have verified the code, you'll be prompted to set a new password immediately. This is to ensure that only you have access to your account.\n
    Your OTP: ${otp}\n
    Expires in: 10 minutes\n
    Best Regards,\n
    Team Digital Course File\n
    `
  };
  
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

}