import express from "express";
import * as controller from "./users.controller.js";
import authMiddleware from "../../shared/middlewares/auth.js";
import roleMiddleware from "../../shared/middlewares/requireRole.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("admin"), controller.getAllUsers);

export default router;