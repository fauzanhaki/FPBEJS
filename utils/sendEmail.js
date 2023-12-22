const nodemailer = require('nodemailer');
const link = process.env.FORGOT_PASSWORD;
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
  }
});

const sendOTPByEmail = (email, otp, callback) => {
  const mailOptions = {
    from: 'System@gmail.com',
    to: email,
    subject: 'Send OTP',
    text: `Use the following OTP to complete your verification: ${otp}.`
  };

  transporter.sendMail(mailOptions, callback);
};

const sendLinkByEmail = (email, resetToken,callback) => {
  const mailOptions = {
    from: 'System@gmail.com',
    to: email,
    subject: 'Send Link Reset Password',
    html: `Click this <a href="${link}/${resetToken}">link </a> for reset your password.`
  };
  transporter.sendMail(mailOptions, callback);
}

const sendWarnByEmail = (email, callback) => {
  const mailOptions = {
    from: 'System@gmail.com',
    to: email,
    subject: 'Send Link Reset Password',
    text: `Your password has been changed. See your account for check it`
  };
  transporter.sendMail(mailOptions, callback);
}

module.exports = { sendOTPByEmail, sendLinkByEmail, sendWarnByEmail };
