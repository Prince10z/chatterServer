require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "https://chatterserver.onrender.com", // Replace with your frontend domain
  })
);
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
const socketIO = require("socket.io");
const io = socketIO(server);
app.set("view engine", "ejs");
const path = require("path");
const { connectDB } = require("./connectdb.js");
const { createuserOrAddToRoom } = require("./repos/usersinfoRepos.js");
const { createmsg } = require("./repos/msgRepos.js");
const { route } = require("./routes/allroutes.js");
connectDB(process.env.mongodb);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "assets")));
io.on("connection", (socket) => {
  console.log(`New socket is connected with socket id: ${socket.id}`);
  socket.on("join-room", async ({ roomId, username }) => {
    // const { roomId, username } = data;
    console.log("running");
    console.log(roomId);
    if (!roomId || !username) {
      return socket.emit(
        `error-${socket.id}`,
        "Please provide a room ID and username"
      );
    }
    try {
      const test = await createuserOrAddToRoom(roomId, socket.id, username);

      if (test.status == "success") {
        socket.emit(`result-${socket.id}`, "SuccessFully joined the room");
        socket.broadcast.emit(
          `${roomId}-join`,
          `New user is connected: ${username}`
        );
      } else {
        socket.emit(`error-${socket.id}`, test.message || "Join room failed");
        console.log("errorrr");
      }
    } catch (err) {
      console.error("Error joining room:", err);
      socket.emit(
        `error-${socket.id}`,
        "An error occurred while joining the room"
      );
    }
  });
  socket.on("disconnect", () => {
    console.log(`Socket disconnected ${socket.id}`);
  });
  socket.on("chatmsg", async ({ groupname, username, msg }) => {
    try {
      const ncreateuserOrAddToRoomewmsg = await createmsg(
        groupname,
        username,
        socket.id,
        msg
      );
      console.log(msg);
      socket.broadcast.emit(groupname, {
        user: username,
        message: msg,
        time: Date.now(),
      });
    } catch (err) {
      console.log("Error in chatting message");
      socket.emit(`error-${socket.id}`, "Error in sending the message");
    }
  });
  socket.on("typing", ({ groupname, username }) => {
    try {
      socket.broadcast.emit(`${groupname}typing`, `${username} typing...`);
    } catch (err) {
      console.log("Facing error in sending typing msg");
    }
  });
});
app.use("/", route);
server.listen(PORT, () => {
  console.log(`Starting server at port :${PORT}`);
});
