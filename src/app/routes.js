import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import usersRoutes from "../modules/users/users.routes.js";
import doctorsRoutes from "../modules/doctors/doctors.routes.js";
import patientsRoutes from "../modules/patients/patients.routes.js";
import appointmentsRoutes from "../modules/appointments/appointments.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/doctors", doctorsRoutes);
router.use("/patients", patientsRoutes);
router.use("/appointments", appointmentsRoutes);

export default router;