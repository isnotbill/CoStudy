import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  const openai = new OpenAI({ apiKey })

  try {
    const { messages } = await req.json()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 200,
      messages,
    })
    return NextResponse.json(completion.choices[0].message)
  } catch (err) {
    console.error('OpenAI call failed:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
