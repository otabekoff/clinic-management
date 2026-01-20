const db = require("../../shared/db");

exports.createDoctorProfile = async (req, res, next) => {
try {
    const { user_id, specialization, working_hours } = req.body;

    await db.query(
    "INSERT INTO doctor_profiles (user_id, specialization, working_hours) VALUES ($1,$2,$3)",
    [user_id, specialization, working_hours]
    );

    res.json({ message: "Doctor profile created" });
} catch (err) {
    next(err);
}
};
