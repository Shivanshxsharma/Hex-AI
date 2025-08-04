// models/Chat.js
const mongoose = require("mongoose");
const Chat =require("./chatData")
const historySchema = new mongoose.Schema({
  userId: { type: String},
  historyData:{
    Normal:[{type: mongoose.Schema.Types.ObjectId, ref: "ChatData" }],
    Astro:[{ type: mongoose.Schema.Types.ObjectId, ref: "ChatData" }],
    Movie:[{ type: mongoose.Schema.Types.ObjectId, ref: "ChatData" }],
    Friend:[{ type: mongoose.Schema.Types.ObjectId, ref: "ChatData" }],
    Therapist:[{ type: mongoose.Schema.Types.ObjectId, ref: "ChatData" }],
    Career:[{ type: mongoose.Schema.Types.ObjectId, ref: "ChatData" }],
    Study:[{ type: mongoose.Schema.Types.ObjectId, ref: "ChatData" }],
    Code:[{ type: mongoose.Schema.Types.ObjectId, ref: "ChatData" }],
  }
});

module.exports = mongoose.model("history", historySchema);