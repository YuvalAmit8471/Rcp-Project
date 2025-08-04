import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Missing prompt" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiText = response.choices[0]?.message?.content;

    if (!aiText) {
      return res.status(500).json({ message: "No response from AI" });
    }

    res.json({ success: true, result: aiText });
  } catch (error) {
    console.error("OpenAI error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    res
      .status(500)
      .json({ message: "AI generation failed", error: errorMessage });
  }
});

export default router;
