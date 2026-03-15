import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text, fromLang, toLang } = await req.json();

    if (!text || !fromLang || !toLang) {
      return NextResponse.json({ error: "text, fromLang, and toLang are required" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate text from ${fromLang} to ${toLang}. 
                    Return a JSON object: { "translation": "...", "pronunciation": "..." }
                    The pronunciation should be a romanized/phonetic guide if the target language uses non-Latin script.
                    Respond ONLY with the JSON object.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content || "{}";
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { translation: content, pronunciation: "" };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
