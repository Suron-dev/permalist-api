import express from "express";
import AuthMiddlewares from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/dashboard", AuthMiddlewares.isLoggedIn(), (req, res) => {
    res.json({ message: "Welcome!", user: req.user });
});

export default router;
