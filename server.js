const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5500', // Chỉ cho phép yêu cầu từ localhost:5500
    methods: ['GET', 'POST'], // Các phương thức được phép
  }));
app.use(express.static(path.join(__dirname, 'public'))); // Sử dụng thư mục 'public' để chứa các tệp tĩnh
app.use(express.json());
// Load các hàm từ eloSystem
const {
    loadPlayers,
    generateTeams,
    averageElo,
    expectedScore,
    applyMatchResult,
    randomResult,
    savePlayers,
    saveHistory,
} = require('./eloSystem');

// Route mô phỏng trận đấu
app.get('/simulate', (req, res) => {
  const count = parseInt(req.query.count);
  if (isNaN(count) || count <= 0) return res.status(400).json({ error: 'Invalid count' });

  const players = loadPlayers();
  let winA = 0, winB = 0;
  const matches = [];

  for (let i = 0; i < count; i++) {
    const { teamA, teamB } = generateTeams(players);
    const avgA = averageElo(teamA);
    const avgB = averageElo(teamB);
    const expectedA = expectedScore(avgA, avgB);
    const result = randomResult(expectedA);
    const matchRecord = applyMatchResult(teamA, teamB, result, i + 1, expectedA);

    if (result === 1) winA++; else winB++;
    matches.push(matchRecord); // Lưu trận đấu vào danh sách

    // Cập nhật KDA cho từng player trong trận
    teamA.forEach(player => {
      player.kills = matchRecord.teamA.kills || 0;
      player.deaths = matchRecord.teamA.deaths || 0;
      player.assists = matchRecord.teamA.assists || 0;
    });

    teamB.forEach(player => {
      player.kills = matchRecord.teamB.kills || 0;
      player.deaths = matchRecord.teamB.deaths || 0;
      player.assists = matchRecord.teamB.assists || 0;
    });
  }

  // Trả về kết quả mô phỏng cho client
  res.json({
    count,
    winA,
    winB,
    percentA: ((winA / count) * 100).toFixed(1),
    percentB: ((winB / count) * 100).toFixed(1),
    matches,
    players // Trả về thông tin các trận đấu đã mô phỏng
  });
});

//lưu mô phỏng
app.post('/save-simulation', (req, res) => {
    const { matches, players } = req.body;
    if (!Array.isArray(matches) || !Array.isArray(players)) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
    }
  
    try {
      savePlayers(players);
      saveHistory({ matches }); 
      res.json({ message: 'Lưu mô phỏng thành công.' });
    } catch (err) {
      console.error(err);
      res.status(500)}
  });

// Route lấy lịch sử mô phỏng (giới hạn chỉ cho mỗi lần mô phỏng)
app.get('/history', (req, res) => {
  res.json({
    matches: []
  });
});

// Cung cấp tệp index.html khi truy cập vào route /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
