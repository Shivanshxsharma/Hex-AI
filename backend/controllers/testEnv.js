const dotenv = require("dotenv");
dotenv.config({path:"./backend/.env"});

console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
