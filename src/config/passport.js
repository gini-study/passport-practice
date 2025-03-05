const passport = require("passport");
const User = require("../models/users.model");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

const localStrategyConfig = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    // async 추가
    try {
      // try 추가
      const user = await User.findOne({
        // await 추가
        email: email.toLocaleLowerCase(),
      });

      if (!user) {
        return done(null, false, { msg: `Email ${email} not found` });
      }

      user.comparePassword(password, (err, isMatch) => {
        if (err) return done(err);

        if (isMatch) {
          return done(null, user);
        }

        return done(null, false, { msg: "Invalid email or password" });
      });
    } catch (err) {
      // catch 추가
      return done(err);
    }
  }
);

passport.use("local", localStrategyConfig);

const googleStrayegyConfig = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback",
    scope: ["email", "profile"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 콜백 대신 await 사용
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      } else {
        const user = new User();
        user.email = profile.emails[0].value;
        user.googleId = profile.id;

        // 콜백 대신 await 사용
        await user.save();

        done(null, user);
      }
    } catch (err) {
      console.log(err);
      done(err);
    }
  }
);

passport.use("google", googleStrayegyConfig);
