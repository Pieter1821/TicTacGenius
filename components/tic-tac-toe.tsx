"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle, Circle, RefreshCw, GitBranch, Trophy, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import GameAnalysis from "./game-analysis"
import confetti from "canvas-confetti"

// Constants
const EMPTY = null
const PLAYER_X = "X"
const PLAYER_O = "O"

export default function TicTacToe() {
  // Game state - simplified flat array representation
  const [squares, setSquares] = useState(Array(9).fill(EMPTY))
  const [isXNext, setIsXNext] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [aiDepth, setAiDepth] = useState(3)
  const [gameHistory, setGameHistory] = useState<Array<{ squares: Array<string | null>; player: string }>>([])
  const [aiThinking, setAiThinking] = useState(false)
  const [analysis, setAnalysis] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastMove, setLastMove] = useState<number | null>(null)
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 })
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)
  const [gameTime, setGameTime] = useState(0)

  // Initialize the game
  useEffect(() => {
    resetGame()
  }, [])

  // Timer for game duration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameStartTime && !gameOver) {
      interval = setInterval(() => {
        setGameTime(Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameStartTime, gameOver])

  const resetGame = () => {
    setSquares(Array(9).fill(EMPTY))
    setIsXNext(true)
    setGameOver(false)
    setWinner(null)
    setGameHistory([])
    setAnalysis("")
    setLastMove(null)
    setGameStartTime(new Date())
    setGameTime(0)
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Check for winner
  const calculateWinner = (squares: Array<string | null>): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }

    return null
  }

  // Check if the game is a draw
  const isDraw = (squares: Array<string | null>): boolean => {
    return squares.every((square) => square !== EMPTY) && !calculateWinner(squares)
  }

  // Handle player move
  const handleClick = (i: number) => {
    // Return if game is over or square is filled or it's AI's turn
    if (gameOver || squares[i] !== EMPTY || !isXNext) return

    const newSquares = [...squares]
    newSquares[i] = PLAYER_X
    setLastMove(i)

    setSquares(newSquares)
    setGameHistory((prev) => [...prev, { squares: [...newSquares], player: PLAYER_X }])

    const nextWinner = calculateWinner(newSquares)
    if (nextWinner) {
      setGameOver(true)
      setWinner(nextWinner)
      setStats((prev) => ({ ...prev, wins: prev.wins + 1 }))
      // Trigger confetti for player win
      triggerConfetti()
    } else if (isDraw(newSquares)) {
      setGameOver(true)
      setStats((prev) => ({ ...prev, draws: prev.draws + 1 }))
    } else {
      setIsXNext(false) // Switch to AI's turn
    }
  }

  // Trigger confetti effect
  const triggerConfetti = () => {
    // First burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#4F46E5", "#7C3AED", "#EC4899"],
    })

    // Second burst after a short delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#3B82F6", "#8B5CF6", "#EC4899"],
      })

      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#3B82F6", "#8B5CF6", "#EC4899"],
      })
    }, 300)
  }

  // Minimax algorithm for AI
  const minimax = (
    squares: Array<string | null>,
    depth: number,
    isMaximizing: boolean,
    alpha = Number.NEGATIVE_INFINITY,
    beta: number = Number.POSITIVE_INFINITY,
  ): number => {
    const winner = calculateWinner(squares)

    // Terminal states
    if (winner === PLAYER_O) return 10 - depth
    if (winner === PLAYER_X) return depth - 10
    if (isDraw(squares)) return 0
    if (depth >= aiDepth) return 0

    if (isMaximizing) {
      let bestScore = Number.NEGATIVE_INFINITY
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          const newSquares = [...squares]
          newSquares[i] = PLAYER_O
          const score = minimax(newSquares, depth + 1, false, alpha, beta)
          bestScore = Math.max(bestScore, score)
          alpha = Math.max(alpha, bestScore)
          if (beta <= alpha) break
        }
      }
      return bestScore
    } else {
      let bestScore = Number.POSITIVE_INFINITY
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          const newSquares = [...squares]
          newSquares[i] = PLAYER_X
          const score = minimax(newSquares, depth + 1, true, alpha, beta)
          bestScore = Math.min(bestScore, score)
          beta = Math.min(beta, bestScore)
          if (beta <= alpha) break
        }
      }
      return bestScore
    }
  }

  // AI move
  const makeAiMove = async () => {
    if (gameOver) return

    setAiThinking(true)

    // Add a small delay to make AI thinking visible
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find all empty squares
    const emptySquares = squares.map((square, index) => (square === EMPTY ? index : -1)).filter((index) => index !== -1)

    // If no empty squares, return
    if (emptySquares.length === 0) {
      setAiThinking(false)
      return
    }

    // Default to a random move
    let bestMove = emptySquares[Math.floor(Math.random() * emptySquares.length)]
    let bestScore = Number.NEGATIVE_INFINITY

    // Try to find the best move using minimax
    for (const index of emptySquares) {
      const newSquares = [...squares]
      newSquares[index] = PLAYER_O
      const score = minimax(newSquares, 0, false)

      if (score > bestScore) {
        bestScore = score
        bestMove = index
      }
    }

    // Make the move
    const newSquares = [...squares]
    newSquares[bestMove] = PLAYER_O
    setLastMove(bestMove)

    setSquares(newSquares)
    setGameHistory((prev) => [...prev, { squares: [...newSquares], player: PLAYER_O }])

    const nextWinner = calculateWinner(newSquares)
    if (nextWinner) {
      setGameOver(true)
      setWinner(nextWinner)
      setStats((prev) => ({ ...prev, losses: prev.losses + 1 }))
    } else if (isDraw(newSquares)) {
      setGameOver(true)
      setStats((prev) => ({ ...prev, draws: prev.draws + 1 }))
    } else {
      setIsXNext(true) // Switch back to player's turn
    }

    setAiThinking(false)
  }

  // AI's turn
  useEffect(() => {
    if (!isXNext && !gameOver) {
      const timeoutId = setTimeout(() => {
        makeAiMove()
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [isXNext, gameOver, squares])

  // Get Groq analysis of the game
  const getGameAnalysis = async () => {
    setIsAnalyzing(true)

    try {
      // Convert flat array to 2D array for better visualization in the analysis
      const boardHistory = gameHistory.map((state) => {
        const board = [
          [state.squares[0], state.squares[1], state.squares[2]],
          [state.squares[3], state.squares[4], state.squares[5]],
          [state.squares[6], state.squares[7], state.squares[8]],
        ]

        return {
          board: board.map((row) => row.map((cell) => cell || " ")),
          player: state.player,
        }
      })

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameHistory: boardHistory,
          winner,
          isDraw: gameOver && !winner,
          aiDepth,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get analysis")
      }

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      console.error("Error getting game analysis:", error)
      setAnalysis("Sorry, there was an error analyzing the game.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Change AI difficulty
  const changeAiDepth = (depth: number) => {
    setAiDepth(depth)
    resetGame()
  }

  // Render a square
  const renderSquare = (i: number) => (
    <motion.button
      onClick={() => handleClick(i)}
      disabled={gameOver || squares[i] !== EMPTY || !isXNext || aiThinking}
      className={`w-28 h-28 md:w-32 md:h-32 text-5xl font-bold flex items-center justify-center transition-all duration-200 
      ${lastMove === i ? "ring-4 ring-yellow-400" : ""}
      ${
        squares[i] === EMPTY
          ? "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 shadow-sm hover:shadow-md"
          : squares[i] === PLAYER_X
            ? "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 shadow-md"
            : "bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600 shadow-md"
      } rounded-xl`}
      aria-label={`Square ${i}`}
      whileHover={{ scale: squares[i] === EMPTY && !gameOver && isXNext ? 1.05 : 1 }}
      whileTap={{ scale: squares[i] === EMPTY && !gameOver && isXNext ? 0.95 : 1 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {squares[i] === PLAYER_X && (
          <motion.div
            key="x"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <XCircle className="h-16 w-16" />
          </motion.div>
        )}
        {squares[i] === PLAYER_O && (
          <motion.div
            key="o"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Circle className="h-16 w-16" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )

  return (
    <div className="flex flex-col md:flex-row w-full gap-8">
      <div className="flex flex-col items-center">
        <Card className="p-6 shadow-xl bg-white rounded-xl border-0 max-w-2xl">
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`font-bold text-xl ${isXNext && !gameOver ? "text-blue-600" : "text-gray-600"}`}>
                  <span className="flex items-center">
                    <XCircle className="h-6 w-6 mr-1" />
                    <span className="hidden sm:inline">You</span>
                  </span>
                </div>
                <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {gameOver ? "Game Over" : isXNext ? "Your Turn" : "AI Thinking..."}
                </div>
                <div className={`font-bold text-xl ${!isXNext && !gameOver ? "text-rose-600" : "text-gray-600"}`}>
                  <span className="flex items-center">
                    <Circle className="h-6 w-6 mr-1" />
                    <span className="hidden sm:inline">AI</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <GitBranch className="h-4 w-4" />
                <span className="font-medium">Depth: {aiDepth}</span>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{formatTime(gameTime)}</span>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Trophy className="h-4 w-4" />
                <span>
                  {stats.wins}-{stats.losses}-{stats.draws}
                </span>
              </div>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-3 gap-4 mb-6 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {Array(9)
              .fill(null)
              .map((_, i) => renderSquare(i))}
          </motion.div>

          {gameOver && (
            <motion.div
              className="mb-4 text-center p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {winner ? (
                <p className="text-xl font-bold">
                  {winner === PLAYER_X ? (
                    <span className="text-blue-600 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 mr-2" /> You Win!
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center justify-center">
                      <Circle className="h-6 w-6 mr-2" /> AI Wins!
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-xl font-bold text-gray-600">It's a Draw!</p>
              )}
            </motion.div>
          )}

          {aiThinking && (
            <div className="mb-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div
                  className="w-2 h-2 bg-rose-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-rose-600 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-rose-600 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 mt-4">
            <Button
              onClick={resetGame}
              variant="outline"
              className="w-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 shadow-sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> New Game
            </Button>

            <div className="grid grid-cols-3 gap-2">
              {[
                { depth: 1, label: "Easy", color: "from-green-50 to-green-100 border-green-200 text-green-700" },
                { depth: 3, label: "Medium", color: "from-amber-50 to-amber-100 border-amber-200 text-amber-700" },
                { depth: 5, label: "Hard", color: "from-red-50 to-red-100 border-red-200 text-red-700" },
              ].map((option) => (
                <Button
                  key={option.depth}
                  onClick={() => changeAiDepth(option.depth)}
                  variant={aiDepth === option.depth ? "default" : "outline"}
                  size="sm"
                  className={`text-xs font-medium ${
                    aiDepth === option.depth ? `bg-gradient-to-r ${option.color} shadow-sm border` : "bg-white"
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <Button
              onClick={getGameAnalysis}
              variant="outline"
              disabled={gameHistory.length === 0 || isAnalyzing}
              className="mt-2 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-indigo-200 text-indigo-700 shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze Game with Groq"
              )}
            </Button>
          </div>
        </Card>
      </div>

      <GameAnalysis
        analysis={analysis}
        gameHistory={gameHistory.map((state) => {
          // Convert flat array to 2D array for display
          const board = [
            [state.squares[0] || " ", state.squares[1] || " ", state.squares[2] || " "],
            [state.squares[3] || " ", state.squares[4] || " ", state.squares[5] || " "],
            [state.squares[6] || " ", state.squares[7] || " ", state.squares[8] || " "],
          ]
          return { board, player: state.player }
        })}
        winner={winner}
        isDraw={gameOver && !winner}
      />
    </div>
  )
}
