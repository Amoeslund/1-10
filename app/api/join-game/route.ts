import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { gameId, playerName, gameTitle } = body

    if (!gameId || !playerName || !gameTitle) {
      return NextResponse.json({ error: "Game ID, player name, and game title are required" }, { status: 400 })
    }

    const game = await kv.get(`game:${gameId}`)

    if (!game || game.players.length >= 2) {
      return NextResponse.json({ error: "Invalid game or game is full" }, { status: 400 })
    }

    if (!game.title) {
      game.title = gameTitle
    }

    game.players.push(playerName)
    game.status = "playing"
    await kv.set(`game:${gameId}`, game)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in join-game:", error)
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

