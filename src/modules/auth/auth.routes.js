const router = require("express").Router();
const controller = require("./auth.controller");
const validators = require("./auth.validators");

router.post("/register", validators.registerValidator, controller.register);
router.post("/login", validators.loginValidator, controller.login);

module.exports = router;
