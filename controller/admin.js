const express = require("express");
const router = express.Router();
const { User, Reports, Request, blotters } = require("../db/model");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const dbcon = require("../db/dbcon");
const { admin12 } = require("../auth/emailsender");
const log = async (req, res) => {
  await dbcon();
  {
    const reqlog = await Request.find();
    const user1 = await User.find();
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

    return res.status(200).json({
      reqlog,
      replog,
      blotlog,
      sumreq,
      sumrep,
      sumblot,
      total,
      penrep,
      penreq,
      penblot,
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
    const reqlog = await Reports.findOneAndUpdate(
      { email, "reports.ref": ref },
      { $set: { "reports.$.process": status } },
      { new: true }
    );
    await admin12({
      to: email,
      type: "Report",
      link: status,
      midtext:
        "Your Report Has been Updated please contact Barangay official for more info",
      id: ref,
    });

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
    await admin12({
      to: email,
      type: "Request",
      link: status,
      midtext:
        "Your Request Has been Updated please contact Barangay official for more info",
      id: ref,
    });
    if (replog) {
      return res.json({ update: true });
    }
  }

  return res.json({ update: false });
};
const blotinator = async (req, res) => {
  const { ref, status, email } = req.body;
  await dbcon();
  {
    const replog = await blotters.findOneAndUpdate(
      { email, "request._id": ref },
      { $set: { "request.$.process": status } },
      { new: true }
    );
    await admin12({
      to: email,
      type: "Blotter",
      link: status,
      midtext:
        "Your Blotter Report Has been Updated please contact Barangay official for more info",
      id: ref,
    });
    if (replog) {
      return res.json({ update: true });
    }
  }

  return res.json({ update: false });
};


module.exports = { adminlogin, log, updinator, reportinator,blotinator };
