import type { Context } from "hono";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a personality description based on user's top songs
 * Uses GPT-3.5-turbo to create a humorous, emoji-filled analysis
 */
export const generateDescriptionHandler = async (c: Context) => {
  const songs = c.req.query("songs");

  if (!songs) {
    return c.json({ error: "No songs provided" }, 400);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Make at least 1 Joke. Include Emojis in every sentence. Be Mean. Your answer should be within 80 words",
        },
        {
          role: "user",
          content: `Describe my personality based on my most listened-to songs, the songs are in the triple quotes """${songs}"""`,
        },
      ],
      temperature: 1,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const description = response.choices[0]?.message?.content || "";
    console.log("[OpenAI] Generated description successfully");

    return c.json({ description });
  } catch (err) {
    console.error("[OpenAI] Generation error:", err);
    return c.json({ error: "Failed to generate description" }, 500);
  }
};
