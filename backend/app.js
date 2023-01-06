const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const toobusy = require("node-toobusy");
const express = require("express");
const logger = require("morgan");
const ExpressBrute = require("express-brute");
const hpp = require("hpp");
const helmet = require("helmet");

const categoryRouter = require("./routes/category");
const userRouter = require("./routes/user");
const skillRouter = require("./routes/skill");
const userSkillRouter = require("./routes/user_to_skill");
const loginRouter = require("./routes/login");

const directReportRouter = require("./routes/direct_report");

const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store, { freeRetries: 10, minWait: 10000 }); // 10 attempts, 10 second wait

const app = express();
app.use(express.json({ limit: "1kb" }));
app.use(logger("dev"));
app.use(hpp());
app.use(helmet());

// Serve React app
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));
app.use(express.static("public"));

// Backend API
app.use("/api/category", categoryRouter);
app.use("/api/user", userRouter);
app.use("/api/skill", skillRouter);
app.use("/api/userskill", userSkillRouter);
app.use("/api/directreport", directReportRouter);
app.use("/api/login", bruteforce.prevent, loginRouter);

// Frontend application
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

app.use((req, res) => {
    if (toobusy()) res.send(503, "Server currently too busy, try again later!");
});

process
    .on("unhandledRejection", (reason, p) => {
        console.error(reason, "Unhandled Rejection at Promise", p);
    })
    .on("uncaughtException", (err) => {
        console.error(err, "Uncaught Exception thrown");
        process.exit(1);
    });

module.exports = app;
