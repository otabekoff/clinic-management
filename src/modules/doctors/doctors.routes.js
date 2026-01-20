import express from "express";
import * as controller from "./doctors.controller.js";
import authMiddleware from "../../shared/middlewares/auth.js";
import roleMiddleware from "../../shared/middlewares/requireRole.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("admin"), controller.createDoctorProfile);

export default router;
