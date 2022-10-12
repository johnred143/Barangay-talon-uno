const express = require("express");
const router = express.Router();
const { User, Reports, Request, auth } = require("../db/model");
const bcrypt = require("bcrypt");
const Mail = require("../auth/sms");
const jwt = require("jsonwebtoken");
const dbcon = require("../db/dbcon");
const { sendMail, send } = require("../auth/emailsender");

const { generateOTP } = require("../auth/oth");
const { sendSms } = require("../auth/sms");

const moment = require("moment-timezone");

const test = (req, res) => {
  console.log(req.user);
  // return res.send("Server Running...");
  return res.json({ test: "message" });
};
const main = (req, res) => {
  return res.json({ email: "asdasd" });
};

const about = (req, res) => {
  return res.json({ message: "about us" });
};
const contact = (req, res) => {
  if ((token = generateAccessToken)) {
    return res.status(200).json({ message: "login success" });
  }
};

const request = async (req, res) => {
  const { type, name, address, email, phone, purpose } = req.body;
  const uuid = require("uuid");

  const ref = uuid.v4();
  await dbcon();
  console.log("request");
  await send({
    to: email,
    type: "Request",
    link: "https://barangay-talonuno.vercel.app/request",
    midtext: "Request has been send to your barangay",
    id: ref,
  });
  try {
    const result = await Request.updateOne(
      { email: req.user.email },
      {
        $push: {
          request: [{ ref, type, name, address, email, phone, purpose }],
        },
      },
      { new: true, upsert: true }
    );
    console.log("request done");

    return res.status(200).json({
      success: true,
      msg: result,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      msg: e,
    });
  }
};

// report page
const report1 = async (req, res) => {
  const { name, address, addressdetail, email, report, Image } = req.body;
  await dbcon();
  const uuid = require("uuid");
  console.log("report");
  const ref = uuid.v4();
  try {
    const rep = await Reports.findOneAndUpdate(
      { email: req.user.email },
      {
        $push: {
          reports: [{ ref, name, address, addressdetail, report, Image }],
        },
      },
      { new: true, upsert: true }
    );
    await send({
      to: email,
      type: "Report",
      link: "https://barangay-talonuno.vercel.app/report",
      midtext: "Report Submitted to local Authority",
      id: ref,
    });
    

    console.log("report done");

    return res.status(200).json({
      success: true,
      msg: rep,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      msg: e,
    });
  }
};

// token this where the token generate and edit how long the token will last
async function generateAccessToken(email) {
  return await jwt.sign(email, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
}

const login = async (req, res) => {
  await dbcon();
  {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(401).json({ login: "email not register" }); //email

    const pass = await bcrypt.compare(password, user.password); //password
    if (!pass) return res.status(401).json({ login: "incorrect password" });

    const token = await generateAccessToken({
      email: user.email,
      _id: user._id,
    });
    const phtz = moment().tz("Asia/Manila").format();

    const gen = await generateOTP();

    await sendMail({
      to: email,
      OTP: gen,
      mid: "Please enter the sign in OTP to get started",
      sub: "Talon Uno Login OTP",
    });
    // console.log(user._id);

    console.log(user);

    const otpss = await auth.findOneAndUpdate(
      { email },
      {
        $set: {
          created: phtz,
          otp: gen,
          email,
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      login: "success",
      token,
      fullname: user.firstname + " " + user.lastname,
      email: user.email,
      contact: user.number,
      address: user.street + "," + user.barangay + "," + user.city,
    }); //password email match
  }
};

const regs = async (req, res) => {
  const {
    firstname,
    middlename,
    lastname,
    number,
    email,
    city,
    barangay,
    street,
    gender,
    password,
    birthday,
  } = req.body;

  await dbcon();

  const exist = await User.findOne({ email });
  console.log(exist);
  const gen = await generateOTP();

  await sendMail({
    to: email,
    OTP: "https://barangay-talonuno.vercel.app/accountconfirmed",
    mid: "Please click the link provided below to verify that your now a member of talon uno family ",
    sub: "Talon Uno Register",
  });
  if (exist) return res.json({ error: "username is already used!!!!" });
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await new User({
    firstname,
    middlename,
    lastname,
    number: Number(number),
    email,
    city,
    barangay,
    street,
    gender,
    password: hashPassword,
    birthday,
    token: gen,
  }).save();

  // const regToken = await generateAccessToken(user.email);
  // console.log("register: ", user.email);

  return res.status(200).json({
    success: true,
    message: "registered",
    RegisterToken: gen,
    // regToken,
  });
};

const genera2 = async (req, res) => {
  const { email, otp } = req.body;
  await dbcon();
  {
    const otp1 = await auth.findOne({ email: email });
    const user = await User.findOne({ email }).select("");

    if (otp !== otp1.otp)
      return res.status(401).json({ login: "otp incorrect" });
    console.log(otp1.otp);

    return res.status(200).json({
      Login: "success",
      fullname: user.firstname + " " + user.lastname,
      email: user.email,
      contact: user.number,
      address: user.street + "," + user.barangay + "," + user.city,
    });
  }
};

const verifyotp = async (req, res) => {
  const token = req.body;

  console.log(vertoken);
  if (vertoken === token) {
    res.json({ token: true });
  } else res.json({ token: false });
};

const verify = async (req, res) => {
  const { email } = req.body;
  const emailFromToken = req.user.email;

  if (email === emailFromToken) {
    return res.json({ verify: true });
  } else return res.sendStatus(403).json({ verify: false });

  // jwt.verify(
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5yZWQxNDMuanJAZ21haWwuY29tIiwiaWF0IjoxNjYxNDI5ODAzLCJleHAiOjE2NjQwMjE4MDN9.R7in9WecjwvHp8uu8OYzgMZSsHHHhpXx8YuRmzAN2Ig",
  //     process.env.TOKEN_SECRET,
  //     function (err, user) {
  //         console.log(user);

  //         return res.json({ user, user: req.user.email });
  //     }
  // );
};

const updatepage = async (req, res) => {
  const { firstname, middlename, lastname, number, street } = req.body;

  await dbcon();
  console.log("attempting to update");
  try {
    const updp = await User.findOneAndUpdate(
      { email: req.user.email },

      { $set: { firstname, middlename, lastname, number } }
    );
    console.log("update done");

    return res.status(200).json({
      success: true,
      firstname,
      middlename,
      lastname,
      number,
      street,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      msg: e,
    });
  }
};

const sms2 = async (req, res) => {
  const accountSid = process.env.accountSid;
  const authToken = process.env.authToken;
  const client = require("twilio")(accountSid, authToken);
  const { number } = req.body;

  const messages = client.messages.create({
    body: "testing",
    from: "+18288271391",
    to: "09266027854",
  });

  // const messages = sendSms();
};

module.exports = {
  report1,
  login,
  regs,
  test,
  main,
  about,
  contact,
  request,
  // otp,
  verify,
  verifyotp,
  updatepage,
  sms2,
  genera2,
};
