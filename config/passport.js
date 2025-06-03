// config/passport.js
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import User from "../models/User.js";

passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await User.findByEmail(email);

            if (!user || !user.password) {
                return done(null, false, { message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: "Incorrect password" });
            }

            delete user.password;
            return done(null, user);
        } catch (e) {
            return done(null, false, { message: e.message });
        }
    })
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CLIENT_CALLBACKURL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Google profile:", profile);
                const username = profile.displayName;
                const email = profile.emails[0].value;
                const provider = "google";
                const providerId = profile.id;

                console.log("Looking for user with providerId:", providerId);
                let user = await User.findByProviderId(providerId);
                if (!user) {
                    console.log("User not found, creating new user");
                    user = await User.createOAuthUser(username, email, provider, providerId);
                }
                console.log("User found/created:", user);
                done(null, user);
            } catch (e) {
                console.error("Error in Google strategy:", e);
                done(e, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
    try {
        const user = await User.findByEmail(email);
        done(null, user);
    } catch (e) {
        return done(e.message);
    }
});

export default passport;
