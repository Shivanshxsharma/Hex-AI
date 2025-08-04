const { Server } = require("socket.io");
const { genresponse } = require("../controllers/generateResponse");

function socketConnection(server) {
  const io = new Server(server, {
cors: {
  origin: "https://owl-ai-frontend.onrender.com", 
  methods: ["GET", "POST"],
  credentials: true,
},
  });

  io.on("connection",  (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("prompt_By_User", async (prompt,personality,currentChatId) => {
      try {
        console.log( "current chat id in scoket ----", currentChatId)
       await genresponse(prompt,personality,socket,currentChatId)
      } catch (error) {
        console.error("Gemini Error:", error);
        socket.emit("response_error", "Failed to get Gemini response.");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = socketConnection;
