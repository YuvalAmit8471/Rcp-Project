import express from "express";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: "Missing prompt" });
  }

  try {
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        prompt: `Create a detailed recipe based on this request: "${prompt}".\n\nPlease respond with a JSON object in exactly this format:\n{\n  "title": "Recipe Name",\n  "description": "Brief description of the recipe",\n  "ingredients": ["ingredient 1", "ingredient 2", ...],\n  "instructions": ["step 1", "step 2", ...],\n  "cookTime": "XX min",\n  "servings": number,\n  "difficulty": "Easy/Medium/Hard",\n  "category": "Main/Dessert/Appetizer/etc"\n}\n\nMake sure the response is valid JSON only, no additional text.`,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      return res
        .status(500)
        .json({ message: "Ollama error", error: errorText });
    }

    const data = (await ollamaResponse.json()) as { response: string };
    // Remove markdown code block if present (Ollama sometimes wraps JSON in ```json ... ```)
    let responseText = data.response.trim();
    if (responseText.startsWith("```json")) {
      responseText = responseText
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (responseText.startsWith("```")) {
      responseText = responseText
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();
    }
    res.json({ success: true, result: responseText });
  } catch (error) {
    res.status(500).json({
      message: "AI generation failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
