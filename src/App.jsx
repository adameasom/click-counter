import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import "./App.css";

function ClickCounter() {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return localStorage.getItem("highScore") || 0;
  });

  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const timerRef = useRef(null);

  const handlePointerDown = () => {
    if (!isActive) {
      // Start the game
      setIsActive(true);
      setClicks(1); // First click counts
      setTimeLeft(10);
      setIsNewHighScore(false); // Reset new high score indicator for the new game

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Increment clicks during the game
      setClicks((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      // Update high score if clicks are higher
      if (clicks > highScore) {
        setHighScore(clicks);
        setIsNewHighScore(true); // Mark this as a new high score
        setShowConfetti(true); // Trigger fireworks
        localStorage.setItem("highScore", clicks);
      }
    }
  }, [timeLeft, clicks, highScore]);

  const handleResetHighScore = () => {
    setHighScore(0);
    localStorage.setItem("highScore", 0);
  };

  const handleTryAgain = () => {
    setClicks(0);
    setTimeLeft(10);
    setIsActive(false);
    clearInterval(timerRef.current);
    setIsNewHighScore(false); // Reset new high score indicator when trying again
    setShowConfetti(false); // Ensure no fireworks on reset
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current); // Cleanup timer on unmount
  }, []);

  return (
    <div className="container">
      {showConfetti && (
        <div className={`confetti-wrapper ${!showConfetti ? "fade-out" : ""}`}>
          <Confetti numberOfPieces={750} />
        </div>
      )}
      <h1>Cwick Click</h1>
      <h2>Time Left</h2>
      <h3>{timeLeft}s</h3>
      <h2>Clicks</h2>
      <h3>{clicks}</h3>
      <button
        onPointerDown={handlePointerDown}
        className="circle-button"
        disabled={timeLeft === 0}
      >
        {isActive ? "Click Me!" : "Start"}
      </button>
      {timeLeft === 0 && (
        <button onClick={handleTryAgain} className="try-again-button">
          {isNewHighScore ? "New High Score! Go Again?" : "One More Time?"}
        </button>
      )}
      <h2>High Score</h2>
      <h3>{highScore}</h3>
      <button
        onClick={handleResetHighScore}
        className="reset-button"
        disabled={isActive || timeLeft < 10}
      >
        Reset
      </button>
    </div>
  );
}

export default ClickCounter;
