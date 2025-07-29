// Game logic utilities for the fruit finder game

const GameLogic = {
  // Calculate difficulty based on level
  getDifficulty: (level) => {
    if (level <= 3) return 'easy';
    if (level <= 6) return 'medium';
    if (level <= 10) return 'hard';
    return 'expert';
  },

  // Get grid size based on level
  getGridSize: (level) => {
    if (level <= 3) return 3;
    if (level <= 6) return 4;
    if (level <= 10) return 5;
    return 6;
  },

  // Calculate score multiplier based on level and difficulty
  getScoreMultiplier: (level) => {
    const difficulty = GameLogic.getDifficulty(level);
    const multipliers = {
      easy: 1,
      medium: 1.5,
      hard: 2,
      expert: 3
    };
    return multipliers[difficulty];
  },

  // Generate random fruit pair
  generateFruitPair: (fruitList) => {
    const shuffled = [...fruitList].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  },

  // Calculate time bonus (if implementing timer later)
  calculateTimeBonus: (timeRemaining, maxTime) => {
    const percentage = timeRemaining / maxTime;
    return Math.floor(percentage * 50); // Max 50 bonus points
  }
};

// Export for use in other components
window.GameLogic = GameLogic;