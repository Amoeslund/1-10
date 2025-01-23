"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export default function GameComponent() {
  const [gameId, setGameId] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [gameTitle, setGameTitle] = useState("")
  const router = useRouter()

  const createGame = async () => {
    try {
      const response = await fetch("/api/create-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, gameTitle }),
      })
      const data = await response.json()
      if (response.ok) {
        router.push(`/game/${data.gameId}`)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create game",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating game:", error)
      toast({
        title: "Error",
        description: "Failed to create game",
        variant: "destructive",
      })
    }
  }

  const joinGame = async () => {
    try {
      const response = await fetch(`/api/join-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, playerName, gameTitle }),
      })
      const data = await response.json()
      if (response.ok) {
        router.push(`/game/${gameId}`)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to join game",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error joining game:", error)
      toast({
        title: "Error",
        description: "Failed to join game",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Enter game title"
        value={gameTitle}
        onChange={(e) => setGameTitle(e.target.value)}
        className="w-full"
      />
      <Input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="w-full"
      />
      <Button onClick={createGame} className="w-full" disabled={!playerName || !gameTitle}>
        Create New Game
      </Button>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={joinGame} disabled={!gameId || !playerName || !gameTitle}>
          Join Game
        </Button>
      </div>
    </div>
  )
}

