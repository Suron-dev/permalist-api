import Item from "../models/Item.js";
import generalSeeder from "../utils/GeneralSeeder.js";

class ItemController {
    static async getItemById(req, res) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID is required" });

        try {
            const result = await Item.getItemById(id);
            if (result.error) return res.status(404).json({ error: result.error });

            res.status(200).json({
                message: result.message,
                item: result.item,
            });
        } catch (err) {
            res.status(500).json({ error: "Server error" });
        }
    }

    static async getAllItems(req, res) {
        try {
            const result = await Item.getAllItems();
            if (result.error) return res.status(404).json({ error: result.error });

            res.status(200).json({
                message: result.message,
                items: result.items,
            });
        } catch (err) {
            res.status(500).json({ error: "Server error" });
        }
    }

    static async getUserItems(req, res) {
        const userId = req.user.id;
        try {
            const result = await Item.getAllItemsByUser(userId);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async createItem(req, res) {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });
        const userId = req.user.id;
        try {
            const result = await Item.create(title, userId);
            if (result.error) return res.status(400).json({ error: result.error });

            res.status(201).json({
                message: result.message,
                newItem: result.newItem,
            });
        } catch (err) {
            res.status(500).json({ error: "Server error" });
        }
    }

    static async updateItem(req, res) {
        const id = req.params.id;
        const { title } = req.body;
        const userId = req.user.id;
        if (!id) return res.status(400).json({ error: "ID is required" });
        try {
            const result = await Item.update(id, title, userId);
            if (result.error) return res.status(400).json({ error: result.error });
            res.status(200).json({
                message: result.message,
                updatedItem: result.updatedItem,
            });
        } catch (err) {
            res.status(500).json({ error: "Server error" });
        }
    }

    static async deleteItem(req, res) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID is required" });
        const userId = req.user.id;
        try {
            const result = await Item.delete(id, userId);
            if (result.error) return res.status(404).json({ error: result.error });

            res.status(200).json({
                message: result.message,
            });
        } catch (err) {
            res.status(500).json({ error: "Server error" });
        }
    }

    static async generateFakeItem(req, res) {
        try {
            const tableName = req.params.table;
            const numberOfItems = parseInt(req.params.number);
            if (isNaN(numberOfItems) || numberOfItems <= 0) {
                return res.status(400).json({ error: "Invalid number of items" });
            }
            const result = await generalSeeder.seed(tableName, numberOfItems);
            res.status(200).json({ message: `${numberOfItems} ${tableName} generated successfully.` });
        } catch (error) {
            res.status(500).json({ error: `Failed to generate fake items: ${error.message}` });
        }
    }

    static async truncate(req, res) {
        const tableName = req.params.table;
        if (!tableName) return res.status(400).json({ error: "Table name is required" });

        try {
            const result = await generalSeeder.clear(tableName);
            if (result.error) return res.status(400).json({ error: result.error });

            return res.status(200).json({ message: result.message });
        } catch (err) {
            return res.status(500).json({ error: "Server error" });
        }
    }
}

export default ItemController;
