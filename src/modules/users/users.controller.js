const db = require("../../shared/db");

exports.getAllUsers = async (req, res, next) => {
try {
    const users = await db.query("SELECT id,name,email,role FROM users");
    res.json(users.rows);
} catch (err) {
    next(err);
}
};
