import express from "express"
import { submitAssessment } from "./src/routes/assessment"
import { submitReflection } from "./src/routes/reflection"

const app = express()
app.use(express.json())

app.post("/assessment/submit", submitAssessment)
app.post("/reflection/submit", submitReflection)

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001")
})
