import TicTacToe from "@/components/tic-tac-toe"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-3 sm:p-6 md:p-8 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-7xl flex flex-col items-center justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          Tic-Tac-Toe with AI
        </h1>
        <p className="text-base sm:text-lg text-center mb-6 sm:mb-8 text-gray-600 max-w-xl px-2">
          Play against an AI opponent powered by the minimax algorithm, with game analysis by Groq.
        </p>
        <TicTacToe />
      </div>
    </main>
  )
}
