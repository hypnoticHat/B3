const fs = require('fs');
//read the players.json file
const rawData = fs.readFileSync('Players.json');
const { players } = JSON.parse(rawData);

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

//random team
const shuffled = shuffle(players).slice(0, 10);
const teamA = shuffled.slice(0, 5);
const teamB = shuffled.slice(5, 10);

AverageEloTeamA = Math.round(teamA.reduce((acc, player) => acc + player.elo, 0) / teamA.length);
AverageEloTeamB = Math.round(teamB.reduce((acc, player) => acc + player.elo, 0) / teamB.length);

expectedTeamA = 1 / (1 + Math.pow(10, (AverageEloTeamB - AverageEloTeamA) / 400));
expectedTeamB = 1 - expectedTeamA;
eloChange = 32; // The amount of Elo points to change

const resultA = 1;
const resultB = 0;

  // Đọc file history.json (nếu chưa có thì tạo mới)
let history = { matches: [] };
try {
  const rawHistory = fs.readFileSync('history.json');
  history = JSON.parse(rawHistory);
} catch (e) {
  console.log('📁 history.json chưa tồn tại, sẽ tạo mới.');
}

// Tạo dữ liệu trận đấu
const matchId = history.matches.length + 1;
const matchRecord = {
  id: matchId,
  timestamp: new Date().toISOString(),
  teamA: teamA.map(p => p.id),
  teamB: teamB.map(p => p.id),
  winner: "A",
  eloChanges: {}
};


teamA.forEach(p => {
    const delta = Math.round(eloChange * (resultA - expectedTeamA));
    p.elo += delta;
    p.wins++;
    p.gamesPlayed++;
    p.history.push(matchId);
    matchRecord.eloChanges[p.id] = delta;
  });
  
  teamB.forEach(p => {
    const delta = Math.round(eloChange * (resultB - expectedTeamB));
    p.elo += delta;
    p.losses++;
    p.gamesPlayed++;
    p.history.push(matchId);
    matchRecord.eloChanges[p.id] = delta;
  });
  teamA.forEach(p => console.log(`${p.name} | Elo: ${p.elo}`));
  
  teamB.forEach(p => console.log(`${p.name} | Elo: ${p.elo}`));
  
  
// Lưu vào history
history.matches.push(matchRecord);

// Ghi ra file
fs.writeFileSync('history.json', JSON.stringify(history, null, 2));
fs.writeFileSync('players.json', JSON.stringify({ players }, null, 2));


