const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    tls:{
      rejectUnauthorized: false,
    },
    auth: {
      user: "carloscumaco5@gmail.com", // generated ethereal user
      pass: "jhkwusgaadmmlyfg", // generated ethereal password
    },
  });

  transporter.verify().then(()=> {
    console.log('ready for send emails');
  })

  module.exports = {transporter}