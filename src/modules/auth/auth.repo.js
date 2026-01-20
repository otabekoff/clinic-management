import db from "../../shared/db/db.js";

export const createUser = (name, email, password, role) => {
    return db.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING *",
        [name, email, password, role]
    );
};

export const findByEmail = (email) => {
    return db.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
};

export const findById = (id) => {
    return db.query(
        "SELECT id, name, email, role FROM users WHERE id=$1",
        [id]
    );
};
