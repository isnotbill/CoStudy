// import OpenAI from "openai";
// import { NextRequest, NextResponse } from "next/server";

// export const runtime = 'nodejs';

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// export async function POST(req: NextRequest) {
//   try {
//     const { messages } = await req.json();

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       max_tokens: 200,     
//       messages,                 
//     });

//     const reply = completion.choices[0].message; 
//     return NextResponse.json(reply);
//   } catch (err) {
//     console.error("OpenAI failed:", err);
//     return NextResponse.json({ error: "Server err" }, { status: 500 });
//   }
// }


import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {

  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    console.error("🔑 Missing OPENAI_API_KEY!");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }


  const openai = new OpenAI({ apiKey });

  try {
    const { messages } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 200,
      messages,
    });
    return NextResponse.json(completion.choices[0].message);
  } catch (err) {
    console.error("OpenAI call failed:", err);
    return NextResponse.json({ error: "Server err" }, { status: 500 });
  }
}
