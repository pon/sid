const AWS = require('aws-sdk')
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  SES: new AWS.SES()
})

module.exports.sendMail = (to, from, subject, html, next) => {
  transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  }, next)
}
