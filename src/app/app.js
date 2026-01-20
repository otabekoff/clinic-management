const express = require("express");
const routes = require("./routes");
const errors = require("./errors");

const app = express();

app.use(express.json());

// Register all routes
app.use("/api", routes);

// Global error handler
app.use(errors);

module.exports = app;