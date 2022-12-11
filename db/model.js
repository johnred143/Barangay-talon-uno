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
    disable: { type: Boolean, default: false },
    password: { type: String, required: true, select: false },
    token: { type: String },
  },
  { collection: "user" }
);
const Admin = new Schema(
  {
    employeeId: { type: String, required: true },
    department: { type: String, required: true },

    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true, select: false },
    disable: { type: Boolean, default: false },
  },
  { collection: "admin" }
);
const userhistory = new Schema(
  {
    email: { type: String },
    history: [
      {
        ref: { type: String, required: true },
        ReportTime: { type: String, required: true },
        Activity: { type: String, required: true },
      },
    ],
  },
  { collection: "History" }
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
        Image: { type: String, default: "SOS" },
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
      {
        ref: { type: String, required: true },
        requestTime: { type: String, required: true },
        type: { type: String, required: true },
        irbi: { type: Number, required: true },
        date: { type: String, required: true },
        region: { type: String, required: true },
        province: { type: String, required: true },
        city: { type: String, required: true },
        contact: { type: Number, required: true },
        brgy: { type: String, required: true },
        lastname: { type: String, required: true },
        firstname: { type: String, required: true },
        middlename: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        birthday: { type: String, required: true },
        status: { type: String, required: true },
        birthplace: { type: String, required: true },
        presentadd: { type: String, required: true },
        provinceadd: { type: String, required: true },
        contactname: { type: String, required: true },
        relationship: { type: String, required: true },
        address: { type: String, required: true },
        number: { type: Number, required: true },
        res1: { type: String, required: true },
        process: { type: String, default: "Pending" },
        Image: { type: String, default: "picture" },
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
const blotter = new Schema(
  {
    email: { type: String },
    blotter: [
      {
        ref: { type: String, required: true },
        complainant: { type: String, required: true },
        date: { type: String, required: true },
        address: { type: String, required: true },
        contact: { type: Number, required: true },
        complainedFirstname: { type: String, required: true },
        complainedLastname: { type: String, required: true },
        complainedMiddlename: { type: String, default: "N/A" },
        RequestTime: { type: String, required: true },
        complainedAddress: { type: String, required: true },
        complainedAge: { type: Number, required: true },
        description: { type: String, required: true },
        process: { type: String, default: "Pending" },
      },
    ],
  },
  { collection: "Blotter" }
);
userhistory;
const History = mongoose.model("userhistory", userhistory);
const admin = mongoose.model("Admin", Admin);
const User = mongoose.model("user", user);
const Reports = mongoose.model("reports", Report);
const Request = mongoose.model("request", reqform);
const forget = mongoose.model("Reset", reset);
const auth = mongoose.model("Otp", otps);
const blotters = mongoose.model("Blotter", blotter);
module.exports = {
  User,
  Reports,
  Request,
  forget,
  auth,
  blotters,
  admin,
  History,
};
