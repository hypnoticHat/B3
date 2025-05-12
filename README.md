# B3
# Project Objective
Build a dynamic Elo rating system for 5v5 matches where each player's rating is updated based on match results, win expectations, performance stats (KDA, gold), and role impact (MVP/SVP).
# Tech using:
Node.js / JavaScript – Core logic implementation
JSON – Data storage for players and match history
HTML/CSS/JavaScript – Basic UI for player display
fs to read/write JSON files (player and match data).
Express to serve the API and UI.
CORS to allow cross-origin requests.
# Elo Calculation Formula
- Team Average Elo:
Elo_A = average Elo of team A  
Elo_B = average Elo of team B
- Win Expectancy:
E_A = 1 / (1 + 10^((Elo_B - Elo_A) / 400))  
E_B = 1 - E_A
- Player Elo Update:
R' = R + K × (S - E)
Where:
+ R: current Elo
+ R': new Elo
+ S: actual score (1 for win, 0 for loss)
+ E: expected score (E_A or E_B)
- KDA & Bonus Point Logic
KDA = (kills + assists) / deaths
If KDA > 3         => K += 4  
If gold is high    => K += 2  
If MVP             => +8 Elo  
If SVP             => +4 Elo
- Random KDA Generation
