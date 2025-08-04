const express = require("express");
const historyrouter = express.Router();
const User= require("../models/userData");
const { getAuth } = require("@clerk/express");
const { createNewUser } = require("../middlewares/addNewUser");
const userData = require("../models/userData");
const history = require("../models/history");
const chatData = require("../models/chatData");
const getTitleFromClaude = require("../controllers/getTitle");
const { generateTitleFromGemini } = require("../controllers/generateResponse");
const { ObjectId } = require("mongoose").Types;


historyrouter.post("/history", async (req, res) => {
  const { userId } = getAuth(req);
  const { response, personality, chatId } = req.body;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!response || !personality) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let userhistory = await history.findOne({ userId });
  // CASE: No chatId provided — create new chat
  if (!chatId) {
   const title=await generateTitleFromGemini(response);
   console.log(title);
    const newChat = await chatData.create({
      title,
      personality,
      messages: [response],
    });

    if (!userhistory) {
      userhistory = new history({
        userId,
        historyData: {
          [personality]: [newChat._id],
        },
      });
    } else {
      if (!userhistory.historyData[personality]) {
        userhistory.historyData[personality] = [];
      }
      userhistory.historyData[personality].push(newChat._id);
    }

    await userhistory.save();
    return res.status(200).json({ chatId: newChat._id }); // ✅ MUST RETURN here
  }

  // CASE: chatId is provided — update existing chat
  if (!userhistory) {
    return res.status(404).json({ error: "User history not found" });
  }

  const currentChat = await chatData.findById(chatId);
  if (!currentChat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  currentChat.messages.push(response);
  await currentChat.save();

  await userhistory.save();
  return res.status(200).json({ message: "History updated" }); // ✅ Final response
});









historyrouter.get("/history", async (req, res) => {
  try {
    const { user, personality } = req.query;
    console.log(user);
    if (!user || !personality) {
      return res.status(400).json({ error: "Missing user or personality" });
    }

    // Find user history
    const userHistory = await history.findOne({ userId: user });

    if (!userHistory || !userHistory.historyData[personality]) {
      return res.status(404).json({ error: "No history found for that personality" });
    }

    const chatIdArray = userHistory.historyData[personality];

    // Use Promise.all to fetch all titles in parallel
    const chatHistoryArray = await Promise.all(
      chatIdArray.map(async (chatId) => {
        const chat = await chatData.findById(chatId);
        return {title:chat?.title,chatid:chatId,updatedAt:chat?.updatedAt} || "Untitled";
      })
    );

    res.status(200).json(chatHistoryArray);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});









historyrouter.get("/history/chats", async (req, res) => {
  try {
    const { chatid } = req.query;

    if (!chatid) {
      return res.status(400).json({ error: "Missing chat ID" });
    }
    const chat = await chatData.findById(chatid);

    if (!chat) {
      return res.status(404).json({ error: "No chat found" });
    }

    console.log(chat);

    return res.status(200).json(chat.messages); // assuming messages is an array
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});






historyrouter.delete("/history/delete", async (req, res) => {
  const { chatid,user ,personality } = req.query;

  if (!chatid||!user||!personality) {
    return res.status(400).json({ message: "chatid is required" });
  }
  
  try {
    const deletedItem = await chatData.findByIdAndDelete(chatid);
    const chatObjectId = new ObjectId(chatid);
  const historyUpdate=await history.findOne({userId:user});
  historyUpdate.historyData[personality] = historyUpdate.historyData[personality].filter(
    (chat) => !chat.equals(chatObjectId)
   );
   await historyUpdate.save();
   console.log(historyUpdate.historyData[personality]);
    if (!deletedItem||!historyUpdate) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted", item: deletedItem });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



















module.exports=historyrouter;