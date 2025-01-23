import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { playerName, gameTitle } = body

    if (!playerName || !gameTitle) {
      return NextResponse.json({ error: "Player name and game title are required" }, { status: 400 })
    }

    const gameId = Math.random().toString(36).substring(2, 8)

    await kv.set(`game:${gameId}`, {
      id: gameId,
      title: gameTitle,
      players: [playerName],
      status: "waiting",
      numbers: [],
    })

    return NextResponse.json({ gameId })
  } catch (error) {
    console.error("Error in create-game:", error)
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

