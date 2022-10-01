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
    firstname: { type: String, required: true },
    middlename: { type: String },
    lastname: { type: String, required: true },
    number: { type: Number, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    barangay: { type: String, required: true },
    street: { type: String, required: true },
    gender: { type: String },
    birthday: { type: String, required: true },
    password: { type: String, required: true, select: false },
  },
  { collection: "user" }
);
const Report = new Schema(
  {
    email: { type: String },
    reports: [
      {
        type: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        addressdetail: { type: String, default: "NA" },
        report: { type: String, required: true },
        Image: { type: String, required: true },
        success: { type: Boolean, default: false },
        Image: {type: String,required:true},
      },
    ],
    total_user_reports: { type: Number, default: 0 },
  },
  { collection: "reports" }
);

const reqform = new Schema(
  {
    email: { type: String },
    request: [
      {
        type: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        purpose: { type: String, required: true },
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
