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

app.use(cors()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// database.connectDB();
const dbUrlCloud = "mongodb+srv://mdrezuanislamridoy:RRRidoy781@rrcluster.dzwno.mongodb.net/TaskManager?retryWrites=true&w=majority"
const dbUrlLocal = "mongodb://localhost:27017"
mongoose.connect(dbUrlCloud).then((result) => {
  console.log("Connected to database");
}).catch((err) => {
  console.log(err);
});

app.use("/api/user", AuthRoute);
app.use("/api/todos", todoRoutes);
app.use("/api/u", UserRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});
 
const port = process.env.PORT || 3004;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
