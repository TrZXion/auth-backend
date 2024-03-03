import express from "express";
import path from "path";
import mongoose from "mongoose";

//db connect
mongoose
  .connect("mongodb+srv://admin:tahmp5@cluster21.dgbrqey.mongodb.net/", {
    dbName: "backend",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const Msg = mongoose.model("Message", messageSchema);

const app = express();
// const users = [];

//using middleware
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));

//setting up View engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  // res.render("index", { name: "Singh" });
  res.render("login");
  // res.send("HI");
  // res.json({
  //   success: true,
  //   products:[]
  // })
});

app.post("/login", (req, res) => {
  res.cookie("token", "iamin");
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
app.post("/contact", async (req, res) => {
  // console.log(req.body);
  // const messageData = { name: req.body.name, email: req.body.email };
  // // res.render("success");
  // Msg.create(messageData);

  //destructure
  const { name, email } = req.body;
  await Msg.create({ name, email });
  res.redirect("./success");
});

app.get("/users", (req, res) => {
  res.json({
    users,
  });
});

// ()=>{} is a callby function
app.listen(5000, () => {
  console.log("Server is working");
});
