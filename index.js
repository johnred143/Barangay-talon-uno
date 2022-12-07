const express = require("express");
const login = require("./routes/route");
const port = process.env.PORT || 5000;
const app = express();
const helmet = require("helmet");

const cors = require("cors");
// security
require("dotenv").config();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://barangay-talon-uno.vercel.app",
      "https://tatatalon-admin.vercel.app",
    ],
    methods: ["GET", "POST"],
  })
);

app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
// api
app.use(login);

// server
app.listen(port, function () {
  console.log("connected");
});
