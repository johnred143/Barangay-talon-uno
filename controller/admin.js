const express = require("express");
const router = express.Router();
const { User, Reports, Request } = require("../db/model");
const bcrypt = require("bcrypt");
const Mail = require("../auth/sms");
const jwt = require("jsonwebtoken");
const dbcon = require("../db/dbcon");
const log = async (req, res) => {
  await dbcon();
  {
    const reqlog = await Request.find();
    const user1 = await User.find();
    const replog = await Reports.find();
    const sumreq = reqlog.map((i) => i.request.length).reduce((a, b) => a + b);
    const sumrep = replog.map((i) => i.reports.length).reduce((a, b) => a + b);
    const user = user1.length;
    const penrep = replog
      .map((i) => i.reports.filter((rep) => rep.process === "Pending").length)
      .reduce((a, b) => a + b);
    const penreq = reqlog
      .map((i) => i.request.filter((req) => req.process === "Pending").length)
      .reduce((a, b) => a + b);
    const total = penrep + penreq;

    return res.status(200).json({
      reqlog,
      replog,
      sumreq,
      sumrep,
      total,
      penrep,
      penreq,
      user,
    }); //password email match
  }
};
const adminlogin = async (req, res) => {
  const user = "admin";
  const pass = "pass";
  const firedept = "fire";
  const firepass = "dept";
  const popo = "police";
  const popass = "dept";
  const { username, password } = req.body;
  await dbcon();
  {
    switch (username) {
      case "admin":
        if (user === username && pass === password) {
          return res.json({ login: true, usertype: "admin" });
        } else return res.json({ login: false });
        break;
      case "fire":
        if (firedept === username && firepass === password) {
          return res.json({ login: true, usertype: "fire" });
        } else return res.json({ login: false });
        break;
      case "police":
        if (popo === username && popass === password) {
          return res.json({ login: true, usertype: "police" });
        } else return res.json({ login: false });
      default:
        return res.json({ login: false });
    }
  }
};
//this report
const updinator = async (req, res) => {
  const { ref, status, email } = req.body;
  await dbcon();
  try {
    await send({
      to: email,
      type: "Request",
      link: "https://www.facebook.com/BrgyTalon1",
      midtext:
        "Your Request Has been Updated please contact Barangay official for more info",
      id: ref,
    });
    const reqlog = await Reports.findOneAndUpdate(
      { email, "reports.ref": ref },
      { $set: { "reports.$.process": status } },
      { new: true }
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
  const { ref, status, email } = req.body;
  await dbcon();
  {
    const replog = await Request.findOneAndUpdate(
      { email, "request._id": ref },
      { $set: { "request.$.process": status } },
      { new: true }
    );
    if (replog) {
      return res.json({ update: true });
    }
  }
  return res.json({ update: false });
};

module.exports = { adminlogin, log, updinator, reportinator };
