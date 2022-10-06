const express = require("express");
const router = express.Router();
const { User, Reports, Request, auth } = require("../db/model");
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
      .map(
        (i) => i.reports.filter((rep) => rep.process === "In process").length
      )
      .reduce((a, b) => a + b);
    const penreq = reqlog
      .map(
        (i) => i.request.filter((req) => req.process === "In process").length
      )
      .reduce((a, b) => a + b);
    const total = penrep + penreq;

    return res.status(200).json({
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
  const { username, password } = req.body;
  await dbcon();
  {
    if (user === username && pass === password) {
      return res.json({ login: true });
    } else return res.json({ login: false });
  }
};
const updinator = async (req, res) => {
  const { ref, status, email } = req.body;
  await dbcon();
  {
    const reqlog = await Request.findOneAndUpdate(
      { email, "request.ref": ref },
      { $set: { "request.$.process": status } },
      { new: true }
    );
    if (reglog) {
      return res.json({ update: true });
    }
  }
  return res.json({ update: false });
};

module.exports = { adminlogin, log, updinator };
