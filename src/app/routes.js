const router = require("express").Router();

router.use("/auth", require("../modules/auth/auth.routes"));
router.use("/users", require("../modules/users/users.routes"));
router.use("/doctors", require("../modules/doctors/doctors.routes"));
router.use("/patients", require("../modules/patients/patients.routes"));
router.use("/appointments", require("../modules/appointments/appointments.routes"));

module.exports = router;