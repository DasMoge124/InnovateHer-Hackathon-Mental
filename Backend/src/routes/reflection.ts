import { Request, Response } from "express"
import { analyzeReflection } from "../services/gemini"
import { speechToText } from "../services/elevenlabs"

export async function submitReflection(req: Request, res: Response) {
  const { inputType, content } = req.body

  let text = content

  if (inputType === "voice") {
    text = await speechToText(content)
  }

  const analysis = await analyzeReflection(text)

  res.json({
    sentiment: analysis.sentiment,
    emotionalTone: analysis.emotionalTone,
    suggestion: analysis.suggestion
  })
}
