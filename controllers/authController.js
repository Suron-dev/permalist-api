//authController
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Joi from "joi";

class AuthController {
    // Register user
    static async registerUser(req , res){
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(3).required(),
            username: Joi.string().min(2).required()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return res.status(400).json({ errors: errorMessages });
        }
        const { email, password, username } = value;
        try {
            const newUser = await User.createLocalUser(username, email, password, "local");
            res.status(201).json({ message: "User created successfully", user: newUser });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Login user
    static async loginUser(req, res) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(3).required(),
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return res.status(400).json({ errors: errorMessages });
        }
        const {email , password} = value;
        try {
            const user = await User.findByEmail(email);
            if (!user) return res.status(400).json({ message: "User not found" });
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Incorrect credentials" });
    
            const { password: hashedPassword, ...safeUser } = user;
            console.log("safeUser in login:", safeUser);
            req.login(safeUser, (err) => {
                if (err) {
                    return res.status(500).json({ message: `login failed : ${err.message}` });
                }
                res.status(200).json({ message: "Logged in successfully", user: req.user });
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async googleLoginSuccess(req, res) {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        res.status(200).json({
            message: "Logged in with Google successfully",
            user: req.user
        });
    }
    
    // Logout user
    static async logoutUser(req, res) {
        req.logout((err) => {
            if (err) return res.status(500).json({ message: "Logout failed" });
            res.status(200).json({ message: "Logged out successfully" });
        });
    }
}

export default AuthController;
