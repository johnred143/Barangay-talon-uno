const express = require("express");
const router = express.Router();
const { User } = require("../db/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbcon = require("../db/dbcon");

const test = (req, res) => {
    console.log(req.user);
    // return res.send("Server Running...");
    return res.json({ test: "message" });
};
const main = (req, res) => {
    return res.json({ message: "this is main form" });
};

const about = (req, res) => {
    return res.json({ message: "about us" });
};
const contact = (req, res) => {
    if ((token = generateAccessToken)) {
        return res.status(200).json({ message: "login success" });
    }
};

// request page
const request = async (req, res) => {
    const { type, name, address, email, phone, purpose } = req.body;

    const req1 = await new User({
        reqform: {
            type: type,
            name: name,
            address: address,

            email: email,
            phone: phone,
            purpose: purpose,
        },
    }).save();
    return res.status(200).json({
        success: true,
        message: "report submitted",
        req1,
    });
};

// report page
const report1 = async (req, res) => {
    const { name, address, addressdetail, report, Image } = req.body;

    const rep = await new User({
        reports: {
            name: name,
            address: address,
            addressdetail: addressdetail,
            report: report,
            Image: Image,
        },
    }).save();
    return res.status(200).json({
        success: true,
        message: "report submitted",
        rep,
    });
};
// token this where the token generate and edit how long the token will last

async function generateAccessToken(username) {
    return await jwt.sign(username, process.env.TOKEN_SECRET, {
        expiresIn: "30s",
    });
}

const login = async (req, res) => {
    await dbcon();
    {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        console.log(user);

        if (!user) return res.json({ login: "email not register" }); //email

        const pass = await bcrypt.compare(password, user.password); //password
        if (!pass) return res.json({ login: "incorrect password" });

        const token = await generateAccessToken({ email: user.email });
        return res.status(200).json({ login: "success", token }); //password email match
    }
};
const regs = async (req, res) => {
    const {
        firstname,
        middlename,
        lastname,
        email,
        address,
        number,
        password,
        birthday,
    } = req.body;

    await dbcon();

    const exist = await User.findOne({ email: email });
    console.log(exist);

    if (exist) return res.json({ error: "username is already used!!!!" });
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await new User({
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        email: email,
        address: address,
        number: Number(number),
        password: hashPassword,
        birthday: birthday,
    }).save();

    const regToken = await generateAccessToken(user.email);

    return res.status(200).json({
        success: true,
        message: "registered",
        user,
        regToken,
    });
};

module.exports = { report1, login, regs, test, main, about, contact, request };
