exports.registerValidator = (req, res, next) => {
const { name, email, password, role } = req.body;

if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
}

if (!["admin", "doctor", "patient"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
}

next();
};

exports.loginValidator = (req, res, next) => {
const { email, password } = req.body;

if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
}

next();
};
