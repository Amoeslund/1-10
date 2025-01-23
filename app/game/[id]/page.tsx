import GameBoard from "@/app/components/GameBoard"

export default function GamePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Game {params.id}</h1>
        <GameBoard gameId={params.id} />
      </div>
    </div>
  )
}

