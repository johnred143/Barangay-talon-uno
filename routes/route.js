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
  changepass,
  updatepage,
  resetpasswordtoken,
  genera2,
  blotter1,
  // verifyUrlReset
  // ,resetPassword
} = require("../controller/controller");
const {
  adminlogin,
  log,
  updinator,
  reportinator,
  blotinator,
} = require("../controller/admin");
const {
  logsanitazer,
  reqsanitazer,
  result,
  emailnizer,
} = require("../middleware/sanitazer");
const authenticateToken = require("../middleware/jwtoken");

router.get("/", test);
router.post("/resetpassword", resetpasswordtoken);
router.get("/log", log);
// router.post("/resetPassword", resetPassword);
// router.post("/verifyUrlReset", verifyUrlReset);
router.post("/changepassword", authenticateToken, changepass);
router.post("/admin/report", updinator);
router.post("/admin/request", reportinator);
router.post("/admin/blotter", blotinator);
router.post("/adminlogin", adminlogin);
router.get("/main", authenticateToken, main);
router.get("/main/aboutus", authenticateToken, about);
router.get("/main/contact", authenticateToken, contact);
router.post("/verify", authenticateToken, verify);
router.post("/update", authenticateToken, updatepage);
router.post("/main/request", authenticateToken, request);
router.post("/main/report", authenticateToken, report1);
router.post("/main/blotter", authenticateToken, blotter1);
router.post("/login", logsanitazer, result, login);
router.post("/otp", authenticateToken, genera2);
router.post("/register", reqsanitazer, result, regs);

module.exports = router;
