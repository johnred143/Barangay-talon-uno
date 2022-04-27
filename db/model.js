const mongoose = require("mongoose");
const { Schema } = mongoose;

const register = new Schema({
    firstname: { type: String, required: true },
    middlename: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    number: { type: Number, required: true },
    password: { type: String, required: true, select: false },
    birthday: { type: String, required: true },
});

const reports = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    addressdetail: { type: String },
    report: { type: String, required: true },
    Image: { type: String },
    // Image: {type: String,required:true},
});

const User = mongoose.model("user", register);
const Reports = mongoose.model("rep", reports);

module.exports = { User, Reports };
