const express = require("express");
const path = require("path");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
