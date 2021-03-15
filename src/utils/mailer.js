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
    from: '"FAP" <'+ process.env.EMAIL +'>', 
    to: email, 
    subject: "Hola "+ username +"!. bienvenido a FAP! ✔",
    text:"Mira la información de tus jugadores, equipos y torneos favoritos, encontraras estadísticas relevantes con los ultimos algoritmos especializados que te darán probabilidades sumamente precisas."+
    "\nRegistrate como apostador en tu perfil y sumérgete en este mundo de fútbol apuestas! $"+  
    "\nCon FAP, tus sueños están a un par de clics de distancia."+
    "!\n\nDesarrolladores: Jesus, Ricardo y Heberto"
  });
}

module.exports = {
  mail
};