const db = require("../../shared/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
try {
    const { name, email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await db.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role",
    [name, email, hashed, role]
    );

    res.json(user.rows[0]);
} catch (err) {
    next(err);
}
};

exports.login = async (req, res, next) => {
try {
    const { email, password } = req.body;

    const result = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (!result.rows.length) return res.status(400).json({ message: "Invalid credentials" });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
    );

    res.json({ token });
} catch (err) {
    next(err);
}
};
