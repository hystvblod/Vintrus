// --- Configuration des assets par mode ---
const GAME_ASSETS = {
  fruits: [
    {src: 'assets/fruits/pomme.png', name: 'pomme'},
    {src: 'assets/fruits/banane.png', name: 'banane'},
    {src: 'assets/fruits/raisin.png', name: 'raisin'},
    {src: 'assets/fruits/kiwi.png', name: 'kiwi'},
    // Ajoute d'autres ici
  ],
  cadres: [
    {src: 'assets/cadres/cadre1.png', name: 'cadre1'},
    {src: 'assets/cadres/cadre2.png', name: 'cadre2'},
    // Optionnel
  ],
  couleurs: null, // sera généré à la volée
};

const root = document.getElementById('game-root');

// --- Paramètres de niveau dynamiques ---
function getLevelParams(level, challenge) {
  // Tu peux personnaliser la difficulté ici
  if (!challenge) {
    // Mode chill : niveau croissant, pas de timer
    if (level < 3) return {size: 4, time: 0};
    if (level < 8) return {size: 6, time: 0};
    return {size: 8, time: 0};
  } else {
    // Mode défi : grille évolutive, temps qui descend
    if (level === 1) return {size: 4, time: 30};
    if (level === 2) return {size: 6, time: 30};
    if (level === 3) return {size: 8, time: 25};
    if (level === 4) return {size: 8, time: 20};
    if (level === 5) return {size: 10, time: 20};
    return {size: 12, time: 15}; // niveau max = hard
  }
}

// --- Lancer un jeu (fruits, couleurs, etc) ---
window.launchGame = function launchGame({mode="fruits", challenge=true}) {
  let score = 0, level = 1, timer = 0, timerInterval = null, gameState = 'playing', msg = '';
  let lastMode = mode, lastChallenge = challenge;

  function getAssets() {
    if (mode === "couleurs") return null;
    return GAME_ASSETS[mode] || [];
  }

  // Génère la grille (image/couleur)
  function newGrid() {
    const {size, time} = getLevelParams(level, challenge);
    timer = time;
    clearInterval(timerInterval);
    msg = '';
    gameState = 'playing';

    // Couleurs
    if (mode === "couleurs") {
      const total = size*size;
      const baseColor = getRandomColor();
      const intruderColor = getIntruderColor(baseColor, level);
      const diffPos = Math.floor(Math.random()*total);
      const grid = Array(total).fill(baseColor);
      grid[diffPos] = intruderColor;
      renderColor(grid, size, diffPos);
      if (challenge) launchTimer(grid, size, diffPos);
      return;
    }

    // Images (fruits/cadres/autre)
    const assets = getAssets();
    const total = size*size;
    const mainIdx = Math.floor(Math.random() * assets.length);
    let diffIdx;
    do { diffIdx = Math.floor(Math.random() * assets.length); } while (diffIdx === mainIdx);
    const mainAsset = assets[mainIdx];
    const diffAsset = assets[diffIdx];
    const diffPos = Math.floor(Math.random()*total);
    const grid = Array(total).fill(mainAsset);
    grid[diffPos] = diffAsset;
    renderImg(grid, size, diffPos);
    if (challenge) launchTimer(grid, size, diffPos);
  }

  // Chrono pour mode défi
  function launchTimer(grid, size, diffPos) {
    timerInterval = setInterval(() => {
      timer--;
      if (timer <= 0) {
        clearInterval(timerInterval);
        msg = "⏰ Temps écoulé !";
        gameState = 'timeout';
        renderGeneric(grid, size, diffPos, mode === "couleurs");
        setTimeout(newGrid, 1200);
      } else {
        renderGeneric(grid, size, diffPos, mode === "couleurs");
      }
    }, 1000);
  }

  // Rendu image
  function renderImg(grid, size, diffPos) {
    renderGeneric(grid, size, diffPos, false);
  }
  // Rendu couleurs
  function renderColor(grid, size, diffPos) {
    renderGeneric(grid, size, diffPos, true);
  }

  function renderGeneric(grid, size, diffPos, isColor) {
    root.innerHTML = `
      <div class="scorebar">
        <span class="level">Niveau ${level}</span>
        <span>Points <b>${score}</b></span>
        ${challenge ? `<span class="timer">⏱ ${timer}s</span>` : ""}
      </div>
      ${msg ? `<div class="msg ${gameState === 'timeout' ? 'timeout' : (gameState === 'correct' ? 'good' : 'bad')}">${msg}</div>` : ''}
      <div class="board" style="grid-template-columns: repeat(${size}, 1fr);">
        ${grid.map((el, i) =>
          `<div class="cell" data-i="${i}" style="${isColor ? `background:hsl(${el.h},${el.s}%,${el.l}%);` : ""}">
            ${isColor ? '' : `<img src="${el.src}" alt="" style="width:90%;max-height:90%;display:block;margin:auto;">`}
          </div>`
        ).join('')}
      </div>
      <button class="game-btn" onclick="window.returnToMenu && window.returnToMenu()">Retour</button>
    `;
    [...root.querySelectorAll('.cell')].forEach(cell => {
      cell.onclick = () => {
        if (gameState !== 'playing') return;
        const i = +cell.dataset.i;
        if (i === diffPos) {
          score += 10 + (challenge ? timer : 0);
          level++;
          msg = "Bravo !";
          gameState = 'correct';
          renderGeneric(grid, size, diffPos, isColor);
          clearInterval(timerInterval);
          setTimeout(newGrid, 800);
        } else {
          msg = "Oups, mauvaise case !";
          gameState = 'wrong';
          renderGeneric(grid, size, diffPos, isColor);
          setTimeout(newGrid, 800);
        }
      };
    });
  }

  // Générateurs de couleurs
  function getRandomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 70 + Math.random() * 20;
    const l = 45 + Math.random() * 15;
    return { h, s, l };
  }
  function getColorDiff(level) {
    if (level <= 3) return 28;
    if (level <= 6) return 16;
    if (level <= 10) return 9;
    return 4;
  }
  function getIntruderColor(base, level) {
    let diff = getColorDiff(level);
    let newL = base.l + (Math.random() < 0.5 ? -diff : diff);
    newL = Math.max(0, Math.min(100, newL));
    return { ...base, l: newL };
  }

  // Pour revenir à l'accueil
  window.returnToMenu = function() {
    clearInterval(timerInterval);
    if (window.showMenu) window.showMenu();
    else root.innerHTML = `<button onclick="location.reload()">Retour</button>`;
  };

  // Go!
  newGrid();
}
