const router = require("express").Router();
const controller = require("./users.controller");
const auth = require("../auth/auth.middleware");
const role = require("../auth/role.middleware");

router.get("/", auth, role("admin"), controller.getAllUsers);

module.exports = router;