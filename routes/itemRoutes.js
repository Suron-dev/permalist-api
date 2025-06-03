import express from "express";
import ItemController from "../controllers/ItemController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

// Admin routes for seeding and truncating
router.get("/seed/:table/:number", AuthMiddleware.isSuperAdmin, ItemController.generateFakeItem);
router.get("/truncate/:table", AuthMiddleware.isSuperAdmin, ItemController.truncate);

// Get all items (admin only)
router.get("/all", AuthMiddleware.isSuperAdmin, ItemController.getAllItems);

// User-specific routes
router.use(AuthMiddleware.isLoggedIn());

// Get all items for the logged-in user
router.get("/", ItemController.getUserItems);

// Get a specific item (only if owned by the user)
router.get("/:id", AuthMiddleware.checkItemOwnership(), ItemController.getItemById);

// Create a new item
router.post("/", ItemController.createItem);

// Update an item (only if owned by the user)
router.put("/:id", AuthMiddleware.checkItemOwnership(), ItemController.updateItem);

// Delete an item (only if owned by the user)
router.delete("/:id", AuthMiddleware.checkItemOwnership(), ItemController.deleteItem);

export default router;
