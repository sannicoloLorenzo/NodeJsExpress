const nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "biblioteca.lorenzo31@gmail.com",
      //pass: "Biblioteca31+"
      pass: "btvmjddqpgcuxvuf"
    }
  });

transport.verify().then(console.log).catch(console.error);

module.exports=transport;