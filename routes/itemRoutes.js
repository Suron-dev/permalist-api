import express from "express";
import ItemController from "../controllers/ItemController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/seed/:table/:number",authMiddleware.isSuperAdmin, ItemController.generateFakeItem);
router.get("/truncate/:table",authMiddleware.isSuperAdmin, ItemController.truncate);


router.get("/user-items", AuthMiddleware.isLoggedIn(), ItemController.getUserItems);
router.get("/", AuthMiddleware.isSuperAdmin ,  ItemController.getAllItems);
router.get("/:id",AuthMiddleware.isSuperAdmin , ItemController.getItemById);
router.post(
    "/",
    AuthMiddleware.isLoggedIn(),
    ItemController.createItem
);
router.delete("/:id",
    AuthMiddleware.isLoggedIn(),
    AuthMiddleware.checkItemOwnership(),
    ItemController.deleteItem
);

router.put("/:id",
    AuthMiddleware.isLoggedIn(),
    AuthMiddleware.checkItemOwnership(),
    ItemController.updateItem
);


export default router;