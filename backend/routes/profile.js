import express from "express";
import crypto from "crypto";
import { askClaude } from "../services/claude.js";

const router = express.Router();

const profileStore = new Map();

router.post("/generate", async (req, res) => {
  try {
    const { rawDescription, language } = req.body;
    if (!rawDescription) {
      return res.status(400).json({ error: "rawDescription is required" });
    }

    const systemPrompt = `You are AI Sahayak, an assistant that turns a small business owner's
casual description (possibly in Hindi/Hinglish/regional language) into a clean,
structured, AI-agent-readable business profile.

Return ONLY valid JSON, no markdown, no preamble, in this exact shape:
{
  "business_name": string,
  "category": string,
  "short_description": string (2-3 sentences, in English, written the way an LLM would want to read it),
  "specialties": [string],
  "location": string,
  "price_range": string,
  "unique_selling_points": [string],
  "contact_hint": string,
  "original_language_summary": string (a short summary written back in the same language the owner used)
}`;

    const userPrompt = `Owner's description (language: ${language || "auto-detect"}):
"""
${rawDescription}
"""`;

    const raw = await askClaude(systemPrompt, userPrompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const profile = JSON.parse(cleaned);

    const id = crypto.randomUUID();
    profileStore.set(id, profile);

    res.json({ profile, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate profile" });
  }
});

router.get("/:id", (req, res) => {
  const profile = profileStore.get(req.params.id);
  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }
  res.json({ profile });
});

export default router;