const { body, validationResult } = require("express-validator");
const reqsanitazer = [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
];
const logsanitazer = [body("email").isEmail()];
const emailnizer = [body("email").isEmail()];

const result = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
module.exports = { reqsanitazer, logsanitazer, result, emailnizer };
