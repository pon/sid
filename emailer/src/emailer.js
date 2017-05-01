const AWS = require('aws-sdk')
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  SES: new AWS.SES()
})

module.exports.sendMail = (to, from, subject, text, next) => {
  transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    text: text
  }, next)
}
