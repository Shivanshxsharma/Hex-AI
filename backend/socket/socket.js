const { Server } = require("socket.io");
const { genresponse } = require("../controllers/generateResponse");

function socketConnection(server) {
  const io = new Server(server, {
cors: {
  origin: "https://hex-ai-pj9u.onrender.com", 
  methods: ["GET", "POST"],
  credentials: true,
},
  });

  io.on("connection",  (socket) => {

    socket.on("prompt_By_User", async (prompt,personality,currentChatId) => {
      try {
        console.log( "current chat id in scoket ----", currentChatId)
       await genresponse(prompt,personality,socket,currentChatId)
      } catch (error) {
        console.error("Gemini Error:", error);
        if (error.response?.status === 429 || error.status === 429) {
        socket.emit("response_error", "API keys exhausted. Rate limit exceeded.");
        } 
      }
    });

    socket.on("disconnect", () => {
    });
  });
}

module.exports = socketConnection;
