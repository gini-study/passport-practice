// server.js
const express = require("express");
const path = require("path");
const passport = require("passport");
const User = require("./models/users.model");
const { default: mongoose } = require("mongoose");
const cookieSession = require("cookie-session");
const cookieEncryptionKey = ["key1", "key2"];
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("./middleware/auth.js");
const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: cookieEncryptionKey,
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
  .connect(
    `mongodb+srv://ji4722:chochlwldms4722@express-cluster.aeivo.mongodb.net/?retryWrites=true&w=majority&appName=express-cluster`
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

app.use("/static", express.static(path.join(__dirname, "public")));

// -----------------------------------------------------

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index");
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ msg: info });
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  })(req, res, next);
});

app.post("/logout", (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.get("/signup", checkNotAuthenticated, (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  // user 객체 생성
  const user = new User(req.body);
  try {
    // user 컬렉션에 유저 저장
    await user.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

app.get("/auth/google", passport.authenticate("google"));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  })
);

// -----------------------------------------------------

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
