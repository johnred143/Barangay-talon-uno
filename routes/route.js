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
  otp,
  updatepage,
  sms2,
} = require("../controller/controller");
const {
  logsanitazer,
  reqsanitazer,
  result,
  emailnizer,
} = require("../middleware/sanitazer");
const authenticateToken = require("../middleware/jwtoken");

router.get("/", test);
router.post("/sms", sms2);
router.get("/main", authenticateToken, main);
router.get("/main/aboutus", authenticateToken, about);
router.get("/main/contact", authenticateToken, contact);
router.post("/verify", authenticateToken, verify);
router.post("/update", authenticateToken, updatepage);
router.post("/main/request", authenticateToken, emailnizer, result, request);
router.post("/main/report", authenticateToken, report1);
router.post("/login", logsanitazer, result, login);
router.post("/register", reqsanitazer, result, regs);
router.post("/auth", otp);
router.get("/auth", otp);
module.exports = router;
