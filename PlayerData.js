
const fs = require('fs');

const players = [];

for (let i = 1; i <= 100; i++) {
  players.push({
    id: i,
    name: `Player ${i}`,
    elo: 1500,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    history: []
  });
}

fs.writeFileSync('players.json', JSON.stringify({ players }, null, 2));
console.log('Created players.json with 100 players!');
