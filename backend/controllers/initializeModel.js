const { GoogleGenAI } = require("@google/genai");
const getkeys = require("./getKeys");
const modelCache = new Map(); 

async function getModel(userId) {
    if (modelCache.has(userId)) {
        return modelCache.get(userId);
    }

    try {
        const GEMINI_API_KEY = await getkeys(userId);
        if (!GEMINI_API_KEY) throw new Error("Key not found");

        const ai = new GoogleGenAI({apiKey:GEMINI_API_KEY});
        modelCache.set(userId, ai);
        return ai;
    } catch (error) {
        console.error("Init Error:", error.message);
        return null;
    }
}



module.exports=getModel