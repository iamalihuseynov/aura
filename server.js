const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Redirect root to aura.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "aura.html"));
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemPrompt, maxTokens, apiKey } = req.body;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
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

app.listen(process.env.PORT || 3000, () => console.log("Aura running"));
