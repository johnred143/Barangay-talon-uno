const moment = require("moment");
const otpGenerator = require("otp-generator");
module.exports.generateOTP = () => {
    const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: true,
        specialChars: false,
    });
    const date = moment().format("x");
    const humandate = moment().format();
    return { OTP, date, humandate };
};

// The OTP_LENGTH is a number, For my app i selected 10.
// The OTP_CONFIG is an object that looks like
