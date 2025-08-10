// models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userHistory: { type: mongoose.Schema.Types.ObjectId, ref: "history" },
  title: { type: String, default: "Untitled Chat" },
  personality:{type:String,required:true},
  messages: [{
  role: String,
  parts: [ { text: String,sources:[] } ]
}],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("chatData", chatSchema);
