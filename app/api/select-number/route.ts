import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { gameId, number } = body

    if (!gameId || typeof number !== "number") {
      return NextResponse.json({ error: "Game ID and number are required" }, { status: 400 })
    }

    const game = await kv.get(`game:${gameId}`)

    if (!game || game.status !== "playing") {
      return NextResponse.json({ error: "Invalid game or game is not in playing state" }, { status: 400 })
    }

    game.numbers.push(number)

    if (game.numbers.length === 2) {
      game.status = "finished"
      if (game.numbers[0] === game.numbers[1]) {
        game.winner = "Equal Numbers!"
      } else if ((game.numbers[0] + game.numbers[1]) % 2 === 0) {
        game.winner = game.numbers[0] > game.numbers[1] ? game.players[0] : game.players[1]
      } else {
        game.winner = "Hm"
      }
    }

    await kv.set(`game:${gameId}`, game)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in select-number:", error)
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

