// server.js
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const AuthRoute = require("./routes/AuthRoutes");
const todoRoutes = require("./routes/todoRoutes");
const database = require("./config/db");
const { default: mongoose } = require("mongoose");
const UserRouter = require("./routes/UserRoutes");
const ProfileRouters = require("./routes/ProfileRoutes");
const FriendRoute = require("./routes/FriendRoutes");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbUrl = process.env.DB_URL;

mongoose
  .connect(dbUrl)
  .then((result) => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", AuthRoute);
app.use("/api/todos", todoRoutes);
app.use("/api/u", UserRouter);
app.use("/api/profile", ProfileRouters);
app.use("/api/friends", FriendRoute);

app.get("/", (req, res) => {
  res.send("Hello");
});

//testing branch

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
