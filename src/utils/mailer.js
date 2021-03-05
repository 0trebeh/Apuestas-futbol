const nodemailer = require("nodemailer");
require('dotenv').config();

const mail = async (username, email) => {

  const transporter = nodemailer.createTransport({
    host: process.env.HOSTMAIL,
    port: process.env.PORTMAIL,
    secure: process.env.SECURE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    },
  });


  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Your Forms" <'+ process.env.EMAIL +'>', 
    to: email, 
    subject: "Hello "+ username +"!. Welcome to your forms! ✔",
    text: "Congratulations your registration in your forms was successful! \nstart creating your forms without limits!\n\nAutors: Clemente and Heberto"
  });
}

module.exports = {
  mail
};