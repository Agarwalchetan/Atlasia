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

    const prompt = `You are a cultural intelligence expert. Generate cultural etiquette and intelligence for "${location}" in ${targetLanguage}.

Return a JSON object:
{
  "greetingCustoms": ["Custom 1", "Custom 2", "Custom 3"],
  "diningEtiquette": ["Tip 1", "Tip 2", "Tip 3"],
  "socialNorms": ["Norm 1", "Norm 2", "Norm 3"],
  "thingsToAvoid": ["Avoid 1", "Avoid 2", "Avoid 3"],
  "dresscode": "General dress code guidance",
  "tipping": "Tipping customs and expectations",
  "religiousConsiderations": ["Consideration 1", "Consideration 2"]
}

Be specific, accurate, and culturally sensitive. Provide at least 3-4 items per category.
Respond ONLY with the JSON object.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 1200,
    });

    const content = response.choices[0].message.content || "{}";
    let intelligence;
    try {
      intelligence = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      intelligence = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    }

    return NextResponse.json({ intelligence, location });
  } catch (error) {
    console.error("Cultural intelligence error:", error);
    return NextResponse.json({ error: "Failed to generate cultural intelligence" }, { status: 500 });
  }
}
