import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are delligram AI — an expert assistant trained on the Aztec Network, Noir language, privacy-preserving smart contracts, and zero-knowledge proofs. You answer questions clearly, concisely, and help developers understand zk concepts.",
        },
        { role: "user", content: prompt },
      ],
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ reply: "Error: unable to fetch AI response." });
  }
}
