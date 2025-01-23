import GameComponent from "./components/GameComponent"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">1-10 Game</h1>
        <GameComponent />
      </div>
    </div>
  )
}

