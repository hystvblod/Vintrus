// components/ColorBoard.js

function ColorBoard({ score, setScore, level, setLevel, gameState, setGameState, setMessage }) {
  // Couleur et grille
  const [colors, setColors] = React.useState([]);
  const [differentIndex, setDifferentIndex] = React.useState(0);
  const [clickedIndex, setClickedIndex] = React.useState(null);
  const [timer, setTimer] = React.useState(15);

  // Génère une couleur HSL de base
  function getRandomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 70 + Math.random() * 20;
    const l = 45 + Math.random() * 15;
    return { h, s, l };
  }
  // Différence couleur en fonction du niveau
  function getColorDiff(level) {
    if (level <= 3) return 28;
    if (level <= 6) return 16;
    if (level <= 10) return 9;
    return 4;
  }
  // Génère l'intrus
  function getIntruderColor(baseColor, level) {
    let diff = getColorDiff(level);
    let newL = baseColor.l + (Math.random() < 0.5 ? -diff : diff);
    newL = Math.max(0, Math.min(100, newL));
    return { ...baseColor, l: newL };
  }
  // Taille de grille selon niveau
  function getGridSize(level) {
    if (level <= 3) return 3;
    if (level <= 6) return 4;
    if (level <= 10) return 5;
    return 6;
  }

  // Génère la grille à chaque niveau
  const generateColors = React.useCallback(() => {
    const gridSize = getGridSize(level);
    const totalCells = gridSize * gridSize;
    const baseColor = getRandomColor();
    const intruderColor = getIntruderColor(baseColor, level);
    const idx = Math.floor(Math.random() * totalCells);
    const newColors = Array(totalCells).fill(baseColor);
    newColors[idx] = intruderColor;
    setColors(newColors);
    setDifferentIndex(idx);
    setClickedIndex(null);
    setTimer(15); // Réinitialise le chrono à chaque niveau
  }, [level]);

  // Génère la grille quand niveau change
  React.useEffect(() => {
    generateColors();
  }, [level, generateColors]);

  // Chrono
  React.useEffect(() => {
    if (gameState !== 'playing') return;
    if (timer === 0) {
      setGameState('timeout');
      setMessage('⏰ Temps écoulé ! Essayez encore...');
      setTimeout(() => {
        setGameState('playing');
        setMessage('');
        generateColors();
      }, 1500);
      return;
    }
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, gameState, setGameState, setMessage, generateColors]);

  // Sauvegarde score + niveau (reprendre où on était)
  React.useEffect(() => {
    localStorage.setItem(
      'color-game-save',
      JSON.stringify({ score, level })
    );
  }, [score, level]);

  // Gestion du clic
  function handleClick(index) {
    if (gameState !== 'playing') return;
    setClickedIndex(index);
    if (index === differentIndex) {
      setScore(score + 10 + timer); // bonus points = 10 + temps restant
      setGameState('correct');
      setMessage('Bravo !');
      setTimeout(() => {
        setLevel(level + 1);
        setGameState('playing');
        setMessage('');
      }, 1300);
    } else {
      setGameState('wrong');
      setMessage('Oups, mauvaise couleur !');
      setTimeout(() => {
        setGameState('playing');
        setMessage('');
        generateColors();
      }, 1300);
    }
  }

  // Affichage du niveau (fr)
  function formatNiveau(n) {
    return `Niveau ${n}`;
  }

  // Affichage
  const gridSize = getGridSize(level);

  return (
    <div className="fruit-grid" data-name="color-board">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-[var(--text-color)] text-lg">{formatNiveau(level)}</div>
        <div className="font-semibold text-[var(--accent-color)] text-lg">⏱ {timer}s</div>
      </div>
      <div
        className={`fruit-grid grid-cols-${gridSize}`}
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {colors.map((color, i) => (
          <div
            key={i}
            className={`fruit-card ${clickedIndex === i
              ? i === differentIndex
                ? 'correct-answer'
                : 'wrong-answer'
              : ''}`}
            style={{
              background: `hsl(${color.h},${color.s}%,${color.l}%)`,
              border: gameState === 'timeout' && i === differentIndex ? '2px solid #ef4444' : undefined,
              transition: 'border 0.2s',
            }}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-[var(--text-color)] opacity-70">
          Cliquez sur la couleur différente !
        </p>
      </div>
    </div>
  );
}
