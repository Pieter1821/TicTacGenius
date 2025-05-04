# Tic-Tac-Toe with AI



A modern, interactive Tic-Tac-Toe game where you play against an AI opponent powered by the minimax algorithm, with game analysis provided by Groq's LLM.

## ✨ Features

- 🎮 Beautiful, responsive game board with smooth animations
- 🤖 AI opponent with adjustable difficulty levels
- 🧠 Minimax algorithm implementation for optimal AI moves
- 📊 Game analysis powered by Groq's LLM
- 🎯 Move history and replay functionality
- 🎉 Confetti celebration for wins
- ⏱️ Game timer and statistics tracking
- 📱 Fully responsive design for all devices

## 🛠️ Technologies Used

- **Next.js** - React framework for the application
- **TypeScript** - For type-safe code
- **Tailwind CSS** - For styling
- **Framer Motion** - For animations
- **Canvas Confetti** - For celebration effects
- **Groq API** - For game analysis
- **AI SDK** - For integrating with Groq's LLM

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Groq API key

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/Pieter1821/TicTacGenius.git
   cd tic-tac-toe-ai
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. Set up your environment variables:
   Create a `.env.local` file in the root directory and add your Groq API key:
   \`\`\`
   GROQ_API_KEY=your_groq_api_key_here
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the game.

## 🎮 How to Play

1. **Start a New Game**: The game starts with you (X) making the first move.
2. **Make Your Move**: Click on any empty square to place your X.
3. **AI's Turn**: The AI will automatically make its move (O).
4. **Win the Game**: Get three of your marks in a horizontal, vertical, or diagonal row to win.
5. **Analyze Your Game**: After playing, click "Analyze Game with Groq" to get AI-powered insights about your gameplay.
6. **Adjust Difficulty**: Choose between Easy, Medium, and Hard difficulty levels.

## 🧠 AI Implementation

The AI opponent uses the minimax algorithm with alpha-beta pruning to determine the optimal move:

- **Easy Mode**: AI looks 1 move ahead
- **Medium Mode**: AI looks 3 moves ahead
- **Hard Mode**: AI looks 5 moves ahead

The minimax algorithm evaluates all possible moves and their outcomes to choose the move that maximizes the AI's chances of winning while minimizing the player's chances.

## 📊 Groq Analysis

After completing a game, you can request an analysis from Groq's LLM. The analysis provides insights on:

1. The quality of moves by the player
2. Strategic mistakes made during the game
3. Whether the AI made optimal moves
4. Suggestions for improvement

## 📱 Responsive Design

The game is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

The layout and controls adapt to different screen sizes for an optimal experience on any device.

## 🔮 Future Enhancements

- [ ] Multiplayer mode
- [ ] User accounts and persistent statistics
- [ ] More advanced AI algorithms
- [ ] Game replay animations
- [ ] Sound effects
- [ ] Dark mode
- [ ] Additional board sizes (4x4, 5x5)
- [ ] Game sharing functionality

## 🙏 Acknowledgments

- Groq for providing the LLM API for game analysis
- The React and Next.js teams for the amazing frameworks
- The open-source community for the libraries used in this project

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by Pieter Deane
\`\`\`
