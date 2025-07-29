# Jeu de Fruits - Trouvez l'Intrus

## Description
Un jeu interactif où le joueur doit identifier le fruit différent parmi une grille de fruits identiques.

## Fonctionnalités
- **Grilles évolutives** : La taille de la grille augmente avec le niveau (3x3 à 6x6)
- **Système de score** : 10 points par bonne réponse
- **Progression par niveaux** : Difficulté croissante
- **Interface intuitive** : Design coloré et convivial
- **Feedback visuel** : Animations et couleurs pour les bonnes/mauvaises réponses

## Structure du Projet
- `index.html` : Page principale avec styles CSS
- `app.js` : Logique principale de l'application
- `components/GameBoard.js` : Composant de la grille de jeu
- `components/ScoreBoard.js` : Affichage du score et niveau
- `utils/gameLogic.js` : Utilitaires de logique de jeu

## Gameplay
1. Le joueur voit une grille de fruits
2. Un seul fruit est différent des autres
3. Le joueur clique sur le fruit différent
4. Feedback immédiat (vert = correct, rouge = incorrect)
5. Progression automatique au niveau suivant

## Niveaux de Difficulté
- **Niveaux 1-3** : Grille 3x3 (facile)
- **Niveaux 4-6** : Grille 4x4 (moyen)
- **Niveaux 7-10** : Grille 5x5 (difficile)
- **Niveau 11+** : Grille 6x6 (expert)

## Technologies Utilisées
- React 18
- TailwindCSS
- Lucide Icons
- CSS Grid pour les grilles de jeu