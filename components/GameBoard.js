// components/GameBoard.js

function GameBoard({
  score, setScore,
  level, setLevel,
  gameState, setGameState,
  setMessage
}) {
  // Liste des images (mets tes propres PNG ici)
  const fruitImages = [
    { src: 'assets/fruits/pomme.png', name: 'pomme' },
    { src: 'assets/fruits/banane.png', name: 'banane' },
    { src: 'assets/fruits/raisin.png', name: 'raisin' },
    { src: 'assets/fruits/kiwi.png', name: 'kiwi' },
    // Ajoute autant de fruits que tu veux
  ];

  // Paramètres grille/timer par niveau (personnalise si tu veux)
  function getLevelParams(level) {
    if (level === 1) return { grid: 4, timer: 20 };
    if (level === 2) return { grid: 6, timer: 30 };
    if (level === 3) return { grid: 8, timer: 20 };
    if (level === 4) return { grid: 4, timer: 15 };
    return { grid: 6, timer: 15 };
  }

  const [fruits, setFruits] = React.useState([]);
  const [differentFruitIndex, setDifferentFruitIndex] = React.useState(0);
  const [clickedIndex, setClickedIndex] = React.useState(null);
  const [timer, setTimer] = React.useState(getLevelParams(level).timer);

  // Génère une grille avec 1 seul fruit différent
  const generateFruits = React.useCallback(() => {
    const { grid, timer } = getLevelParams(level);
    const totalCells = grid * grid;

    // Tire deux fruits différents
    let indices = [...Array(fruitImages.length).keys()];
    indices = indices.sort(() => Math.random() - 0.5);
    const mainIdx = indices[0];
    let intrusIdx = indices[1];
    if (intrusIdx === mainIdx) intrusIdx = indices[2] ?? 0;

    const mainFruit = fruitImages[mainIdx];
    const intruderFruit = fruitImages[intrusIdx];

    // Remplit la grille avec le fruit principal
    const newFruits = new Array(totalCells).fill(mainFruit);
    // Place l'intrus à une position random
    const randomIndex = Math.floor(Math.random() * totalCells);
    newFruits[randomIndex] = intruderFruit;

    setFruits(newFruits);
    setDifferentFruitIndex(randomIndex);
    setClickedIndex(null);
    setTimer(timer); // Reset timer
  }, [level]);

  React.useEffect(() => {
    generateFruits();
  }, [level, generateFruits]);

  // Chronomètre
  React.useEffect(() => {
    if (gameState !== 'playing') return;
    if (timer === 0) {
      setGameState('timeout');
      setMessage('⏰ Temps écoulé ! Essayez encore...');
      setTimeout(() => {
        setGameState('playing');
        setMessage('');
        generateFruits();
      }, 1200);
      return;
    }
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, gameState, setGameState, setMessage, generateFruits]);

  function handleFruitClick(index) {
    if (gameState !== 'playing') return;
    setClickedIndex(index);
    if (index === differentFruitIndex) {
      setScore(score + 10 + timer);
      setGameState('correct');
      setMessage('Bravo !');
      setTimeout(() => {
        setLevel(level + 1);
        setGameState('playing');
        setMessage('');
      }, 1000);
    } else {
      setGameState('wrong');
      setMessage('Oups, mauvais fruit !');
      setTimeout(() => {
        setGameState('playing');
        setMessage('');
        generateFruits();
      }, 1000);
    }
  }

  const { grid } = getLevelParams(level);
  const gridCols = `grid-cols-${grid}`;

  return (
    <div className="fruit-grid" data-name="game-board">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-[var(--text-color)] text-lg">{`Niveau ${level}`}</div>
        <div className="font-semibold text-[var(--accent-color)] text-lg">⏱ {timer}s</div>
      </div>
      <div
        className={`fruit-grid ${gridCols}`}
        style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }}
      >
        {fruits.map((fruit, index) => (
          <div
            key={index}
            className={`fruit-card ${
              clickedIndex === index
                ? index === differentFruitIndex
                  ? 'correct-answer'
                  : 'wrong-answer'
                : ''
            }`}
            onClick={() => handleFruitClick(index)}
            style={{ padding: 2 }}
          >
            <img
              src={fruit.src}
              alt={fruit.name}
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-[var(--text-color)] opacity-70">
          Cliquez sur le fruit différent !
        </p>
      </div>
    </div>
  );
}
