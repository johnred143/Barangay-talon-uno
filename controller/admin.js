const express = require("express");
const router = express.Router();
const {
  User,
  Reports,
  Request,
  blotters,
  admin,
  History,
} = require("../db/model");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const dbcon = require("../db/dbcon");
const { admin12 } = require("../auth/emailsender");
const { request } = require("express");
const log = async (req, res) => {
  await dbcon();
  {
    const reqlog = await Request.find();

    const user1 = await User.find();
    const history = await History.find();
    const replog = await Reports.find();
    const blotlog = await blotters.find();
    const sumreq = reqlog.map((i) => i.request.length).reduce((a, b) => a + b);
    const sumrep = replog.map((i) => i.reports.length).reduce((a, b) => a + b);

    const sumblot = blotlog
      .map((i) => i.blotter.length)
      .reduce((a, b) => a + b);
    const user = user1.length;

    const penrep = replog
      .map((i) => i.reports.filter((rep) => rep.process === "Pending").length)
      .reduce((a, b) => a + b);
    const penreq = reqlog
      .map((i) => i.request.filter((req) => req.process === "Pending").length)
      .reduce((a, b) => a + b);
    const penblot = blotlog
      .map((i) => i.blotter.filter((blot) => blot.process === "Pending").length)
      .reduce((a, b) => a + b);

    const total = penrep + penreq + penblot;
    const rep = await Reports.find();
    const sortreport = rep.map((i) => ({
      ...i.toObject(),
      reports: i.reports.sort(
        (a, b) =>
          new moment(b.ReportTime).format("YYYYMMDD") -
          new moment(a.ReportTime).format("YYYYMMDD")
      ),
    }));

    const req = await Request.find();
    const sortRequest = req.map((i) => ({
      ...i.toObject(),
      request: i.request.sort(
        (a, b) =>
          new moment(b.requestTime).format("YYYYMMDD") -
          new moment(a.requestTime).format("YYYYMMDD")
      ),
    }));

    const blots = await blotters.find();
    const sortblot = blots.map((i) => ({
      ...i.toObject(),
      blotter: i.blotter.sort(
        (a, b) =>
          new moment(b.RequestTime).format("YYYYMMDD") -
          new moment(a.RequestTime).format("YYYYMMDD")
      ),
    }));
    return res.status(200).json({
      history,
      user1,
      blotlog,
      sumreq,
      sumrep,
      sumblot,
      total,
      penrep,
      penreq,
      penblot,
      user,
      reqlog,
      sortblot,
      replog,
      sortreport,
      sortRequest,
    }); //password email match
  }
};

const adminlogin = async (req, res) => {
  const { employeeId, password } = req.body;
  await dbcon();
  {
    const user = await admin.findOne({ employeeId }).select("+password");

    if (!user) return res.status(401).json({ login: "employee not register" }); //email
    if (user.disable) return res.status(401).json({ login: "User Disabale" }); //email
    const pass = await bcrypt.compare(password, user.password); //password
    if (!pass) return res.status(401).json({ login: "incorrect password" });

    const uuid = require("uuid");
    const ref = uuid.v4();
    const ReportTime = moment().tz("Asia/Manila").format();
    const type1 = "  has Login Account: ";
    const history = await History.findOneAndUpdate(
      { email: employeeId },
      {
        $push: {
          history: [
            {
              ReportTime,
              ref,
              Activity: type1 + employeeId,
            },
          ],
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      login: true,
      usertype: user.department,
      Fullname: user.firstname + " " + user.lastname,
    }); //password email match
  }

  // const user = "admin";
  // const pass = "pass";
  // const firedept = "fire";
  // const firepass = "dept";
  // const popo = "police";
  // const popass = "dept";

  // {
  //   switch (username) {
  //     case "admin":
  //       if (pos === "admin") {
  //         return res.json({ login: true, usertype: "admin" });
  //       } else return res.json({ login: false });
  //       break;
  //     case "fire":
  //       if (pos === "Fireman") {
  //         return res.json({ login: true, usertype: "fire" });
  //       } else return res.json({ login: false });
  //       break;
  //     case "police":
  //       if (pos === "Police") {
  //         return res.json({ login: true, usertype: "police" });
  //       } else return res.json({ login: false });
  //     default:
  //       return res.json({ login: false });
  //   }
  // }
};
//this report
const updinator = async (req, res) => {
  const { ref, status, email,employeeId } = req.body;
  await dbcon();
  try {
    const reqlog = await Reports.findOneAndUpdate(
      { email, "reports.ref": ref },
      { $set: { "reports.$.process": status } },
      { new: true }
    );
    await admin12({
      to: email,
      type: "Report",
      type1: "updated",
      link: status,
      midtext:
        "Your Report Has been Updated please contact Barangay official for more info",
      id: ref,
    });
    const uuid = require("uuid");

    const ReportTime = moment().tz("Asia/Manila").format();
    const type1 = "  has updated report Account of: ";
    const history = await History.findOneAndUpdate(
      { email: employeeId },
      {
        $push: {
          history: [
            {
              ReportTime,
              ref,
              Activity: employeeId + type1 + email,
            },
          ],
        },
      },
      { new: true, upsert: true }
    );

    if (reqlog) {
      return res.json({ update: true, reqlog });
    }
    return res.json({ update: false, reqlog });
  } catch (error) {
    return res.json({ update: false, error });
  }
};
//this is update
const reportinator = async (req, res) => {
  const { ref, status, email, employeeId } = req.body;
  await dbcon();
  {
    const replog = await Request.findOneAndUpdate(
      { email, "request._id": ref },
      { $set: { "request.$.process": status } },
      { new: true }
    );
    if (replog) {
      await admin12({
        to: email,
        type: "Request",
        type1: "updated",
        link: status,
        midtext:
          "Your Request Has been Updated please contact Barangay official for more info",
        id: ref,
      });
    }
    const uuid = require("uuid");

    const ReportTime = moment().tz("Asia/Manila").format();
    const type1 = "  has updated  Request of: ";
    const history = await History.findOneAndUpdate(
      { email: employeeId },
      {
        $push: {
          history: [
            {
              ReportTime,
              ref,
              Activity: employeeId + type1 + email,
            },
          ],
        },
      },
      { new: true, upsert: true }
    );
    if (replog) {
      return res.json({ update: true });
    }
  }

  return res.json({ update: false });
};
const blotinator = async (req, res) => {
  const { ref, status, email, employeeId } = req.body;
  await dbcon();
  {
    const blotterlog = await blotters.findOneAndUpdate(
      { email, "blotter._id": ref },
      { $set: { "blotter.$.process": status } },
      { new: true }
    );

    await admin12({
      to: email,
      type: "Blotter",
      type1: "updated",

      link: status,
      midtext:
        "Your Blotter Report Has been Updated please contact Barangay official for more info",
      id: ref,
    });
    const uuid = require("uuid");

    const ReportTime = moment().tz("Asia/Manila").format();
    const type1 = "  has Updated Blotter of : ";
    const history = await History.findOneAndUpdate(
      { email: employeeId },
      {
        $push: {
          history: [
            {
              ReportTime,
              ref,
              Activity: employeeId + type1 + email,
            },
          ],
        },
      },
      { new: true, upsert: true }
    );
    if (blotterlog) {
      return res.json({ update: true });
    }
  }

  return res.json({ update: false });
};
const usersetting = async (req, res) => {
  const { disable, email, employeeId } = req.body;
  await dbcon();
  {
    const blotterlog = await User.findOneAndUpdate(
      { email },
      { $set: { disable: disable } },
      { new: true }
    );
    // await admin12({
    //   to: email,
    //   type: "Blotter",
    //   type1: "updated",

    //   link: status,
    //   midtext:
    //     "Your Blotter Report Has been Updated please contact Barangay official for more info",
    //   id: ref,
    // });
    const uuid = require("uuid");

    const ReportTime = moment().tz("Asia/Manila").format();
    const ref = uuid.v4();
    const type1 = "  has Disable Account: ";
    const history = await History.findOneAndUpdate(
      { email: employeeId },
      {
        $push: {
          history: [
            {
              ReportTime,
              ref,
              Activity: employeeId + type1 + email,
            },
          ],
        },
      },
      { new: true, upsert: true }
    );
    if (blotterlog) {
      return res.json({ update: true });
    }
  }

  return res.json({ update: false });
};

const adminsetting = async (req, res) => {
  const { disable, employeeId } = req.body;
  await dbcon();
  {
    const blotterlog = await admin.findOneAndUpdate(
      { employeeId },
      { $set: { disable: disable } },
      { new: true }
    );
    // await admin12({
    //   to: email,
    //   type: "Blotter",
    //   type1: "updated",

    //   link: status,
    //   midtext:
    //     "Your Blotter Report Has been Updated please contact Barangay official for more info",
    //   id: ref,
    // });
    if (blotterlog) {
      return res.json({ update: true });
    }
  }

  return res.json({ update: false });
};

const userchangepass = async (req, res) => {
  const { email, newpassword } = req.body;

  await dbcon();
  {
    const hashPassword = await bcrypt.hash(newpassword, 10);
    const update = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashPassword } },
      { new: true }
    );
    const uuid = require("uuid");

    const ReportTime = moment().tz("Asia/Manila").format();
    const ref = uuid.v4();
    const type1 = "  has ChangePassword ";
    const history = await History.findOneAndUpdate(
      { email: req.user.email },
      {
        $push: {
          history: [
            {
              ReportTime,
              ref,
              Activity: email + type1,
            },
          ],
        },
      },
      { new: true, upsert: true }
    );
    return res.status(200).json({
      success: true,
    });
  }
};

const adminreg = async (req, res) => {
  const { employeeId, department, firstname, lastname, password } = req.body;

  await dbcon();

  const exist = await admin.findOne({ employeeId });
  console.log(exist);

  if (exist) return res.json({ error: "employeeId is already used!!!!" });
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await new admin({
    employeeId,
    department,
    firstname,
    lastname,
    password: hashPassword,
  }).save();
  const uuid = require("uuid");

  const ReportTime = moment().tz("Asia/Manila").format();
  const ref = uuid.v4();
  const type1 = "  Welcome ";
  const history = await History.findOneAndUpdate(
    { email:employeeId },
    {
      $push: {
        history: [
          {
            ReportTime,
            ref,
            Activity: type1,firstname
          },
        ],
      },
    },
    { new: true, upsert: true }
  );
  return res.status(200).json({
    success: true,
    message: "registered",
  });
};
module.exports = {
  adminlogin,
  log,
  updinator,
  reportinator,
  blotinator,
  adminreg,
  usersetting,
  adminsetting,

  userchangepass,
};
