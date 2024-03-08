import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";

const app = express();

//db connect
mongoose
  .connect(process.env.DATABASE_URI, {
    dbName: "backend",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

// const messageSchema = new mongoose.Schema({
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

//database design
// const Msg = mongoose.model("Message", messageSchema);
const User = mongoose.model("User", userSchema);

// const users = [];

//using middleware
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//setting up View engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    // res.render("logout");
    const decoded = jwt.verify(token, process.env.TOKEN);
    // console.log(decode);

    req.userId = await User.findById(decoded._id);
    next();
  } else {
    res.render("login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  console.log(req.userId);
  res.render("logout", { name: req.userId.name });
  // const { token } = req.cookies;

  // if (token) {
  //   res.render("logout");
  // } else {
  //   res.render("login");
  // }
  // // // res.render("index", { name: "Singh" });
  // // res.render("login");
  // // // res.send("HI");
  // // // res.json({
  // // //   success: true,
  // // //   products:[]
  // // // })
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: userId._id }, process.env.TOKEN);
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  let user = await User.findOne({ email });

  if (!user) {
    return res.redirect("/register");
  }

  // const isMatch = user.password === password;
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.render("login", { email, message: "Incorrect Password" });

  // const userId = await User.create({
  //   name,
  //   email,
  // });

  const token = jwt.sign({ _id: user.id }, "jjvbjibvgdvgduvgibuivb");
  // res.cookie("token", "iamin", {
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

// app.get("/add", async(req, res) => {
//   await Msg.create({ name: "Shivam", email: "dfgh@gmail.com" });
//   res.send("Nice");
//   // .then(() => {
//   //   res.send("Nice");
//   // });
// });

app.get("/success", (req, res) => {
  res.render("success");
});

//API
// app.post("/contact", async (req, res) => {
//   // console.log(req.body);
//   // const messageData = { name: req.body.name, email: req.body.email };
//   // // res.render("success");
//   // Msg.create(messageData);

//   //destructure
//   const { name, email } = req.body;
//   await Msg.create({ name, email });
//   res.redirect("./success");
// });

// app.get("/users", (req, res) => {
//   res.json({
//     users,
//   });
// });

// ()=>{} is a callby function
app.listen(5000, () => {
  console.log("Server is working");
});
