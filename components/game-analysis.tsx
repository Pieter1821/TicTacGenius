"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XCircle, Circle, Brain, History } from "lucide-react"
import { motion } from "framer-motion"

interface GameAnalysisProps {
  analysis: string
  gameHistory: Array<{ board: string[][]; player: string }>
  winner: string | null
  isDraw: boolean
}

export default function GameAnalysis({ analysis, gameHistory, winner, isDraw }: GameAnalysisProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1"
    >
      <Card className="shadow-xl bg-white rounded-xl border-0 h-full">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl border-b border-indigo-100">
          <CardTitle className="text-xl text-indigo-800 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-indigo-600" />
            Game Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger
                value="analysis"
                className="w-1/2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-800"
              >
                <Brain className="h-4 w-4 mr-2" />
                Groq Analysis
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="w-1/2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-800"
              >
                <History className="h-4 w-4 mr-2" />
                Move History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="p-4 focus-visible:outline-none focus-visible:ring-0">
              {analysis ? (
                <div className="prose max-w-none">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 shadow-sm">
                    <p className="whitespace-pre-line text-sm text-gray-700">{analysis}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
                  <Brain className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Click "Analyze Game with Groq" to get AI-powered insights about your gameplay.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="focus-visible:outline-none focus-visible:ring-0">
              {gameHistory.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto p-4">
                  {gameHistory.map((historyItem, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center mb-2">
                        <span
                          className={`font-medium flex items-center px-2 py-1 rounded-full text-xs ${
                            historyItem.player === "X" ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          Move {index + 1}:
                          {historyItem.player === "X" ? (
                            <XCircle className="h-3 w-3 ml-1" />
                          ) : (
                            <Circle className="h-3 w-3 ml-1" />
                          )}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 rounded-md">
                        {historyItem.board.map((row, rowIdx) =>
                          row.map((cell, colIdx) => (
                            <div
                              key={`${rowIdx}-${colIdx}`}
                              className={`
                                w-10 h-10 flex items-center justify-center text-sm
                                ${
                                  cell === "X"
                                    ? "bg-blue-100 text-blue-600"
                                    : cell === "O"
                                      ? "bg-rose-100 text-rose-600"
                                      : "bg-white"
                                }
                                rounded shadow-sm
                              `}
                            >
                              {cell === "X" ? (
                                <XCircle className="h-6 w-6" />
                              ) : cell === "O" ? (
                                <Circle className="h-6 w-6" />
                              ) : (
                                ""
                              )}
                            </div>
                          )),
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {winner || isDraw ? (
                    <div
                      className={`text-center p-2 rounded-lg font-medium ${
                        winner === "X"
                          ? "bg-blue-50 text-blue-700"
                          : winner === "O"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {winner ? `Game ended with ${winner === "X" ? "You" : "AI"} winning` : "Game ended in a draw"}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8 bg-gray-50">
                  <History className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No moves have been made yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
