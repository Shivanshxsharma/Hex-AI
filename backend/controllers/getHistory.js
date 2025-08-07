const chatData = require("../models/chatData");

async function getContext(chatid) {
  const userInfoMessage = {
    role: "user",
    parts: [{ text: `User origin country - INDIA \n Use this context only when it helps personalize the experience.` }],
  };

  // Case 1: No chatid provided
  if (!chatid) return [userInfoMessage];

  try {
    const contextObject = await chatData.findById(chatid);
    const context = contextObject?.messages || [];

    // Ensure we're not modifying the original context from DB
    const updatedContext = [...context, userInfoMessage];

    return updatedContext;
  } catch (err) {
    console.error("❌ Error fetching context for chatId:", chatid, err);
    return [userInfoMessage]; // Include default user info even on error
  }
}

module.exports = getContext;

