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
module.exports.send1 = async (params) => {
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
      <h1> <a href= ${params.OTP}>Verify now</a> </h1>
      
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
      class="body"
      style="
      background: linear-gradient(#ccc, #fff);
  font: 14px sans-serif;
  padding: 20px;"
      >
      <div
      class="container"
      style=" background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      margin: 26px auto 0;
      max-width: 550px;
      min-height: 300px;
      padding: 24px;
      position: relative;
      width: 80%;"
    >
    
      <h2> ${params.to} has ${params.type1} </h2>
      <hr style="border: 8px solid black;
      border-radius: 5px;" />
      <p style="margin-bottom: 30px; color:red;">${params.midtext} </p>
      <div 
      class="card"
      style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      transition: 0.3s;
      width: 70%;
      border-radius: 5px; "
      <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.link}</h1>
      </div>
      <br/>
      <h2> ${params.to} with request ID of: </h2>
      <h2> ${params.id} </h2>
      
      </div>
      </div>

      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports.notif = async (params) => {
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
      to: "brgytalonuno@gmail.com",
      subject: "BARANGAY TALON UNO",
      html: `
      <div
      class="body"
      style="
      background: linear-gradient(#ccc, #fff);
  font: 14px sans-serif;
  padding: 20px;"
      >
      <div
      class="container"
      style=" background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      margin: 26px auto 0;
      max-width: 550px;
      min-height: 300px;
      padding: 24px;
      position: relative;
      width: 80%;"
    >
    
      <h2> ${params.to} has ${params.type1} </h2>
      <hr style="border: 8px solid black;
      border-radius: 5px;" />
      <p style="margin-bottom: 30px; color:red;">${params.midtext} </p>
      <div 
      class="card"
      style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      transition: 0.3s;
      width: 70%;
      border-radius: 5px; "
      <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.link}</h1>
      </div>
      <br/>
      <h2> ${params.to} with request ID of: </h2>
      <h2> ${params.id} </h2>
      
      </div>
      </div>

      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};