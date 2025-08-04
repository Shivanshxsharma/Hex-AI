require("dotenv").config();
const http=require("http");
const express=require("express");
const app=express();
const socketConnection = require("./socket/socket");
const mongoose = require("mongoose");
const server=http.createServer(app);
const cors = require("cors");
const { log } = require("console");
const router = require("./routes/user");



app.use(express.json());



console.log(process.env.CLERK_PUBLISHABLE_KEY);
console.log(process.env.CLERK_SECRET_KEY);

const {clerkMiddleware} =require("@clerk/express");
const historyrouter = require("./routes/historyrouter");
app.use(
  cors({
    origin: "https://owl-ai-frontend.onrender.com",
    credentials: true,
  })
);

//socket connection

socketConnection(server);



const port=5000;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

app.use(clerkMiddleware());
app.use('/api',router);
app.use('/api',historyrouter);

// app.use("/api",router);
server.listen(port,()=>console.log("server connected!!!"));