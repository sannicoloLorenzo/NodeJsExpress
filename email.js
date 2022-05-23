const nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "106eca19f691e8",
      pass: "d0edcd275cd757"
    }
  });

module.exports=transport;