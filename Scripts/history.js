function renderPlayer(id, data) {
    if (!data) return `<div class="player">ID ${id}</div>`;
    const { stats, isMVP, isSVP, eloChange } = data;
    const kda = `${stats.kills}/${stats.deaths}/${stats.assists}`;
    const eloColor = eloChange >= 0 ? 'green' : 'red';
  
    return `
      <div class="player">
        ID ${id} ${isMVP ? '⭐' : ''} ${isSVP ? '🛡️' : ''}<br>
        KDA: ${kda} | Elo: <span style="color:${eloColor}">${eloChange >= 0 ? '+' : ''}${eloChange}</span>
      </div>
    `;
  }
  
  function loadHistory(matches) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
  
    matches.forEach((match) => {
      const div = document.createElement('div');
      div.className = 'history-entry';
      div.innerHTML = `
        <h4>Trận đấu #${match.id}</h4>
        <div><strong>Winner:</strong> Team ${match.winner}</div>
        <div class="team"><strong>Team A:</strong> ${match.teamA.map(id => renderPlayer(id, match.players[id])).join('')}</div>
        <div class="team"><strong>Team B:</strong> ${match.teamB.map(id => renderPlayer(id, match.players[id])).join('')}</div>
      `;
      historyList.appendChild(div);
    });
  }
  