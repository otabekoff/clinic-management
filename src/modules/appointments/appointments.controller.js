import db from "../../shared/db/db.js";

export const create = async (req, res, next) => {
    try {
        const { doctor_id, appointment_date } = req.body;

        await db.query(
            "INSERT INTO appointments (doctor_id, patient_id, appointment_date, status) VALUES ($1,$2,$3,'pending')",
            [doctor_id, req.user.id, appointment_date]
        );

        res.json({ message: "Appointment created" });
    } catch (err) {
        next(err);
    }
};

export const approve = async (req, res, next) => {
    try {
        const result = await db.query(
            "SELECT * FROM appointments WHERE id=$1",
            [req.params.id]
        );

        const appointment = result.rows[0];
        if (appointment.doctor_id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await db.query(
            "UPDATE appointments SET status='approved' WHERE id=$1",
            [req.params.id]
        );

        res.json({ message: "Approved" });
    } catch (err) {
        next(err);
    }
};

export const cancel = async (req, res, next) => {
    try {
        const result = await db.query(
            "SELECT * FROM appointments WHERE id=$1",
            [req.params.id]
        );

        const a = result.rows[0];

        if (
            req.user.role === "admin" ||
            (req.user.role === "doctor" && a.doctor_id === req.user.id) ||
            (req.user.role === "patient" && a.patient_id === req.user.id && a.status !== "approved")
        ) {
            await db.query(
                "UPDATE appointments SET status='cancelled' WHERE id=$1",
                [req.params.id]
            );
            return res.json({ message: "Cancelled" });
        }

        res.status(403).json({ message: "Forbidden" });
    } catch (err) {
        next(err);
    }
};
