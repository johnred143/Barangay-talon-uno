const mongoose = require("mongoose");

let cacheConn = null;

const dbConn = async () => {
    if (cacheConn) {
        console.log("cacheConn...");
        return cacheConn;
    }

    console.log("Attempting to connect database...");

    const db_opt = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
    };

    const conn = await mongoose
        .connect(process.env.DBCON, db_opt)
        .then((mongoose) => {
            console.log("Connection established to database");
            return mongoose;
        })
        .catch(() => {
            console.log("failed connecting to database");
        });

    cacheConn = conn;
    return conn;
};

module.exports = dbConn;
