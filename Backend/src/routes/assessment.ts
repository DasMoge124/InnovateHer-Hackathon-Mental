import { Request, Response } from "express"
import { calculateBurnoutScore } from "../services/scoring"
import { logAssessmentAnalytics } from "../services/snowflake"

export async function submitAssessment(req: Request, res: Response) {
  const { answers } = req.body

  const result = calculateBurnoutScore(answers)

  await logAssessmentAnalytics({
    score: result.score,
    severity: result.severity,
    emotional: result.categoryTotals.emotional || 0,
    cognitive: result.categoryTotals.cognitive || 0,
    physical: result.categoryTotals.physical || 0,
    support: result.categoryTotals.support || 0
  })

  res.json({
    score: result.score,
    severity: result.severity
  })
}
