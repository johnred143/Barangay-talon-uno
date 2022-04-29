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
} = require("../controller/controller");
const {
    logsanitazer,
    reqsanitazer,
    result,
} = require("../middleware/sanitazer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", test);
router.get("/main", main);
router.get("/main/aboutus", about);
router.get("/main/contact", contact);
router.get("/main/request", request);
router.post("/main/report", report1);

router.post("/login", logsanitazer, result, login);

router.post("/register", reqsanitazer, result, regs);

module.exports = router;
