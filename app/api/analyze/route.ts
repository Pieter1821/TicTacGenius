import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const { gameHistory, winner, isDraw, aiDepth } = await request.json()

    const gameState = gameHistory
      .map((state: any, moveNum: number) => {
        return `Move ${moveNum + 1} by ${state.player}: 
${state.board.map((row: string[]) => row.join(" | ")).join("\n---------\n")}`
      })
      .join("\n\n")

    const prompt = `
You are a tic-tac-toe expert. Analyze this game from the human's perspective (player X):

${gameState}

${winner ? `The game ended with ${winner} winning` : isDraw ? "The game ended in a draw" : "The game is still in progress"}

Provide a brief analysis (approx. 100 words) of:
1. The quality of moves by player X
2. Any strategic mistakes made
3. Whether the AI (player O) made optimal moves with minimax at depth ${aiDepth}
4. Suggestions for how player X could improve
`

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      maxTokens: 300,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error in analyze route:", error)
    return NextResponse.json({ error: "Failed to analyze game" }, { status: 500 })
  }
}
