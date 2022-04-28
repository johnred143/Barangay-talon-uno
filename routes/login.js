const express = require("express");
const router = express.Router();
const { report1, login, regs, test } = require("../controller/controller");
const {
    logsanitazer,
    reqsanitazer,
    result,
} = require("../middleware/sanitazer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", test);

router.post("/main/report", report1);

router.post("/login", logsanitazer, result, login);

router.post("/register", reqsanitazer, result, regs);

module.exports = router;
