//middlewares.authMiddleware.js
import Item from "../models/Item.js";
class AuthMiddleware {
    static isLoggedIn() {
        return (req, res, next) => {
            if (req.isAuthenticated && req.isAuthenticated()) {
                return next();
            }
            return res.status(401).json({ message: "Unauthorized" });
        };
    }

    static isSuperAdmin(req, res, next) {
        if (req.isAuthenticated() && req.user.role === 'superadmin') {
            return next();
        }
        return res.status(403).json({ error: "Access denied. Super admin only." });
    }

    static checkItemOwnership() {
        return async (req, res, next) => {
            const itemId = req.params.id;
            const userId = req.user.id;

            try {
                const item = await Item.getItemById(itemId);
                if (item.error) return res.status(404).json({ error: "Item not found" });

                if (item.item.user_id !== userId) {
                    return res.status(403).json({ error: "Access denied. You don't own this item." });
                }

                next();
            } catch (err) {
                res.status(500).json({ error: "Server error" });
            }
        };
    }

    static checkOwnershipOrSuperAdmin() {
        return async (req, res, next) => {
            const itemId = req.params.id;
            const userId = req.user.id;
            const role = req.user.role;

            try {
                const { item } = await Item.getItemById(itemId);
                if (!item) return res.status(404).json({ error: "Item not found" });

                if (item.user_id !== userId && role !== "superadmin") {
                    return res.status(403).json({ error: "Access denied. Not your item." });
                }

                next();
            } catch (err) {
                res.status(500).json({ error: "Server error" });
            }
        };
    }


}



export default AuthMiddleware;
