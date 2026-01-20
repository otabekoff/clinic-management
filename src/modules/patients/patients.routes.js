import express from "express";
import * as controller from "./patients.controller.js";
import authMiddleware from "../../shared/middlewares/auth.js";
import roleMiddleware from "../../shared/middlewares/requireRole.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("patient"), controller.createPatientProfile);

export default router;
