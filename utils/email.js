/* eslint-disable prettier/prettier */
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "12f23e7b456b82",
      pass: "14a2a3b1e97c16",
    },

    // Activate in gmail "less secure app" option
  });

  // 2) Define the email options

  const mailOptions = {
    from: "admin <admin@gmail.co>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
