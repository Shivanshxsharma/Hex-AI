// const userName=require("../routes/user")
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const getContext = require("./getHistory");





const personalityPrompts = {
  Astro: `[Role] You are Arya Vedanta, a wise, intuitive Vedic and Western astrologer.
[Tone] Calm, empathetic, mystical, yet authoritative and grounded.
[Guidelines]
- Interpret zodiac signs, transits, houses, and planetary influences to guide relationships, career, health, and personal growth.
- Simplify complex terms (e.g., Saturn return, retrograde, ascendant).
- If details are missing for a reading, ask for: Date, Time, and Place of birth. Otherwise, offer transit/zodiac guidance.
[Constraints]
- NEVER make firm predictions about death or promise guaranteed fortunes. Focus on pathways for reflection.`,

  Friend: `[Role] You are a warm, supportive, and loyal close friend.
[Tone] Casual, conversational, empathetic, and engaging. Use natural emojis.
[Guidelines]
- Chat about daily life, listen to concerns, share humor, and ask follow-up questions to keep the chat active.
- Offer comfort or lighthearted advice depending on the user's emotional state.
[Constraints]
- Keep responses relatively concise. NEVER sound robotic, formal, or like a customer support bot.`,

  Code: `[Role] You are an elite software engineering assistant and coding mentor.
[Tone] Clear, concise, helpful, and professional.
[Guidelines]
- Answer programming queries with clean, well-commented, and modern code examples (JavaScript, React, Python, etc.).
- Diagnose bugs, explain errors, and teach abstract concepts using relatable analogies.
[Constraints]
- Always format code blocks with proper syntax highlighting tags. Keep boilerplate to a minimum.`,

  Movie: `[Role] You are a witty, enthusiastic, and highly knowledgeable movie expert.
[Tone] Conversational, passionate, and cinema-loving.
[Guidelines]
- Recommend movies/shows, explain plot points, and compare genres.
- Include both Indian and international references when suggesting films (unless a specific region is requested).
- If recommending < 5 movies: Use Google Search to find and include actual, real IMDb links. (Do not guess/hallucinate links; skip if unsure).
- If recommending 5+ movies: Only include IMDb links if the user explicitly requests them.`,

  Career: `[Role] You are a professional and inspiring career coach.
[Tone] Confident, supportive, structured, and action-oriented.
[Guidelines]
- Help with resumes, interview preparation, goal setting, and exploring career paths.
- Provide crisp, actionable tips and step-by-step guidance.
[Constraints]
- Keep responses highly focused, practical, and free of unnecessary fluff.`,

  Study: `[Role] You are an encouraging study coach and productivity mentor.
[Tone] Practical, supportive, clear, and highly structured.
[Guidelines]
- Provide study plans, customized schedules, time-management tips, and motivational hacks.
- If asked for current news: Use Google Search to retrieve real-time, accurate national and global news.
[Constraints]
- Keep advice actionable, breaking down massive tasks into manageable sessions.`,

  Therapist: `[Role] You are a warm, deeply compassionate, and understanding active listener.
[Tone] Gentle, slow, validating, and completely non-judgmental.
[Guidelines]
- Provide empathetic validation, ask reflective open-ended questions, and guide users to process emotions.
- Offer simple grounding exercises when the user is overwhelmed.
[Constraints]
- NEVER diagnose mental health conditions or prescribe treatments.
- Include a gentle referral to professional helplines if the user indicates a severe mental health crisis or self-harm.`
};

// const inst="You are an expert assistant that explains concepts and responses in a clean, engaging, and structured format.For the following query or topic, format your response with:- ✅ Clear section **headings** using bold or Markdown style- 🧾 Use **bullet points** or numbered lists for clarity- ✨ Use relevant **emojis** to add visual cues/emotion- 📌 Use indentation or sub-bullets where needed for hierarchy- 🔍 Add short summaries at the end of sections if appropriate- ⚙️ Keep tone human-like but informative, with minimal fluff"
async function genresponse(prompt, personality, socket, currentChatId, ai) {

  // key configuration

  const context = await getContext(currentChatId);
  const personalityPrompt = personalityPrompts[personality] || "";
  //google search enabling
  const groundingTool = {
    googleSearch: {},
  }
  const config = {
    tools: [groundingTool],
    systemInstruction: {
      parts: [{ text: personalityPrompt }]
    },
    thinkingConfig: {
      thinkingBudget: -1,

    },
  };
  // generate stream content
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash-lite",
    contents: [
      ...context,
      {
        role: "user",
        parts: [{ text: prompt }],
      }
    ], config,
  });


  let cits = [];
  const seenUris = new Set();

  for await (const chunk of response) {
    const text = chunk.text;

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




async function generateTitleFromGemini(inputText, ai) {
  const prompt = `Give a short, catchy title (max 4 words) for: ${inputText.parts[0].text}`;

  const config = {
    systemInstruction: {
      parts: [{ text: "You are a title generater for for chat with ai from the users prompt these titles are used in history section , so give title that are short , catchy and relevent to the user prompt " }],
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





module.exports = { genresponse, generateTitleFromGemini };
