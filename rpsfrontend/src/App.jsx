import { useState } from "react";
import "./App.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [matchResult, setMatchResult] = useState("");
  const [history, setHistory] = useState([]);

  const startGame = () => {
    setGameStarted(true);
  };

  const play = async (choice) => {
    if (!gameStarted || gameOver) return;

    try {
      const response = await fetch(
  `https://stellar-vitality-production.up.railway.app/play?choice=${choice}`
);

      const data = await response.json();

      setResult(data);

      setHistory((prev) => [
        {
          player: data.player,
          computer: data.computer,
          result: data.result,
        },
        ...prev.slice(0, 9),
      ]);

      if (data.result === "You Win") {
        setPlayerScore((prev) => {
          const score = prev + 1;

          if (score === 3) {
            setGameOver(true);
            setMatchResult("🎉 You Won The Match!");
          }

          return score;
        });
      }

      if (data.result === "Computer Wins") {
        setComputerScore((prev) => {
          const score = prev + 1;

          if (score === 3) {
            setGameOver(true);
            setMatchResult("💻 Computer Won The Match!");
          }

          return score;
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setResult(null);
    setPlayerScore(0);
    setComputerScore(0);
    setGameOver(false);
    setMatchResult("");
    setHistory([]);
  };

  return (
    <div className="container">
      <div className="game-card">
        <h1>🪨 Rock Paper Scissors ✂️</h1>

        {!gameStarted ? (
          <button className="start-btn" onClick={startGame}>
            ▶ Start Game
          </button>
        ) : (
          <>
            <div className="scoreboard">
              <div className="score-box">
                <h3>You</h3>
                <p>{playerScore}</p>
              </div>

              <div className="score-box">
                <h3>Computer</h3>
                <p>{computerScore}</p>
              </div>
            </div>

            {matchResult && (
              <div className="match-result">
                {matchResult}
              </div>
            )}

            <div className="buttons">
              <button
                onClick={() => play("rock")}
                disabled={gameOver}
              >
                🪨 Rock
              </button>

              <button
                onClick={() => play("paper")}
                disabled={gameOver}
              >
                📄 Paper
              </button>

              <button
                onClick={() => play("scissors")}
                disabled={gameOver}
              >
                ✂️ Scissors
              </button>
            </div>

            {result && (
              <div className="result-card">
                <h3>Your Choice: {result.player}</h3>
                <h3>Computer Choice: {result.computer}</h3>
                <h2>{result.result}</h2>
              </div>
            )}

            {history.length > 0 && (
              <div className="history-card">
                <h3>📜 Match History</h3>

                {history.map((item, index) => (
                  <p key={index}>
                    You: {item.player} | Computer: {item.computer} →{" "}
                    {item.result}
                  </p>
                ))}
              </div>
            )}

            <button
              className="reset-btn"
              onClick={resetGame}
            >
              🔄 Reset Game
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
