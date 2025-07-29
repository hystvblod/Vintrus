// components/ScoreBoard.js

function ScoreBoard({ score, level, timer }) {
  try {
    return (
      <div
        className="flex justify-center mb-8"
        data-name="score-board"
        data-file="components/ScoreBoard.js"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-8">
          {/* Bloc Score */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="icon-trophy text-2xl text-[var(--secondary-color)]"></div>
            </div>
            <div className="text-2xl font-bold text-[var(--text-color)]">
              {score}
            </div>
            <div className="text-sm text-[var(--text-color)] opacity-70">
              Points
            </div>
          </div>

          <div className="w-px h-12 bg-gray-200"></div>

          {/* Bloc Niveau */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="icon-zap text-2xl text-[var(--primary-color)]"></div>
              {/* Chrono optionnel */}
              {timer !== undefined && (
                <span className="ml-2 text-lg font-bold text-[var(--accent-color)]">
                  ⏱ {timer}s
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-[var(--text-color)]">
              {`Niveau ${level}`}
            </div>
            <div className="text-sm text-[var(--text-color)] opacity-70">
              Niveau
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("ScoreBoard component error:", error);
    return null;
  }
}
