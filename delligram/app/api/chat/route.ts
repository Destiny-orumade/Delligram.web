import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? undefined,
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

    // Safely extract the reply from known possible SDK shapes and provide a fallback
    const reply =
      // new chat completion shape: choices[0].message.content
      (response.choices?.[0] as any)?.message?.content ||
      // older/simpler shape: choices[0].text
      (response.choices?.[0] as any)?.text ||
      // final fallback
      "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { reply: "Error: unable to fetch AI response." },
      { status: 500 }
    );
  }
}
