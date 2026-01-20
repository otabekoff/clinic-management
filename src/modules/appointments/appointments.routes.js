import express from "express";
import * as controller from "./appointments.controller.js";
import authMiddleware from "../../shared/middlewares/auth.js";
import roleMiddleware from "../../shared/middlewares/requireRole.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("patient"), controller.create);
router.put("/:id/approve", authMiddleware, roleMiddleware("doctor"), controller.approve);
router.put("/:id/cancel", authMiddleware, controller.cancel);

export default router;
