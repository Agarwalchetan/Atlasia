import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { location, days, interests, budget = "moderate", language = "en" } = await req.json();

    if (!location || !days) {
      return NextResponse.json({ error: "Location and days are required" }, { status: 400 });
    }

    const languageNames: Record<string, string> = {
      en: "English", ja: "Japanese", zh: "Chinese", es: "Spanish", fr: "French",
      de: "German", it: "Italian", pt: "Portuguese", ar: "Arabic", hi: "Hindi",
      ko: "Korean", ru: "Russian", tr: "Turkish", th: "Thai", vi: "Vietnamese",
    };

    const targetLanguage = languageNames[language] || "English";

    const prompt = `You are an expert travel planner. Create a detailed ${days}-day travel itinerary for "${location}" in ${targetLanguage}.

User preferences:
- Interests: ${interests?.join(", ") || "general sightseeing"}
- Budget: ${budget}

Return a JSON array of day objects:
[
  {
    "day": 1,
    "theme": "Theme for this day",
    "morning": [
      {
        "time": "8:00 AM",
        "activity": "Activity name",
        "location": "Specific venue/place",
        "description": "What to do and why it's great",
        "duration": "2 hours",
        "tips": "Practical tip"
      }
    ],
    "afternoon": [...],
    "evening": [...]
  }
]

Make it realistic, specific, and culturally accurate. Each time period should have 1-2 activities.
Respond ONLY with the JSON array, no markdown.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = response.choices[0].message.content || "[]";

    let itinerary;
    try {
      itinerary = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      itinerary = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }

    return NextResponse.json({ itinerary, location, days });
  } catch (error) {
    console.error("Itinerary error:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
