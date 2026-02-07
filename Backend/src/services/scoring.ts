export type Answer = {
  questionId: string
  value: number
  category: "emotional" | "cognitive" | "physical" | "support"
  reverse?: boolean
}

export function calculateBurnoutScore(answers: Answer[]) {
  let total = 0
  const categoryTotals: Record<string, number> = {}

  for (const a of answers) {
    const value = a.reverse ? 6 - a.value : a.value
    total += value
    categoryTotals[a.category] =
      (categoryTotals[a.category] || 0) + value
  }

  const score = Math.round((total / 60) * 100)

  const severity =
    score >= 67 ? "high" :
    score >= 34 ? "medium" :
    "low"

  return {
    score,
    severity,
    categoryTotals
  }
}
