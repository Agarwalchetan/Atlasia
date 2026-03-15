import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { location, category, language = "en" } = await req.json();

    const languageNames: Record<string, string> = {
      en: "English", ja: "Japanese", zh: "Chinese", es: "Spanish", fr: "French",
      de: "German", it: "Italian", pt: "Portuguese", ar: "Arabic", hi: "Hindi",
      ko: "Korean", ru: "Russian", tr: "Turkish", th: "Thai", vi: "Vietnamese",
    };
    const targetLanguage = languageNames[language] || "English";
    const country = location || "Japan";

    const prompt = `Generate essential travel phrases for a traveler visiting ${country}.
Category: ${category || "all categories"}
Translate each phrase to the LOCAL language of ${country} and provide phonetic pronunciation.

Return a JSON array:
[
  {
    "id": "unique-id",
    "category": "greetings/directions/food/emergency/transportation/shopping/accommodation",
    "english": "English phrase",
    "translated": "Translated text in local language",
    "pronunciation": "Phonetic pronunciation guide in ${targetLanguage}"
  }
]

Generate 5-8 phrases per category. If no category specified, generate phrases for: greetings, directions, food, emergency.
Respond ONLY with the JSON array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content || "[]";
    let phrases;
    try {
      phrases = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      phrases = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }

    return NextResponse.json({ phrases });
  } catch (error) {
    console.error("Phrases error:", error);
    return NextResponse.json({ error: "Failed to generate phrases" }, { status: 500 });
  }
}
