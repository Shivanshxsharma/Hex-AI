const { Server } = require("socket.io");
const { genresponse } = require("../controllers/generateResponse");
const getkeys = require("../controllers/getKeys");
const { GoogleGenAI } =require("@google/genai");
const getModel = require("../controllers/initializeModel");
function socketConnection(server) {
  const io = new Server(server, {
cors: {
  origin: "https://hex-ai-pj9u.onrender.com", 
  methods: ["GET", "POST"],
  credentials: true,
},
  });

  io.on("connection",  async (socket) => {
       const { userId } = socket.handshake.auth;

       const ai=await getModel(userId)
       if(!ai)  socket.emit("init_Error","cant initialise model trye again after sometime")




    socket.on("prompt_By_User", async (prompt,personality,currentChatId) => {
      try {
       await genresponse(prompt,personality,socket,currentChatId,ai)
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
