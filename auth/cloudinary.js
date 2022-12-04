const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: "doqwvrp29",
  api_key: "763169938575917",
  api_secret: "PYoz-W7NCpCfG82qYZeRXDbYNWk",
});
module.exports = cloudinary;
