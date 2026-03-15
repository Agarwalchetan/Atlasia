import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { location, language = "en" } = await req.json();

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }

    const languageNames: Record<string, string> = {
      en: "English", ja: "Japanese", zh: "Chinese", es: "Spanish", fr: "French",
      de: "German", it: "Italian", pt: "Portuguese", ar: "Arabic", hi: "Hindi",
      ko: "Korean", ru: "Russian", tr: "Turkish", th: "Thai", vi: "Vietnamese",
    };

    const targetLanguage = languageNames[language] || "English";

    const prompt = `You are an expert travel guide AI. Generate a comprehensive travel guide for "${location}" in ${targetLanguage}.

Return a JSON object with this exact structure:
{
  "overview": "2-3 sentence engaging overview of the destination",
  "bestTimeToVisit": "When to visit and why",
  "mustVisitPlaces": [
    {
      "name": "Place name",
      "description": "What makes it special",
      "category": "attraction/temple/museum/park/landmark",
      "rating": 4.8
    }
  ],
  "famousFood": [
    {
      "name": "Food name",
      "description": "What it is and why it's famous",
      "where": "Where to try it",
      "mustTry": true
    }
  ],
  "culturalEtiquette": [
    {
      "category": "Greeting/Dining/Dress/Behavior",
      "tip": "The specific tip",
      "severity": "important/good-to-know/avoid"
    }
  ],
  "transportationTips": ["tip1", "tip2", "tip3"],
  "hiddenGems": ["gem1", "gem2", "gem3"],
  "emergencyNumbers": [
    { "service": "Police", "number": "110" },
    { "service": "Ambulance", "number": "119" }
  ]
}

Provide at least 5 must-visit places, 4 foods, 5 cultural tips, 3 transportation tips, 3 hidden gems.
Respond ONLY with the JSON object, no markdown.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content || "{}";
    
    let guide;
    try {
      guide = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      guide = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    }

    return NextResponse.json({ guide, location });
  } catch (error) {
    console.error("Travel guide error:", error);
    return NextResponse.json(
      { error: "Failed to generate travel guide" },
      { status: 500 }
    );
  }
}
