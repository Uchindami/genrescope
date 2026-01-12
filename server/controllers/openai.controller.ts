import type { Context } from "hono";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// Prompt Building Helpers
// ============================================

/**
 * Build a rich system prompt that guides the AI's personality
 */
function buildSystemPrompt(): string {
  return `You are a witty music psychologist analyzing someone's personality through their Spotify listening habits.

STYLE GUIDELINES:
- Be playfully sarcastic but not cruel
- Use 2-3 emojis total (NOT every sentence)
- Make 1-2 clever, specific observations
- Be observant about what their music choices reveal
- Sound like a friend roasting them, not a hostile stranger

LENGTH: 100-130 words maximum

FOCUS ON:
- What their song choices reveal about their personality
- Any patterns or contradictions in their taste
- Specific references to songs/artists that stand out
- A memorable closing line they'll want to share

Make it personal and insightful - the kind of analysis that makes them say "wait, how did you know that?!"`;
}

/**
 * Build the user prompt with song context
 */
function buildUserPrompt(songs: string): string {
  return `Analyze this person's personality based on their top listened songs:

"""
${songs}
"""

Give me a witty, insightful personality analysis based on these song choices.`;
}

// ============================================
// Handler
// ============================================

/**
 * Generates a personality description based on user's top songs
 * Uses GPT-4o-mini for higher quality output
 */
export const generateDescriptionHandler = async (c: Context) => {
  const songs = c.req.query("songs");

  if (!songs) {
    return c.json({ error: "No songs provided" }, 400);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(),
        },
        {
          role: "user",
          content: buildUserPrompt(songs),
        },
      ],
      temperature: 0.8, // Lower for more consistent quality
      max_tokens: 200, // Allow longer, richer responses
      presence_penalty: 0.6, // Encourage diverse vocabulary
      frequency_penalty: 0.4, // Reduce repetition
    });

    const description = response.choices[0]?.message?.content || "";
    console.log("[OpenAI] Generated description successfully");

    return c.json({ description });
  } catch (err) {
    console.error("[OpenAI] Generation error:", err);
    return c.json({ error: "Failed to generate description" }, 500);
  }
};
