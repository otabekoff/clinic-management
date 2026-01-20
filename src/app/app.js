import express from "express";
import cors from "cors";
import routes from "./routes.js";
import errors from "./errors.js";

const app = express();

app.use(cors());
app.use(express.json());

// Register all routes
app.use("/api", routes);

// Global error handler
app.use(errors);

export default app;