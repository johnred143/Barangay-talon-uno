const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.cloudname,
  api_key: process.env.cloudapi_key,
  api_secret: process.env.cloudapi_secret,
});
module.exports = cloudinary;
