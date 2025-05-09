const {
loadPlayers,
loadHistory,
savePlayers,
saveHistory,
generateTeams,
averageElo,
expectedScore,
applyMatchResult,
randomResult,
} = require('./eloSystem');

const players = loadPlayers();
const history = loadHistory();

const { teamA, teamB } = generateTeams(players);

const avgA = averageElo(teamA);
const avgB = averageElo(teamB);
const expectedA = expectedScore(avgA, avgB);
const matchId = history.matches.length + 1;

// 🏆 Giả định team A thắng
const result = randomResult(expectedA);//1 team A thắng, 0 team B thắng

const matchRecord = applyMatchResult(teamA, teamB, result, matchId, expectedA);


history.matches.push(matchRecord);

console.log(` Avg Elo A: ${avgA}, B: ${avgB}`);
console.log(` Expected A: ${expectedA.toFixed(2)}, B: ${(1 - expectedA).toFixed(2)}`);

console.log("\nTeam A:");
teamA.forEach(p => console.log(`${p.name} | Elo: ${p.elo} ${p.isMVP ? '(MVP)' : ''} ${p.isSVP ? '(SVP)' : ''}`));

console.log("\nTeam B:");
teamB.forEach(p => console.log(`${p.name} | Elo: ${p.elo} ${p.isMVP ? '(MVP)' : ''} ${p.isSVP ? '(SVP)' : ''}`));

savePlayers(players);
saveHistory(history);
