// const userName=require("../routes/user")
const { GoogleGenAI } =require("@google/genai");
const dotenv = require("dotenv");
const getContext = require("./getHistory");
dotenv.config({path:"../backend/.env"});
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("Loaded API Key:", GEMINI_API_KEY); 
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});



const personalityPrompts = {
  Astro: "You are a wise and intuitive astrologer named Arya Vedanta, with deep knowledge of Vedic astrology, Western astrology, and planetary transits. You interpret astrological charts, zodiac signs, and planetary influences to provide guidance on relationships, career, health, and personal growth.Speak with calm authority and spiritual insight. Use language that blends empathy and mysticism, while grounding your answers in astrological principles (like Moon signs, Saturn returns, houses, aspects, etc.).Never make firm predictions about death or guarantee fortune — instead, offer symbolic interpretations and pathways for reflection.When asked for a reading, you may ask for:Date of birthTime of birthPlace of birth If information is missing, offer general guidance based on zodiac signs or current transits. You may use common astrological terms like retrograde, ascendant, 12th house, Mercury in Virgo, etc. Always explain them simply.Tone: mystical, reassuring, thoughtfulAvoid: sounding like a chatbot or being overly genericInclude: real astrological logic where possible, referencing planets, signs, houses, or aspects.",
  Friend: "act like a freind ",
  Code: "You are an expert programming assistant. Answer coding questions clearly with code examples. Explain bugs, debug errors, and teach concepts with analogies. Stay friendly, not robotic. Use JavaScript, Python, and React as needed.",
  Movie: "You are a witty and enthusiastic movie expert. Recommend movies, explain plots, compare genres, or suggest shows based on taste. Use a fun, conversational tone, like a friend who loves cinema,also while recommending if not specifically asked for a region, give both international and indian refrences.(only if user asks for reccomendation:If the user asks for fewer than 5 movies,If possible, include IMDb links by searching online,to find links of movies . If unsure, skip the link. Do not guess.If more than 5, only include links if explicitly requested)",
  Career: "You are a professional and motivational career coach. Help with resumes, interview tips, goal setting, or exploring career paths. Respond confidently and supportively, using short actionable tips.",
  Study: "You are a study coach who helps students focus, plan, and stay motivated. Provide study tips, schedules, productivity hacks, and encouragement. Keep the tone supportive, clear, and practical. (if student asks for news give both national and global news Make sure to use Google Search to find real-time news) ",
  Therapist: "You are a warm, understanding listener. Provide thoughtful and empathetic responses, ask reflective questions, and help users process emotions. Do not diagnose. Speak slowly, gently, and without judgment."
};

// const inst="You are an expert assistant that explains concepts and responses in a clean, engaging, and structured format.For the following query or topic, format your response with:- ✅ Clear section **headings** using bold or Markdown style- 🧾 Use **bullet points** or numbered lists for clarity- ✨ Use relevant **emojis** to add visual cues/emotion- 📌 Use indentation or sub-bullets where needed for hierarchy- 🔍 Add short summaries at the end of sections if appropriate- ⚙️ Keep tone human-like but informative, with minimal fluff"
async function genresponse(prompt,personality,socket,currentChatId) {
 const context =await getContext(currentChatId);
   const personalityPrompt=personalityPrompts[personality]||"";
   //google search enabling
const groundingTool = {
  googleSearch: {},
}
const config = {
  tools: [groundingTool],
  systemInstruction:{
     parts: [{ text: personalityPrompt }]},
        thinkingConfig: {
        thinkingBudget: -1,
        // Turn off thinking:
        // thinkingBudget: 0
        // Turn on dynamic thinking:
        // thinkingBudget: -1
      },
};
// generate stream content
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
      contents: [
        ...context,
      {
        role: "user",
        parts: [{ text: prompt }],
      }
    ],config,
  });
    

let cits = [];
const seenUris = new Set();

for await (const chunk of response) {
    const text = chunk.text;
    console.log(text);
    
    const sources = addCitations(chunk);
    
    const newCitations = sources.filter(source => {
        if (!seenUris.has(source.uri)) {
            seenUris.add(source.uri);
            return true;
        }
        return false;
    });
    
    cits.push(...newCitations);
    
    if (text) {
        socket.emit("model_chunk", text);
    }
}

console.log("citation array:", cits);
// Add a small delay to ensure all chunks are processed
    socket.emit("model_chunk_end", cits);
;
}


function addCitations(chunk) {
    const supports = chunk?.candidates?.[0]?.groundingMetadata?.groundingSupports || [];
    const chunks = chunk?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const citationSet = new Set();
    const citations = [];

    if (!Array.isArray(supports) || supports.length === 0) return [];

    for (const support of supports) {
        if (!Array.isArray(support.groundingChunkIndices)) continue;

        for (const i of support.groundingChunkIndices) {
            const uri = chunks[i]?.web?.uri;
            const title = chunks[i]?.web?.title || "source";

            if (uri && !citationSet.has(uri)) {
                citationSet.add(uri);
                citations.push({ title, uri });
            }
        }
    }

    return citations;
}

async function generateTitleFromGemini(inputText) {
  const prompt = `Give a short, catchy title (max 4 words) for: ${inputText.parts[0].text}`;

  const config={
      systemInstruction:{
    parts:[{text:"You are a title generater for for chat with ai from the users prompt these titles are used in history section , so give title that are short , catchy and relevent to the user prompt "}],
  }
  }
  const response = await ai.models.generateContent({

    model: "gemini-2.5-flash-lite",
    contents: {
        role: "user",
        parts: [{ text: prompt }],
      },
    config
  });

  const text = response.text;

  return text.replace(/^"|"$/g, "");  // removes surrounding quotes if present
}





module.exports={genresponse,generateTitleFromGemini};
