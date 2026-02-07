import fetch from "node-fetch"

export async function speechToText(audioBase64: string) {
  const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ audio: audioBase64 })
  })

  const data = await response.json()
  return data.text
}