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

    const response = await fetch(
      `http://localhost:8080/play?choice=${choice}`
    );

    const data = await response.json();
    setResult(null);
    setTimeout(() => {
      setResult(data);
    }, 100);

    // ✅ HISTORY FIXED (inside function)
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
        const newScore = prev + 1;
        if (newScore === 3) {
          setGameOver(true);
          setMatchResult("🎉 You Won the Match!");
        }
        return newScore;
      });
    }

    if (data.result === "Computer Wins") {
      setComputerScore((prev) => {
        const newScore = prev + 1;
        if (newScore === 3) {
          setGameOver(true);
          setMatchResult("💻 Computer Won the Match!");
        }
        return newScore;
      });
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setPlayerScore(0);
    setComputerScore(0);
    setResult(null);
    setGameOver(false);
    setMatchResult("");
    setHistory([]);
  };

  return (
    <div className="container">
      <h1>🪨 Rock Paper Scissors ✂️</h1>
      {!gameStarted ? (
        <button className="start" onClick={startGame}>
          ▶️ Start Game
        </button>
      ) : (
        <>
          <div className="scoreboard">
            <h2>You: {playerScore}</h2>
            <h2>Computer: {computerScore}</h2>
          </div>

          {matchResult && (
            <h2 className="match-result">{matchResult}</h2>
          )}

          <div className="buttons">
            <button onClick={() => play("rock")} disabled={gameOver}>
              🪨 Rock
            </button>
            <button onClick={() => play("paper")} disabled={gameOver}>
              📄 Paper
            </button>
            <button onClick={() => play("scissors")} disabled={gameOver}>
              ✂️ Scissors
            </button>
          </div>

          <button className="reset" onClick={resetGame}>
            🔄 Reset Game
          </button>

          {result && (
            <div className="result">
              <h3>Your Choice: {result.player}</h3>
              <h3>Computer Choice: {result.computer}</h3>
              <h2>{result.result}</h2>
            </div>
          )}

          {history.length > 0 && (
            <div className="result">
              <h3>📜 Match History</h3>
              {history.map((h, index) => (
                <p key={index}>
                  You: {h.player} | Computer: {h.computer} → {h.result}
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;