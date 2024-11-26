
//Dependencies
const express = require("express");
const cors = require("cors");
const http = require('http')
const socket = require('socket.io')
const { mongoose } = require("mongoose");

//Routes 
const AuthRoute = require("./routes/AuthRoutes");
const todoRoutes = require("./routes/todoRoutes");
const UserRouter = require("./routes/UserRoutes");
const ProfileRouters = require("./routes/ProfileRoutes");
const FriendRoute = require("./routes/FriendRoutes");

//Dependency Initialization
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3003;


//middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//server and database initialization
const server = http.createServer(app)
const dbUrl = process.env.DB_URL;

mongoose
    .connect(dbUrl)
    .then((result) => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log(err);
    });

//Route Middleware
app.use("/api/user", AuthRoute);
app.use("/api/todos", todoRoutes);
app.use("/api/u", UserRouter);
app.use("/api/profile", ProfileRouters);
app.use("/api/friends", FriendRoute);



//server Rollout 
app.get("/", (req, res) => {
    res.send("Hello");
});


const io = socket(server, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket) => {
    console.log(socket.id);
})

server.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
