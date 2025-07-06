import React, { useState } from 'react';
import './App.css';

const App = () => {
  const emptyBoard = Array(9).fill(null);
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]); // Track the history of board states
  const [xMoves, setXMoves] = useState([]); // Track the positions of X's tokens
  const [oMoves, setOMoves] = useState([]); // Track the positions of O's tokens
  const winner = calculateWinner(board);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    // Save the current board state to history before making a move
    setHistory([...history, {board, xMoves, oMoves }]);

    const newBoard = [...board];
    const currentPlayer = xIsNext ? 'X' : 'O';

    // Place the current player's token
    newBoard[index] = currentPlayer;

    // Update the board and moves
    setBoard(newBoard);
    if (currentPlayer === 'X') {
      const newXMoves = [...xMoves, index];
      if (newXMoves.length > 3) {
        // Remove the first token when placing the fourth
        const [firstMove, ...remainingMoves] = newXMoves;
        newBoard[firstMove] = null; // Remove the first token
        setXMoves(remainingMoves);
      } else {
        setXMoves(newXMoves);
      }
    } else {
      const newOMoves = [...oMoves, index];
      if (newOMoves.length > 3) {
        // Remove the first token when placing the fourth
        const [firstMove, ...remainingMoves] = newOMoves;
        newBoard[firstMove] = null; // Remove the first token
        setOMoves(remainingMoves);
      } else {
        setOMoves(newOMoves);
      }
    }

    setXIsNext(!xIsNext); // Switch turns
  };

  const undoMove = () => {
    if (history.length === 0) return; // No moves to undo

    const previousState = history[history.length - 1];
    setBoard(previousState.board); // Revert to the previous board state
    setXMoves(previousState.xMoves); // Revert X's moves
    setOMoves(previousState.oMoves); // Revert O's moves
    setHistory(history.slice(0, -1)); // Remove the last state from history
    setXIsNext(!xIsNext); // Switch the turn back
  
  };
  
  const resetGame = () => {
    setBoard(emptyBoard);
    setXIsNext(true);
    setHistory([]);
    setXMoves([]);
    setOMoves([]);
  };

  const renderSquare = (index) => {
    const isGray =
      (xMoves.length === 3 && xMoves[0] === index) ||
      (oMoves.length === 3 && oMoves[0] === index);

    return (
      <button
        className={`square ${isGray ? 'gray' : ''}`}
        onClick={() => handleClick(index)}
      >
        <span className={board[index] === 'X' ? 'x-marker' : 'o-marker'}>
          {board[index]}
        </span>
      </button>
    );
  };

  const status = winner
    ? `Winner: ${winner}`
    : board.every(Boolean)
    ? 'Draw!'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <h2>Tic-Tac-Toe</h2>
      {/* Only show the status when there is a winner or a draw */}
      {winner || board.every(Boolean) ? (
        <div className="status">{status}</div>
      ) : null}
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div key={row} className="board-row">
            {renderSquare(row * 3)}
            {renderSquare(row * 3 + 1)}
            {renderSquare(row * 3 + 2)}
          </div>
        ))}
      </div>
      <div>
        <button className="undo" onClick={undoMove}>
          Undo
        </button>
        <button className="reset" onClick={resetGame}>
          Reset
        </button>
      </div>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default App;