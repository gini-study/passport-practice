// server.js
const express = require("express");
const path = require("path");
const passport = require("passport");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const cookieSession = require("cookie-session");
const app = express();
const config = require("config");
const serverConfig = config.get("server");
const mainRouter = require("./routes/main.router");
const usersRouter = require("./routes/users.router");

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_ENCRYPTION_KEY],
    maxAge: 24 * 60 * 60 * 1000, // 24시간 유효
    path: "/",
    httpOnly: true,
  })
);

app.use(function (req, res, next) {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// -----------------------------------------------------

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

app.use("/static", express.static(path.join(__dirname, "public")));

// -----------------------------------------------------

app.use("/", mainRouter);
app.use("/auth", usersRouter);

// -----------------------------------------------------

const port = serverConfig.port;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
