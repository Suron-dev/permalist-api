import db from "../config/db.js";
import { faker } from "@faker-js/faker";

const generalSeeder = {
    async seed(table, count) {
        try {
            if (table === "users") {
                for (let i = 0; i < count; i++) {
                    await db.query(
                        "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
                        [
                            faker.internet.userName(),
                            faker.internet.email(),
                            "hashed_password",
                            "user"
                        ]
                    );
                }
                return { message: `${count} users created.` };
            }

            if (table === "items") {
                const { rows: users } = await db.query("SELECT id FROM users");
                if (users.length === 0) throw new Error("No users found to attach items.");

                for (let i = 0; i < count; i++) {
                    const randomUser = users[Math.floor(Math.random() * users.length)];
                    await db.query(
                        "INSERT INTO items (title, user_id) VALUES ($1, $2)",
                        [
                            faker.commerce.productName(),
                            randomUser.id
                        ]
                    );
                }
                return { message: `${count} items created.` };
            }

            throw new Error("Unknown table.");
        } catch (err) {
            return { error: err.message };
        }
    },

    async clear(table) {
        try {
            await db.query(`DELETE FROM ${table}`);
            return { message: `${table} cleared.` };
        } catch (err) {
            return { error: err.message };
        }
    },
};

export default generalSeeder;
