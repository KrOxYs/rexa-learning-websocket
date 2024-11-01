import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow React app to connect
    methods: ["GET", "POST"],
  },
});

const PORT = 5000;

// When a client connects
io.on("connection", (socket) => {
  // console.log("A user connected:", socket.id);

  // Listen for 'speechData' event from a client
  socket.on("speechData", (data) => {
    // console.log("Received speech data:", data);

    // Broadcast the speech data to all connected clients except the sender
    socket.broadcast.emit("processedText", {
      text: `Broadcasted: ${data.text}`,
      confidence: data.confidence,
    });
  });

  // When a client disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
