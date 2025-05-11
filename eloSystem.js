const fs = require('fs');

// ================= File and data ================= //

function loadPlayers() {
  const rawData = fs.readFileSync('players.json');
  return JSON.parse(rawData).players;
}

function loadHistory() {
  try {
    const raw = fs.readFileSync('history.json');
    return JSON.parse(raw);
  } catch (e) {
    return { matches: [] };
  }
}

function savePlayers(players) {
  fs.writeFileSync('players.json', JSON.stringify({ players }, null, 2));
}

function saveHistory(history) {
  fs.writeFileSync('history.json', JSON.stringify(history, null, 2));
}

// ================= generate match ================= //

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateTeams(players) {
  const shuffled = shuffle([...players]).slice(0, 10);
  return {
    teamA: shuffled.slice(0, 5),
    teamB: shuffled.slice(5)
  };
}

function averageElo(team) {
  return Math.round(team.reduce((sum, p) => sum + p.elo, 0) / team.length);
}

function expectedScore(eloA, eloB) {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

// ================= MVP, KDA, Gold ================= //

function generatePlayerStats() {
  return {
    kills: Math.floor(Math.random() * 15),
    deaths: Math.floor(Math.random() * 10),
    assists: Math.floor(Math.random() * 20),
    gold: Math.floor(Math.random() * 15000) + 5000
  };
}

function calculateMVPScore(stats, elo) {
  const kda = (stats.kills + stats.assists) / (stats.deaths || 1);
  return kda * 1.5 + stats.gold / 1000 + elo / 1000;
}

function assignStatsAndVPs(teamA, teamB, winnerTeam) {
  const allPlayers = [...teamA, ...teamB];

  //reset mvp
  allPlayers.forEach(p => {
    p.isMVP = false;
    p.isSVP = false;
  });

  allPlayers.forEach(p => {
    p.stats = generatePlayerStats();
    p.mvpScore = calculateMVPScore(p.stats, p.elo);
  });

  const winningTeam = winnerTeam === 'A' ? teamA : teamB;
  const losingTeam = winnerTeam === 'A' ? teamB : teamA;

  // MVP hightest score player win team
  let mvp = winningTeam.reduce((top, p) => (p.mvpScore > top.mvpScore ? p : top), winningTeam[0]);
  mvp.isMVP = true;

  // SVP: hightest score player lose team
  let svp = losingTeam.reduce((top, p) => (p.mvpScore > top.mvpScore ? p : top), losingTeam[0]);
  svp.isSVP = true;
}



function calculateK(player) {
  let k = 32;
  const { kills, deaths, assists, gold } = player.stats;
  const kda = (kills + assists) / (deaths || 1);

  if (kda > 3) k += 4;
  if (gold > 15000) k += 2;
  if (player.isMVP) k += 8;
  else if (player.isSVP) k += 4;

  return k;
}


// ================= cacula resultresult ================= //
function randomResult(expectedA) {
  return Math.random() < expectedA ? 1 : 0;
}

function applyMatchResult(teamA, teamB, resultA, matchId, expectedA) {
  const expectedB = 1 - expectedA;

  // stats, mvp, svp
  assignStatsAndVPs(teamA, teamB, resultA === 1 ? 'A' : 'B');

  const matchStats = {};
  [...teamA, ...teamB].forEach(p => {
    matchStats[p.id] = {
      eloChange: 0, //update belowbelow
      isMVP: !!p.isMVP,
      isSVP: !!p.isSVP,
      stats: p.stats
    };
  });

  // update update Elo -> save to matchStats
  teamA.forEach(p => {
    const k = calculateK(p);
    const delta = Math.round(k * (resultA - expectedA));
    p.elo += delta;
    p.wins = (p.wins || 0) + (resultA === 1 ? 1 : 0);
    p.losses = (p.losses || 0) + (resultA === 0 ? 1 : 0);
    p.gamesPlayed = (p.gamesPlayed || 0) + 1;
    p.history.push(matchId);
    matchStats[p.id].eloChange = delta;
  });

  teamB.forEach(p => {
    const k = calculateK(p);
    const delta = Math.round(k * ((1 - resultA) - expectedB));
    p.elo += delta;
    p.wins = (p.wins || 0) + (resultA === 0 ? 1 : 0);
    p.losses = (p.losses || 0) + (resultA === 1 ? 1 : 0);
    p.gamesPlayed = (p.gamesPlayed || 0) + 1;
    p.history.push(matchId);
    matchStats[p.id].eloChange = delta;
  });

  const matchRecord = {
    id: matchId,
    timestamp: new Date().toISOString(),
    teamA: teamA.map(p => p.id),
    teamB: teamB.map(p => p.id),
    winner: resultA === 1 ? 'A' : 'B',
    players: matchStats
  };

  return matchRecord;
}

module.exports = {
  loadPlayers,
  loadHistory,
  savePlayers,
  saveHistory,
  generateTeams,
  averageElo,
  expectedScore,
  applyMatchResult,
  randomResult,
};
