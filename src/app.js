const express = require("express");
const path = require("path");

const tasksRouter = require("./routes/tasks");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/tasks", tasksRouter);

module.exports = app;