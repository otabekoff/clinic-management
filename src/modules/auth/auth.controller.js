import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as repo from "./auth.repo.js";

export const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await repo.findByEmail(email);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const result = await repo.createUser(name, email, hashed, role);

        res.status(201).json({
            id: result.rows[0].id,
            name: result.rows[0].name,
            email: result.rows[0].email,
            role: result.rows[0].role
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
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

        res.json({ 
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const result = await repo.findById(req.user.id);
        
        if (!result.rows.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result.rows[0];
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        next(err);
    }
};


