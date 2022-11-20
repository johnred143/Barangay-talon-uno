const mongoose = require("mongoose");
const { otp } = require("../controller/controller");
const { Schema } = mongoose;

const reset = new Schema({
  to: { type: String, require: true },
  subject: { type: String, require: true },
  text: { type: String, require: true },
});
const user = new Schema(
  {
    image: { type: String },
    firstname: { type: String, required: true },
    middlename: { type: String, default: "NA" },
    lastname: { type: String, required: true },
    number: { type: Number, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    barangay: { type: String, required: true },
    street: { type: String, required: true },
    gender: { type: String, default: "NA" },
    birthday: { type: String, required: true },
    password: { type: String, required: true, select: false },
    token: { type: String },
  },
  { collection: "user" }
);
const Report = new Schema(
  {
    email: { type: String },
    reports: [
      {
        ref: { type: String, required: true },
        ReportTime: { type: String, required: true },
        type: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        addressdetail: { type: String, default: "NA" },
        report: { type: String, required: true },
        Image: { type: String, required: true },
        success: { type: Boolean, default: false },
        Image: { type: String, required: true },
        process: { type: String, default: "Pending" },
      },
    ],
    total_user_reports: { type: Number, default: 0 },
  },
  { collection: "reports" }
);
///hi
const reqform = new Schema(
  {
    email: { type: String },
    request: [
      {ref: { type: String, required: true },
        irbi: { type: String, required: true },
        region: { type: String, required: true },
        province: { type: String, required: true },
        city: { type: String, required: true },
        barangay: { type: String, required: true },
        date: { type: String, required: true },
        precint: { type: Number, required: true },
        vrr: { type: Number },
        contact: { type: Number, required: true },
        lastname: { type: String, required: true },
        firstname: { type: String, required: true },
        middlename: { type: String, default: "N/A" },
        nickname: { type: String, default: "N/A" },
        age: { type: String, required: true },
        gender: { type: String, required: true },
        birthday: { type: String, required: true },
        status: { type: String, required: true },
        birthplace: { type: String, required: true },
        height: { type: Number, required: true },
        weight: { type: Number, required: true },
        provadd: { type: String, required: true },
        contactname:{ type: String, required: true },
        relationship:{ type: String, required: true },
        address:{ type: String, required: true },
        contactpersonnumber:{ type: Number, required: true },
        res:{ type: String,  default: "N/A" },
        process: { type: String, default: "In process" },
      },
    ],
  },
  { collection: "request" }
);

const otps = new Schema({
  _id: { type: mongoose.Types.ObjectId, ref: "user" },
  email: { type: String, required: true },
  created: { type: String, required: true },
  otp: { type: String, required: true },
});
const User = mongoose.model("user", user);
const Reports = mongoose.model("reports", Report);
const Request = mongoose.model("request", reqform);
const forget = mongoose.model("Reset", reset);
const auth = mongoose.model("Otp", otps);
module.exports = { User, Reports, Request, forget, auth };
