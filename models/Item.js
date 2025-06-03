// models/Item.js

import db from "../config/db.js";

class Item {


    static async getAllItems() {
        try {
            const { rows } = await db.query("SELECT * FROM items ORDER BY id ASC");
            if (rows.length === 0) throw new Error("No items found");
            return { message: "Items fetched successfully", items: rows };
        } catch (err) {
            return { error: err.message };
        }
    }

    static async getItemById(id) {
        if (!id) throw new Error("ID is required");
        try {
            const { rows } = await db.query("SELECT * FROM items WHERE id = $1", [id]);
            if (rows.length === 0) throw new Error("Item not found");
            return { message: "Item fetched successfully", item: rows[0] };
        } catch (err) {
            return { error: err.message };
        }
    }

    static async create(title , id) {
        if (!title) throw new Error("Title is required");
        try {
            const { rows } = await db.query("INSERT INTO items (title , user_id) VALUES ($1 , $2) RETURNING *", [title , id]);
            return { message: "Item created successfully", newItem: rows[0] };
        } catch (err) {
            return { error: err.message };
        }
    }

    static async getAllItemsByUser(userId) {
        try {
            const { rows } = await db.query("SELECT * FROM items WHERE user_id = $1", [userId]);
            return rows;
        } catch (err) {
            throw new Error("Failed to get items: " + err.message);
        }
    }

    static async update(id, title , userID) {
        if (!id) throw new Error("ID is required");
        if (!title) throw new Error("Title is required");
        if (!userID) throw new Error("User ID is required");
        try {
            const { rows } = await db.query(
                "UPDATE items SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
                [title, id , userID]
            );
            if (rows.length === 0) throw new Error("Item not found");
            return { message: "Item updated successfully", updatedItem: rows[0] };
        } catch (err) {
            return { error: err.message };
        }
    }


    static async delete(id , userID) {
        if (!id) throw new Error("ID is required");
        if (!userID) throw new Error("User ID is required");
        try {
            await db.query("DELETE FROM items WHERE id = $1 AND user_id = $2", [id , userID]);
            return { message: "Item deleted successfully" };
        } catch (err) {
            return { error: err.message };
        }
    }

}

export default Item;
