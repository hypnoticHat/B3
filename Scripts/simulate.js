let lastSimulatedMatches = [];
let lastSimulatedPlayers = [];

function simulateMatches() {
  const count = parseInt(document.getElementById('matchCount').value);
  if (isNaN(count) || count <= 0) {
    alert('Nhập số hợp lệ');
    return;
  }

  fetch(`http://localhost:3000/simulate?count=${count}`)
    .then(res => res.json())
    .then(result => {
      document.getElementById('simulate-result').textContent =
        `Đã mô phỏng ${result.count} trận: Team A thắng: ${result.winA}, Team B thắng: ${result.winB}, ` +
        `Tỉ lệ thắng A: ${result.percentA}%, Tỉ lệ thắng B: ${result.percentB}%`;

      loadHistory(result.matches);
      lastSimulatedMatches = result.matches;
      lastSimulatedPlayers = result.players;
    });
}

function saveSimulation() {
  if (!lastSimulatedMatches.length || !lastSimulatedPlayers.length) {
    alert('Chưa có dữ liệu mô phỏng để lưu.');
    return;
  }

  fetch('http://localhost:3000/save-simulation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      matches: lastSimulatedMatches,
      players: lastSimulatedPlayers
    })
  })
  .then(res => res.json())
  .then(data => alert(data.message));
}
