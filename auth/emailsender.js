const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports.sendMail = async (params) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: params.to,
      subject: "Hello ✔",
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Welcome to the club.</h2>
          <h4>You are officially In ✔</h4>
          <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
          <a href="https://www.facebook.com/">click me</a>
     </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
