const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const repo = require("./auth.repo");

exports.register = async (req, res, next) => {
try {
    const { name, email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    const result = await repo.createUser(name, email, hashed, role);

    res.json({
    id: result.rows[0].id,
    name: result.rows[0].name,
    role: result.rows[0].role
    });
} catch (err) {
    next(err);
}
};

exports.login = async (req, res, next) => {
try {
    const { email, password } = req.body;

    const result = await repo.findByEmail(email);
    if (!result.rows.length) {
    return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
    return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
    );

    res.json({ token });
} catch (err) {
    next(err);
}
};


