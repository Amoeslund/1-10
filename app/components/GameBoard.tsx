"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function GameBoard({ gameId }: { gameId: string }) {
  const [gameState, setGameState] = useState<any>(null)
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch(`/api/game-state?gameId=${gameId}`)
        if (response.ok) {
          const data = await response.json()
          setGameState(data)
          setError(null)
        } else {
          const errorData = await response.json()
          setError(errorData.error || "Failed to fetch game state")
        }
      } catch (error) {
        console.error("Error fetching game state:", error)
        setError("Failed to fetch game state")
      }
    }

    fetchGameState()
    const interval = setInterval(fetchGameState, 2000)

    return () => clearInterval(interval)
  }, [gameId])

  const selectNumber = async (number: number) => {
    try {
      setSelectedNumber(number)
      const response = await fetch("/api/select-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, number }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to select number",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error selecting number:", error)
      toast({
        title: "Error",
        description: "Failed to select number",
        variant: "destructive",
      })
    }
  }

  if (error) return <div className="text-red-500">{error}</div>
  if (!gameState) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">{gameState.title}</h2>
      <div className="text-center">
        <p>Players: {gameState.players.join(", ")}</p>
        <p>Status: {gameState.status}</p>
      </div>
      {gameState.status === "waiting" && <p>Waiting for another player to join...</p>}
      {gameState.status === "playing" && (
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
            <Button
              key={number}
              onClick={() => selectNumber(number)}
              disabled={selectedNumber !== null}
              variant={selectedNumber === number ? "default" : "outline"}
            >
              {number}
            </Button>
          ))}
        </div>
      )}
      {gameState.status === "finished" && (
        <div className="text-center">
          <p>Game Over!</p>
          <p>Player 1 chose: {gameState.numbers[0]}</p>
          <p>Player 2 chose: {gameState.numbers[1]}</p>
          <p>Result: {gameState.winner === "No winner" ? "No winner (sum is odd)" : `Winner: ${gameState.winner}`}</p>
        </div>
      )}
    </div>
  )
}

