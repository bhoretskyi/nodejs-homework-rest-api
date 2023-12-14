const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env;
const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};
const transport = nodemailer.createTransport(nodemailerConfig);
// const email = {
//   from: UKR_NET_EMAIL,
//   to: "tewejar187@anawalls.com",
//   subject: "Test email",
//   html: "<strong> test email bho</strong>",
// };
const sendEmail = data => {
    const email = {...data, from: UKR_NET_EMAIL}
    return transport.sendMail(email)

}
// transport
//   .sendMail(email)
//   .then(() => console.log("email send success"))
//   .catch((error) => console.log(error.message));
module.exports = {
    sendEmail
}