import { useState } from "react";
import "./App.css";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0; // X's turn is next when the current move is even since they have the first move
  const currentSquares = history[currentMove];
  const winnerInfo = calculateWinner(currentSquares);
  const winningSquares = winnerInfo ? winnerInfo.winningSquares : [];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function undo() {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
    }
  }

  function redo() {
    if (currentMove < history.length - 1) {
      setCurrentMove(currentMove + 1);
    }
  }

  function reset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function renderStatus() {
    if (winnerInfo) {
      return (
        <span>
          Winner: <span className={winnerInfo.winner === "X" ? "x-marker" : "o-marker"}>{winnerInfo.winner}</span>
        </span>
      );
    } else if (!currentSquares.includes(null)) {
      return <span className="draw">Draw!</span>;
    } else {
      return(
        <span>
          Next Player: <span className={xIsNext ? "x-marker" : "o-marker"}>{xIsNext ? "X" : "O"}</span>
        </span>
      );
    }
  }
 
  return (
    <div className="game">
      <h1 className="game-title">Tic-Tac-Toe</h1>
      <div className="status">{renderStatus()}</div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningSquares={winningSquares} />
      </div>
      <div className="game-info">
        <div className="game-controls">
          <button onClick={undo} disabled={currentMove === 0}>
            Undo
          </button>
          <button onClick={redo} disabled={currentMove === history.length - 1}>
            Redo
          </button>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  );
}

function Square({ value, onSquareClick, isWinningSquare }) {
  let className = "square";
  if (value === "X") {
    className += " x-marker";
  } else if (value === "O") {
    className += " o-marker";
  }
  if (isWinningSquare) {
    className += " highlight";
  }


  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  // Render game board using loops
  const scale = 3; // 3x3 grid
  const boardRows = [];
  for (let row = 0; row < scale; row++) {
    const squaresInRow = [];
    for (let col = 0; col < scale; col++) {
      const index = row * scale + col;
      squaresInRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isWinningSquare={winningSquares.includes(index)} 
        />
      );
    }
    boardRows.push(<div key={row} className="board-row">{squaresInRow}</div>);
  }
  return <div className="board">{boardRows}</div>;
}

// Calculate if the current game board has a winner (a player with three tokens in a row)
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return null;
}
