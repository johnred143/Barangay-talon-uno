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
      subject: params.sub,
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Welcome to the Barangay Talon uno.</h2>
          <h4>You are officially In ✔</h4>
          <p style="margin-bottom: 30px;">${params.mid}</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
          
     </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports.send = async (params) => {
  const porter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  try {
    let info = await porter.sendMail({
      from: process.env.EMAIL,
      to: params.to,
      subject: "BARANGAY TALON UNO",
      html: `
      <div
      class="container"
      style="max-width: 90%; margin: auto; padding-top: 20px"
    >
      <h2> ${params.sub} submitted</h2>
  
      <p style="margin-bottom: 30px;">${params.mid} </p>
      <h1> <a href= ${params.OTP}>Verify now</a>  </h1>
      
 </div>
     
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports.admin12 = async (params) => {
  const porter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  try {
    let info = await porter.sendMail({
      from: process.env.EMAIL,
      to: params.to,
      subject: "BARANGAY TALON UNO",
      html: `
      <div
      class="container"
      style="max-width: 90%; margin: auto; padding-top: 20px"
    >
      <h2> ${params.type} has ${params.type1} </h2>
  
      <p style="margin-bottom: 30px;">${params.midtext} </p>
      <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.link}</h1>
      <h1> Your Request ID is: ${params.id} </h1>
      
 </div>
     
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
