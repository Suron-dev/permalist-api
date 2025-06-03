// index.js
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import itemRoute from "./routes/itemRoutes.js";
import session from "express-session";
import passport from "passport";
import authRoute from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import "./config/passport.js"; // Import passport configuration

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoute);
app.use("/items", itemRoute);
app.use("/", dashboardRoutes);

app.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
});
