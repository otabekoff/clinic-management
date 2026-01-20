const router = require("express").Router();
const controller = require("./appointments.controller");
const auth = require("../auth/auth.middleware");
const role = require("../auth/role.middleware");

router.post("/", auth, role("patient"), controller.create);
router.put("/:id/approve", auth, role("doctor"), controller.approve);
router.put("/:id/cancel", auth, controller.cancel);

module.exports = router;
