import db from "../config/db.js";
import bcrypt from "bcrypt";

class User {
    static async findByEmail(email) {
        try {
            if (!email) throw new Error("Email is required");
            const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
            if (rows.length === 0) throw new Error("User not found");
            return rows[0];
        } catch (err) {
            throw err;
        }
    }

    static async findByProviderId(providerId) {
        try {
            const result = await db.query("SELECT * FROM users WHERE provider_id = $1", [providerId]);
            return result.rows[0] || null;
        } catch (err) {
            throw new Error("Database error while finding user by providerId");
        }
    }

    static async isEmailTaken(email) {
        try {
            const { rows } = await db.query("SELECT id FROM users WHERE email = $1", [email]);
            return rows.length > 0;
        } catch (err) {
            throw { error: err.message };
        }
    }

    static async isUsernameTaken(username) {
        try {
            const { rows } = await db.query("SELECT id FROM users WHERE username = $1", [username]);
            return rows.length > 0;
        } catch (err) {
            throw { error: err.message };
        }
    }

    static async createLocalUser(username, email, password, provider, providerId = null, role = "user") {
        if (!username || !email || !password || !provider) throw new Error("All fields are required");

        const emailExists = await this.isEmailTaken(email);
        if (emailExists) throw new Error("Email already registered");

        const usernameExists = await this.isUsernameTaken(username);
        if (usernameExists) throw new Error("Username already registered");

        const hashedPassword = await bcrypt.hash(password, 12);

        try {
            const result = await db.query(
                "INSERT INTO users (username, email, password, provider, provider_id , role) VALUES ($1, $2, $3, $4, $5 , $6) RETURNING *",
                [username, email, hashedPassword, provider, providerId, role]
            );
            return result.rows[0];
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async createOAuthUser(username, email, provider, providerId) {
        if (!username || !email || !provider || !providerId) throw new Error("All fields are required");

        const emailExists = await this.isEmailTaken(email);
        if (emailExists) {
            throw new Error("Email already registered with another provider");
        }

        const usernameExists = await this.isUsernameTaken(username);
        if (usernameExists) throw new Error("Username already registered");

        try {
            const result = await db.query(
                "INSERT INTO users (username, email, password, provider, provider_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [username, email, null, provider, providerId]
            );
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    }
}

export default User;
