const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  const filePath = path.join(__dirname, "/templates/chat.html");
  console.log("Serving file:", filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Failed to send file:", err);
      res.status(404).send("File not found");
    }
  });
});

io.on("connection", (socket) => {
  console.log("user connected to server");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chatinfo", (data) => {
    console.log("message: " + data);
    socket.broadcast.emit("chatinfo", data);
    socket.emit("chatinfo", data);
  });
});

server.listen(3000, function () {
  console.log("Listening to port 3000...");
});
