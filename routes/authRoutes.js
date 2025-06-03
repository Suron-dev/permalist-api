// routes/authRoutes
import express from 'express';
import AuthController from "../controllers/authController.js";
import passport from "passport";


const router = express.Router();

router.post("/register" , AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("/logout", AuthController.logoutUser);
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    AuthController.googleLoginSuccess
);
export default router;