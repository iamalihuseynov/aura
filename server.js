const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serves your aura.html

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemPrompt, maxTokens, apiKey } = req.body;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: "llama-3.3-70b-versatile",  // change this line
    max_tokens: maxTokens || 600,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  }),
});
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
});

app.listen(3000, () => console.log("Aura running at http://localhost:3000"));