import { useState } from "react";
import "./App.css";

/**
 *  The main Game component that manages the state and logic of the Tic-Tac-Toe web app.
 *  @returns {JSX.Element} The rendered Game component.
 */
export default function Game() {
  // State to track the history of moves and the current move index.
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  
  // Determine whose turn it is and the current game state. X starts first and players alternate turns.
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Check for winner and winning squares.
  const winnerInfo = calculateWinner(currentSquares);
  const winningSquares = winnerInfo ? winnerInfo.winningSquares : [];

  /**
   * Handles a new move by updating the game history and current move index.
   * @param {Array<string|null>} nextSquares - Updated board state after a move. 
   */
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  /**
   * Undos the last move, if possible, by decrementing the current move index.
   */
  function undo() {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
    }
  }

  /**
   * Redos the next move, if possible, by incrementing the current move index.
   */
  function redo() {
    if (currentMove < history.length - 1) {
      setCurrentMove(currentMove + 1);
    }
  }

  /**
   * Resets the game to the initial state.
   */
  function reset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  /**
   * Renders the status message for the game, indicating the next player, winner, or draw result. 
   * @returns {JSX.Element} Status message element.
   */
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

/**
 * Square component representing a single cell in the Tic-Tac-Toe board.
 * @param {Object} props
 * @param {string|null} props.value - The current value of the square ("X", "O", or null).
 * @param {Function} props.onSquareClick - Callback function when the square is clicked.
 * @param {boolean} props.isWinningSquare - Indicates if the square is part of the winning combination.
 * @returns {JSX.Element} The rendered Square component.
 */
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

/**
 * Board component representing the 3x3 Tic-Tac-Toe grid.
 * @param {Object} props
 * @param {boolean} props.xIsNext - Indicates if X's turn is next.
 * @param {Array<string|null>} props.squares - Current board state.
 * @param {Function} props.onPlay - Callback when a square is clicked.
 * @param {Array<Number>} props.winningSquares - Indices of the winning squares.
 * @returns {JSX.Element} The rendered Board component.
 */
function Board({ xIsNext, squares, onPlay, winningSquares }) {
  /**
   * Handles a square being clicked and updates the board state if valid
   * @param {number} i - The index of the clicked square.
   */
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

/**
 * Helper function to calculate whether there is a winner in the current board state, and the indices of the winning combination if there is one.
 * @param {Array<string|null>} squares - Current board state.
 * @returns { { winner: string, winningSquares: number[]} | null } - Record containing winner information or null if there is no winner yet.
 */
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
