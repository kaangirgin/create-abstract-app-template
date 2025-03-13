import React, { useState, useEffect } from 'react';
import './PuzzleGame.css'; // Stil dosyası

const PUZZLE_SIZE = 3; // 3x3 puzzle
const PIECE_SIZE = 100; // Her bir parçanın boyutu (px)

const PuzzleGame: React.FC = () => {
  const [puzzlePieces, setPuzzlePieces] = useState<number[]>([]);
  const [shuffledPieces, setShuffledPieces] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    const pieces = Array.from({ length: PUZZLE_SIZE * PUZZLE_SIZE }, (_, i) => i);
    setPuzzlePieces(pieces);
    setShuffledPieces(shuffleArray([...pieces]));
  };

  const shuffleArray = (array: number[]): number[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handlePieceClick = (index: number) => {
    if (selectedPiece === null) {
      setSelectedPiece(index);
    } else {
      const newPieces = [...shuffledPieces];
      [newPieces[selectedPiece], newPieces[index]] = [newPieces[index], newPieces[selectedPiece]];
      setShuffledPieces(newPieces);
      setSelectedPiece(null);

      if (isPuzzleSolved(newPieces)) {
        alert('Tebrikler! Puzzle\'ı çözdünüz!');
      }
    }
  };

  const isPuzzleSolved = (pieces: number[]): boolean => {
    return pieces.every((piece, index) => piece === index);
  };

  return (
    <div className="puzzle-game">
      <h1>Puzzle Oyunu</h1>
      <div
        className="puzzle-board"
        style={{
          width: `${PUZZLE_SIZE * PIECE_SIZE}px`,
          height: `${PUZZLE_SIZE * PIECE_SIZE}px`,
        }}
      >
        {shuffledPieces.map((piece, index) => (
          <div
            key={piece}
            className={`puzzle-piece ${selectedPiece === index ? 'selected' : ''}`}
            style={{
              width: `${PIECE_SIZE}px`,
              height: `${PIECE_SIZE}px`,
              backgroundImage: `url(/puzzle-image.jpg)`,
              backgroundPosition: `-${(piece % PUZZLE_SIZE) * PIECE_SIZE}px -${Math.floor(piece / PUZZLE_SIZE) * PIECE_SIZE}px`,
            }}
            onClick={() => handlePieceClick(index)}
          />
        ))}
      </div>
      <button onClick={initializePuzzle}>Yeniden Başlat</button>
    </div>
  );
};

export default PuzzleGame;