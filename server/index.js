// importing modules
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// initialiing express app
const app = express();
app.use(cors());

const server = http.createServer(app);

// initializing socket io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// socket io connection
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  // disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });

  // join room
  socket.on("join_room", ({ name, room }) => {
    socket.join(room);
    console.log(`User ${name} joined room ${room}`);
  });

  // if message comes
  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });

  // We can write our socket event listeners in here...
});

server.listen(8080, () => "Server is running on port 8080");
