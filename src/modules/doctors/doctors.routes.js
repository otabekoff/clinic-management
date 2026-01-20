const router = require("express").Router();
const controller = require("./doctors.controller");
const auth = require("../auth/auth.middleware");
const role = require("../auth/role.middleware");

router.post("/", auth, role("admin"), controller.createDoctorProfile);

module.exports = router;
