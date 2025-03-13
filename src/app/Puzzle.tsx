import React, { useState, useEffect } from 'react';

interface PuzzlePiece {
  id: number;
  correctPosition: number;
  currentPosition: number;
  image: string;
}

interface PuzzleProps {
  imageUrl: string;
  gridSize: number; // Örneğin: 3 için 3x3 puzzle
}

const Puzzle: React.FC<PuzzleProps> = ({ imageUrl, gridSize = 3 }) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Puzzle parçalarını başlangıçta hazırla
  useEffect(() => {
    const initializePuzzle = async () => {
      setIsLoading(true);
      
      // Puzzle parçalarını oluştur
      const totalPieces = gridSize * gridSize;
      const initialPieces: PuzzlePiece[] = [];
      
      for (let i = 0; i < totalPieces; i++) {
        initialPieces.push({
          id: i,
          correctPosition: i,
          currentPosition: i,
          image: `${imageUrl}#piece-${i}`
        });
      }
      
      // Parçaları karıştır (son parça hariç)
      const shuffledPieces = [...initialPieces];
      for (let i = 0; i < shuffledPieces.length - 2; i++) {
        const j = Math.floor(Math.random() * (shuffledPieces.length - 1));
        [shuffledPieces[i].currentPosition, shuffledPieces[j].currentPosition] = 
        [shuffledPieces[j].currentPosition, shuffledPieces[i].currentPosition];
      }
      
      setPieces(shuffledPieces);
      setIsLoading(false);
    };
    
    initializePuzzle();
  }, [imageUrl, gridSize]);

  // Puzzle'ın tamamlandığını kontrol et
  useEffect(() => {
    if (pieces.length === 0) return;
    
    const allCorrect = pieces.every(piece => piece.currentPosition === piece.correctPosition);
    setIsComplete(allCorrect);
    
    if (allCorrect) {
      console.log("Tebrikler! Puzzle'ı tamamladınız!");
    }
  }, [pieces]);

  // Parça taşıma mantığı
  const movePiece = (pieceId: number) => {
    const pieceIndex = pieces.findIndex(p => p.id === pieceId);
    if (pieceIndex === -1) return;
    
    const piece = pieces[pieceIndex];
    const emptyIndex = pieces.findIndex(p => p.currentPosition === gridSize * gridSize - 1);
    if (emptyIndex === -1) return;
    
    const emptyPiece = pieces[emptyIndex];
    
    // Parçanın boş alanın yanında olup olmadığını kontrol et
    const piecePosition = piece.currentPosition;
    const emptyPosition = emptyPiece.currentPosition;
    
    const pieceRow = Math.floor(piecePosition / gridSize);
    const pieceCol = piecePosition % gridSize;
    const emptyRow = Math.floor(emptyPosition / gridSize);
    const emptyCol = emptyPosition % gridSize;
    
    // Parça sadece boş alanın yanındaysa taşınabilir
    const isAdjacent = (
      (pieceRow === emptyRow && Math.abs(pieceCol - emptyCol) === 1) ||
      (pieceCol === emptyCol && Math.abs(pieceRow - emptyRow) === 1)
    );
    
    if (isAdjacent) {
      // Parçaları taşı
      const newPieces = [...pieces];
      [newPieces[pieceIndex].currentPosition, newPieces[emptyIndex].currentPosition] = 
      [newPieces[emptyIndex].currentPosition, newPieces[pieceIndex].currentPosition];
      
      setPieces(newPieces);
    }
  };

  // Puzzle'ı sıfırla
  const resetPuzzle = () => {
    const shuffledPieces = [...pieces];
    for (let i = 0; i < shuffledPieces.length - 2; i++) {
      const j = Math.floor(Math.random() * (shuffledPieces.length - 1));
      [shuffledPieces[i].currentPosition, shuffledPieces[j].currentPosition] = 
      [shuffledPieces[j].currentPosition, shuffledPieces[i].currentPosition];
    }
    
    setPieces(shuffledPieces);
    setIsComplete(false);
  };

  if (isLoading) {
    return <div>Puzzle yükleniyor...</div>;
  }

  return (
    <div className="puzzle-container">
      <div 
        className="puzzle-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: '2px',
          width: '300px',
          height: '300px'
        }}
      >
        {pieces.map(piece => (
          <div
            key={piece.id}
            className="puzzle-piece"
            style={{
              backgroundImage: piece.id === gridSize * gridSize - 1 && !isComplete ? 'none' : `url(${piece.image})`,
              backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
              backgroundPosition: `${(piece.correctPosition % gridSize) * 100 / (gridSize - 1)}% ${Math.floor(piece.correctPosition / gridSize) * 100 / (gridSize - 1)}%`,
              cursor: isComplete ? 'default' : 'pointer',
              width: '100%',
              height: '100%',
              border: '1px solid #ccc'
            }}
            onClick={() => !isComplete && movePiece(piece.id)}
          />
        ))}
      </div>
      
      <div className="puzzle-controls" style={{ marginTop: '1rem' }}>
        <button onClick={resetPuzzle}>Tekrar Karıştır</button>
        {isComplete && <div className="puzzle-complete-message">Tebrikler! Puzzle tamamlandı!</div>}
      </div>
    </div>
  );
};

export default Puzzle;