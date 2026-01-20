import { Pool } from "pg";

// In-memory mock database for testing
class MockPool {
    constructor() {
        this.users = [];
        this.doctors = [];
        this.patients = [];
        this.appointments = [];
    }

    async query(sql, values = []) {
        // Simple mock implementation
        if (sql.includes("INSERT INTO users")) {
            const [name, email, password, role] = values;
            const user = { id: this.users.length + 1, name, email, password, role, created_at: new Date() };
            this.users.push(user);
            return { rows: [user] };
        }

        if (sql.includes("SELECT * FROM users WHERE email")) {
            const [email] = values;
            const user = this.users.find(u => u.email === email);
            return { rows: user ? [user] : [] };
        }

        if (sql.includes("SELECT id, name, email, role FROM users WHERE id")) {
            const [id] = values;
            const user = this.users.find(u => u.id === id);
            if (user) {
                const { password, ...userWithoutPassword } = user;
                return { rows: [userWithoutPassword] };
            }
            return { rows: [] };
        }

        if (sql.includes("SELECT id,name,email,role FROM users")) {
            return { rows: this.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })) };
        }

        if (sql.includes("INSERT INTO doctor_profiles")) {
            const [user_id, specialization, working_hours] = values;
            const doctor = { id: this.doctors.length + 1, user_id, specialization, working_hours };
            this.doctors.push(doctor);
            return { rows: [doctor] };
        }

        if (sql.includes("INSERT INTO patient_profiles")) {
            const [user_id, phone, date_of_birth] = values;
            const patient = { id: this.patients.length + 1, user_id, phone, date_of_birth };
            this.patients.push(patient);
            return { rows: [patient] };
        }

        if (sql.includes("INSERT INTO appointments")) {
            const [doctor_id, patient_id, appointment_date, status] = values;
            const appointment = { id: this.appointments.length + 1, doctor_id, patient_id, appointment_date, status };
            this.appointments.push(appointment);
            return { rows: [appointment] };
        }

        if (sql.includes("SELECT * FROM appointments WHERE id")) {
            const [id] = values;
            const appointment = this.appointments.find(a => a.id === id);
            return { rows: appointment ? [appointment] : [] };
        }

        if (sql.includes("UPDATE appointments SET status")) {
            const statusMatch = sql.match(/status='([^']+)'/);
            const idMatch = sql.match(/id=\$1/);
            const [id] = values;
            const appointment = this.appointments.find(a => a.id === id);
            if (appointment && statusMatch) {
                appointment.status = statusMatch[1];
            }
            return { rows: [appointment] };
        }

        console.log("Query:", sql, values);
        return { rows: [] };
    }

    async end() {
        // Mock: do nothing
    }
}

// Use mock if DATABASE_URL is not set
const pool = process.env.DATABASE_URL ? new Pool({
    connectionString: process.env.DATABASE_URL
}) : new MockPool();

export default pool;