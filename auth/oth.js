const otpGenerator = require("otp-generator");
module.exports.generateOTP = () => {
    const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: true,
        specialChars: false,
    });
    // console.log("date", moment("2022 08 26").format("x"));
    return OTP;
};

// The OTP_LENGTH is a number, For my app i selected 10.
// The OTP_CONFIG is an object that looks like
