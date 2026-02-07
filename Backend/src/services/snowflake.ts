import snowflake from "snowflake-sdk"

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USERNAME,
  password: process.env.SNOWFLAKE_PASSWORD,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE
})

function connect() {
  return new Promise<void>((resolve, reject) => {
    connection.connect(err => err ? reject(err) : resolve())
  })
}

export async function logAssessmentAnalytics(data: {
  score: number
  severity: string
  emotional: number
  cognitive: number
  physical: number
  support: number
}) {
  await connect()

  const sql = `
    INSERT INTO ASSESSMENT_RESULTS
    (total_score, severity, emotional, cognitive, physical, support)
    VALUES (?, ?, ?, ?, ?, ?)
  `

  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText: sql,
      binds: Object.values(data),
      complete: err => err ? reject(err) : resolve(true)
    })
  })
}
