let allPlayers = [];
let currentFilter = '10';
let currentPage = 1;

function loadPlayersAndDisplay() {
  fetch('players.json')
    .then(res => res.json())
    .then(data => {
      allPlayers = data.players.sort((a, b) => b.elo - a.elo);
      applyFilter();
    });
}

function applyFilter() {
  currentFilter = document.getElementById('filter').value;
  currentPage = 1;
  displayPlayers();
}

function filterPlayers() {
  const keyword = document.getElementById('searchBox').value.trim().toLowerCase();
  if (!keyword) return applyFilter();

  const filtered = allPlayers.filter(player =>
    player.name.toLowerCase().includes(keyword) || player.id.toString().includes(keyword)
  );
  displayPlayers(filtered);
}

function displayPlayers(players = null) {
  const list = document.getElementById('ranking-list');
  const pagination = document.getElementById('pagination');
  list.innerHTML = '';
  pagination.innerHTML = '';

  const data = players || allPlayers;
  const itemsPerPage = currentFilter === 'all' ? data.length : parseInt(currentFilter);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  data.slice(start, end).forEach((player, index) => {
    const div = document.createElement('div');
    div.className = 'player';
    div.innerHTML = `
      <span class="rank">${start + index + 1}</span>
      <span class="pname"><a href="player.html?id=${player.id}">${player.name}</a></span>
      <span class="elo">${player.elo}</span>
    `;
    list.appendChild(div);
  });

  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === currentPage) btn.disabled = true;
      btn.onclick = () => {
        currentPage = i;
        displayPlayers(players);
      };
      pagination.appendChild(btn);
    }
  }
}

loadPlayersAndDisplay();
