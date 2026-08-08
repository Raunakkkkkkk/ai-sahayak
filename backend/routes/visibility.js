import express from "express";
import { askClaude } from "../services/claude.js";

const router = express.Router();

// POST /api/visibility/test
router.post("/test", async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) return res.status(400).json({ error: "profile is required" });

    const systemPrompt = `You are simulating how a generic AI shopping/discovery agent
(like ChatGPT or Gemini) would answer a buyer's local search question, GIVEN ONLY
what is publicly and typically available on the internet about small businesses like this
(i.e. assume this business has NO website and NO structured profile unless the profile below
is explicitly published somewhere).

Then, separately, simulate the same buyer question AGAIN assuming the structured profile
below WAS published as a webpage/listing that an AI agent could crawl.

Return ONLY valid JSON in this shape:
{
  "sample_queries": [string, string, string],
  "before": {
    "would_be_mentioned": boolean,
    "reasoning": string,
    "visibility_score": number (0-100)
  },
  "after": {
    "would_be_mentioned": boolean,
    "reasoning": string,
    "visibility_score": number (0-100)
  },
  "improvement_tips": [string]  // 3-5 simple, jargon-free, actionable tips
}`;

    const userPrompt = `Business profile:
${JSON.stringify(profile, null, 2)}`;

    const raw = await askClaude(systemPrompt, userPrompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to run visibility test" });
  }
});

export default router;