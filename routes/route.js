const express = require("express");

const router = express.Router();
const {
  report1,
  login,
  regs,
  test,
  main,
  about,
  contact,
  request,
  verify,
  // otp,
  updatepage,
  sms2,
  genera2,
} = require("../controller/controller");
const { adminlogin, log, updinator } = require("../controller/admin");
const {
  logsanitazer,
  reqsanitazer,
  result,
  emailnizer,
} = require("../middleware/sanitazer");
const authenticateToken = require("../middleware/jwtoken");

router.get("/", test);
router.get("/sms", sms2);
router.get("/log", log);
router.post("/admin/update", updinator);
router.post("/adminlogin", adminlogin);
router.get("/main", authenticateToken, main);
router.get("/main/aboutus", authenticateToken, about);
router.get("/main/contact", authenticateToken, contact);
router.post("/verify", authenticateToken, verify);
router.post("/update", authenticateToken, updatepage);
router.post("/main/request", authenticateToken, request);
router.post("/main/report", authenticateToken, report1);
router.post("/login", logsanitazer, result, login);
router.post("/otp", authenticateToken, genera2);
router.post("/register", reqsanitazer, result, regs);

module.exports = router;
