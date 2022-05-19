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
        origin: "https://barangay-talonuno.vercel.app",
        methods: ["GET", "POST"],
    })
);

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));

// api
app.use(login);

// server
app.listen(port, function () {
    console.log("connected");
});
