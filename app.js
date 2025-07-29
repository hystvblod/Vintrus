class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-black"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [score, setScore] = React.useState(0);
    const [level, setLevel] = React.useState(1);
    const [gameState, setGameState] = React.useState('playing'); // 'playing', 'correct', 'wrong'
    const [message, setMessage] = React.useState('');

    const handleCorrectAnswer = () => {
      setScore(score + 10);
      setGameState('correct');
      setMessage('Bravo ! Vous avez trouvé le bon fruit !');
      setTimeout(() => {
        setLevel(level + 1);
        setGameState('playing');
        setMessage('');
      }, 1500);
    };

    const handleWrongAnswer = () => {
      setGameState('wrong');
      setMessage('Oops ! Ce n\'est pas le bon fruit. Essayez encore !');
      setTimeout(() => {
        setGameState('playing');
        setMessage('');
      }, 1500);
    };

    const resetGame = () => {
      setScore(0);
      setLevel(1);
      setGameState('playing');
      setMessage('');
    };

    return (
      <div className="min-h-screen bg-[var(--background-color)] py-8" data-name="app" data-file="app.js">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[var(--text-color)] mb-2 text-shadow">
              🍎 Jeu de Fruits 🍊
            </h1>
            <p className="text-lg text-[var(--text-color)] opacity-80">
              Trouvez le fruit différent parmi les autres !
            </p>
          </div>

          <ScoreBoard score={score} level={level} />
          
          {message && (
            <div className={`text-center mb-6 p-4 rounded-lg font-semibold ${
              gameState === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="flex justify-center mb-8">
            <GameBoard 
              level={level}
              onCorrectAnswer={handleCorrectAnswer}
              onWrongAnswer={handleWrongAnswer}
              gameState={gameState}
            />
          </div>

          <div className="text-center">
            <button onClick={resetGame} className="game-button">
              Nouveau Jeu
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);