// getTitleFromClaude.js
const fetch = globalThis.fetch
const dotenv = require("dotenv");
dotenv.config();
const Title_API_KEY=process.env.Title_API_KEY;

async function getTitleFromClaude(promptText) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Title_API_KEY}`,  // Replace this with your actual key
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",  // Or your frontend domain
      "X-Title": "AI Title Generator"
    },
    body: JSON.stringify({
      model: "anthropic/claude-3-haiku",
      messages: [
        {
          role: "system",
          content: "You are an assistant that generates short, catchy titles for chat history ."
        },
        {
          role: "user",
          content: `Summarize this into a short title  for chat history: ${promptText.parts[0].text}`
        }
      ],
      temperature: 0.3
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const title = data?.choices?.[0]?.message?.content?.trim();
  return JSON.parse(title);
}

// Test it (remove or comment out in production)
// (async () => {
//   try {
//     const prompt = "How do I learn JavaScript fast?";
//     const title = await getTitleFromClaude(prompt);
//     console.log("Generated Title:", title);
//   } catch (err) {
//     console.error("Error:", err.message);
//   }
// })();

module.exports = getTitleFromClaude;
