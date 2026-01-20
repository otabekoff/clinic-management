import db from "../../shared/db/db.js";

export const createPatientProfile = async (req, res, next) => {
    try {
        const { phone, date_of_birth } = req.body;

        await db.query(
            "INSERT INTO patient_profiles (user_id, phone, date_of_birth) VALUES ($1,$2,$3)",
            [req.user.id, phone, date_of_birth]
        );

        res.json({ message: "Patient profile created" });
    } catch (err) {
        next(err);
    }
};
