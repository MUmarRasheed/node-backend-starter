
const config = require("config");
const path = require("path");
const nodemailer = require("nodemailer");

async function sendEmail(to, from, html , data, attachments , subject , text) {

  var transporter = nodemailer.createTransport({
    service: config.mailService,
    auth: {
      user: config.email,
      pass: config.password,
    },
  });

  let payload = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
    data: data
  }
  if (attachments.length !== 0){
    payload.attachments = attachments
  }

  let info = await transporter.sendMail(payload);

  return info;
}

module.exports = sendEmail;
