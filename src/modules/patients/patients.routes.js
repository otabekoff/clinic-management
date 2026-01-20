const router = require("express").Router();
const controller = require("./patients.controller");
const auth = require("../auth/auth.middleware");
const role = require("../auth/role.middleware");

router.post("/", auth, role("patient"), controller.createPatientProfile);

module.exports = router;
