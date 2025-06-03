import db from "../config/db.js";

async function runMigration() {
    try {
        await db.query("ALTER TABLE users ALTER COLUMN password DROP NOT NULL;");
        console.log("Migration completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

runMigration();
