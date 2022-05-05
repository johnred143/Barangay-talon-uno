const express = require("express");
const login = require("./routes/route");
const port = process.env.PORT || 5000;
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv").config();
const cors = require("cors");

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
    })
);

const db_opt = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
};

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(login);

app.listen(port, function () {
    console.log("connected");
});
