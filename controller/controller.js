const express = require("express");
const router = express.Router();
const { User, Reports, Request, auth, blotters } = require("../db/model");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const dbcon = require("../db/dbcon");
const { sendMail, send1, admin12, notif } = require("../auth/emailsender");
const cloudinary = require("../auth/cloudinary");
const { generateOTP } = require("../auth/oth");

const moment = require("moment-timezone");
//removed tz
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
//tz("Asia/Manila")
const request = async (req, res) => {
  const {
    type,
    irbi,
    date,
    region,
    precint,
    province,
    city,
    contact,
    brgy,
    lastname,
    firstname,
    middlename,
    nickname,
    age,
    gender,
    birthday,
    status,
    birthplace,
    height,
    weight,
    presentadd,
    provinceadd,
    contactname,
    relationship,
    address,
    number,
    res1,
  } = req.body;
  const uuid = require("uuid");
  console.log(type, irbi, date);
  const RequestTime = moment().tz("Asia/Manila").format();
  const ref = uuid.v4();
  await dbcon();
  console.log("request");
  await admin12({
    to: req.user.email,
    type: "Request",
    type1: "submitted",
    link: "https://barangay-talonuno.vercel.app/request",
    midtext: "Request has been send to your barangay",
    id: ref,
  });
  try {
    const result = await Request.updateOne(
      { email: req.user.email },
      {
        $push: {
          request: [
            {
              ref,
              requestTime: RequestTime,
              type,
              irbi: Number(irbi),
              date,
              region,
              precint: Number(precint),
              province,
              city,
              contact: Number(contact),
              brgy,
              lastname,
              firstname,
              middlename,
              nickname,
              age: Number(age),
              gender,
              birthday,
              status,
              birthplace,
              height: Number(height),
              weight: Number(weight),
              presentadd,
              provinceadd,
              contactname,
              relationship,
              address,
              number: Number(number),
              res1,
            },
          ],
          $inc: { irbi: 1 },
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
//.tz("Asia/Manila")
const report1 = async (req, res) => {
  const { name, address, addressdetail, email, report, Image } = req.body;
  await dbcon();
  const uuid = require("uuid");
  const ReportTime = moment().tz("Asia/Manila").format();
  console.log("report");
  const ref = uuid.v4();
  try {
    const upload = await cloudinary.uploader.upload(Image, {
      folder: `report/`,
    });
    const rep = await Reports.findOneAndUpdate(
      { email: req.user.email },
      {
        $push: {
          reports: [
            {
              ReportTime,
              ref,
              name,
              address,
              addressdetail,
              report,
              Image: `https://res.cloudinary.com/doqwvrp29/v1/${upload.public_id}`,
            },
          ],
        },
      },
      { new: true, upsert: true }
    );
    await admin12({
      to: email,
      type: "Report",
      type1: "submitted",

      link: "https://barangay-talonuno.vercel.app/report",
      midtext: "Report Submitted to local Authority",
      id: ref,
    });
    await notif({
      to: req.user.firstname,
      type: "Report",
      type1: "submitted",

      link: "https://barangay-talonuno.vercel.app/report",
      midtext: "Someone Submitted a report please process immediately",
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

const blotter1 = async (req, res) => {
  const {
    complainant,
    date,
    address,
    contact,
    complainedFirstname,
    complainedLastname,
    complainedMiddlename,
    complainedAddress,
    complainedAge,
    description,
  } = req.body;
  await dbcon();
  const uuid = require("uuid");
  const ReportTime = moment().tz("Asia/Manila").format();

  const ref = uuid.v4();
  try {
    const rep = await blotters.findOneAndUpdate(
      { email: req.user.email },
      {
        $push: {
          blotter: [
            {
              ref,
              complainant,
              date,
              address,
              contact: Number(contact),
              complainedFirstname,
              complainedLastname,
              complainedMiddlename,
              complainedAddress,
              RequestTime: ReportTime,
              complainedAge: Number(complainedAge),
              description,
            },
          ],
        },
      },
      { new: true, upsert: true }
    );
    await admin12({
      to: req.user.email,
      type: "Blotter",
      type1: "submitted",
      link: "https://barangay-talonuno.vercel.app/blotter",
      midtext: "Report Submitted to barangay record ",
      id: ref,
    });
    await notif({
      to: req.user.firstname,
      type: "Blotter",
      type1: "submitted",

      link: "https://barangay-talonuno.vercel.app/main/blotter",
      midtext: "Someone Submitted a blotter please process immediately",
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
      image: user.image,
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
  await send1({
    to: email,
    OTP: "https://barangay-talonuno.vercel.app/accountconfirmed",
    mid: "Please click the link provided below to verify that your now a member of talon uno family ",
    sub: "Talon Uno Register",
  });
  await dbcon();

  const exist = await User.findOne({ email });
  console.log(exist);
  const gen = await generateOTP();

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
  const { image, number } = req.body;

  await dbcon();
  console.log("attempting to update");
  try {
    const upload = await cloudinary.uploader.upload(image, {
      folder: `user/`,
    });

    const updp = await User.findOneAndUpdate(
      { email: req.user.email },

      {
        $set: {
          image: `https://res.cloudinary.com/doqwvrp29/v1/${upload.public_id}`,
          number,
        },
      },
      {
        new: true,
      }
    );

    console.log("update done");

    return res.status(200).json({
      success: true,
      image: updp.image,
      number: updp.number,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      msg: e,
    });
  }
};

const changepass = async (req, res) => {
  const { password, newpassword } = req.body;

  await dbcon();
  {
    const user = await User.findOne({ email: req.user.email }).select(
      "+password"
    );

    const pass = await bcrypt.compare(password, user.password); //password
    if (!pass) return res.status(401).json({ login: "incorrect password" });
    const hashPassword = await bcrypt.hash(newpassword, 10);
    const update = await User.findOneAndUpdate(
      { email: req.user.email },
      { $set: { password: hashPassword } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
    });
  }
};

const resetpasswordtoken = async (req, res) => {
  const { email } = req.body;

  try {
    await dbcon();

    const user = await User.findOne({ email });
    console.log(user);
    // generate url for reset password
    const token = await jwt.sign(
      { id: user._id },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "1h" }
    );

    if (email === user.email) {
      // send url to email
      await admin12({
        to: email,
        type: "Reset Password",
        link: "https://barangay-talonuno.vercel.app/reset=password/"+token,
        midtext: "you have 1hr to change your password",
      });

      return res.json({
        success: true,
        msg: "Email has been sent! Please check your inbox.",
      });
    }
  } catch (error) {
    console.log("resetPasswordurl: ", error);
    return res
      .status(500)
      .json({ success: false, error: error, msg: "Internal Server Error!" });
  }
};
const verifyUrlReset = async (req, res) => {
  const { token } = req.body;

  try {
    // verify token
    await jwt.verify(
      token,
      `${process.env.JWT_SECRET}`,
      async (err, decode) => {
        // redirection error
        if (err) {
          if (err?.message === "jwt expired")
            return res.json({ success: false, msg: "Token has expired!" });
          if (err?.message === "jwt malformed")
            return res.json({ success: false, msg: "Invalid token!" });
        }

        // token verified generate new token to reset expiry
        const resetToken = await jwt.sign(
          { id: decode.id },
          `${process.env.JWT_SECRET}`,
          { expiresIn: "1d" }
        );

        return res.json({ success: true, msg: "Token verified!", resetToken });
      }
    );
  } catch (error) {
    console.log("verifyUrl: ", error);
    return res
      .status(500)
      .json({ success: false, error: error, msg: "Internal Server Error!" });
  }
};
const resetPassword = async (req, res) => {
  const { newPassword, resetToken } = req.body;
  try {
    await dbConn();

    await jwt.verify(
      resetToken,
      `${process.env.JWT_SECRET}`,
      async (err, decode) => {
        // redirection error
        if (err) {
          if (err?.message === "jwt expired")
            return res.json({ success: false, msg: "Token has expired!" });
          if (err?.message === "jwt malformed")
            return res.json({ success: false, msg: "Invalid token!" });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await User.findOneAndUpdate(
          { _id: decode.id },
          { $set: { password: hashPassword } },
          { new: true }
        );

        return res.json({ success: true, msg: "Password has been reset!" });
      }
    );
  } catch (error) {
    console.log("reset password: ", error);
    return res
      .status(500)
      .json({ success: false, error: error, msg: "Internal Server Error!" });
  }
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
  changepass,
  verify,
  verifyotp,
  updatepage,
  resetpasswordtoken,
  genera2,
  blotter1,
  resetPassword,
  verifyUrlReset,
};
