import express from "express";
import * as controller from "./auth.controller.js";
import * as validators from "./auth.validators.js";
import authMiddleware from "../../shared/middlewares/auth.js";

const router = express.Router();

router.post("/register", validators.registerValidator, controller.register);
router.post("/login", validators.loginValidator, controller.login);
router.get("/profile", authMiddleware, controller.getProfile);

export default router;
