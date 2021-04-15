export = {
  registerUser:
    'INSERT INTO users(name, last_name, id_document, email, phone, address, password) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING name, user_id',
  login: 'SELECT user_id, password, name FROM users WHERE email = $1',
  invalidToken: 'SELECT token FROM invalidTokens WHERE token = $1',
  invalidateToken: 'INSERT INTO invalidTokens(token) VALUES($1)',
  getProfile:
    'SELECT u.name, u.email, b.balance FROM users u INNER JOIN user_balance b USING(user_id) WHERE u.user_id = $1',
  getUserBets: 'SELECT * FROM bet WHERE user_id = $1',
  getTournamentIds: 'SELECT tournament_id AS id FROM tournament',
  deleteSeasons: 'DELETE FROM tournament_season',
  insertSeason:
    'INSERT INTO tournament_season(season_id, tournament_id, start_date, end_date, winner)',
  deleteCountries: 'DELETE FROM country',
  inserCountries: 'INSERT INTO country(country_id, name, code) VALUES',
  getCountries: 'SELECT country_id AS id FROM country',
  inserTeams:
    'INSERT INTO teams(team_id, name, country_id, colors, address, phone, website, email)',
  getTeamsIDs: 'SELECT team_id AS id FROM teams',
  insertPlayers: 'INSERT INTO players VALUES',
  insertMatch: 'INSERT INTO match VALUES',
  insertTeamPlayer: 'INSERT INTO team_players(team_id, player_id) VALUES',
  filterMatchByStatus: 'SELECT * FROM match WHERE playing NOT LIKE $1',
  updateMatchStatus: 'UPDATE match SET playing = $1 WHERE match_id = $2',
  insertMatchTeam:
    'INSERT INTO match_teams(team_id, match_id, goals, winner, loser, draw, side) VALUES($1, $2, $3, $4, $5, $6, $7)',
  updateMatchTeam:
    'UPDATE match_teams SET goals = $1, winner = $2, loser = $3, draw = $4 WHERE match_id = $5 AND team_id = $6',
  insertScorer:
    'INSERT INTO scorers(season_id, team_players_id, number_goals) VALUES($1, $2, $3)',
  getTeamPlayerID:
    'SELECT id FROM team_players WHERE player_id = $1 AND team_id = $2',
  getScorerPlayerID:
    'SELECT tp.player_id, tp.team_id FROM scorers s INNER JOIN team_players tp ON tp.id = s.team_players_id WHERE s.season_id = $1',
  deleteScorers: 'DELETE FROM scorers WHERE season_id = $1',
  getTopScorers:'SELECT number_goals, p.player_id, p.name AS player, t.name AS team FROM scorers s JOIN team_players tp ON tp.id = s.team_players_id JOIN players p ON p.player_id = tp.player_id JOIN teams t ON t.team_id = tp.team_id AND season_id = $1 ORDER BY number_goals DESC LIMIT 15',
  // total de goles de cada equipo en una temporada y total de victorias, empates y derrotas de cada equipo en una temporada
  getTopTeams: `SELECT tm1.team_id, g.team_name, g.total_goals, tm1.total_winner, tm2.total_loser, tm3.total_draw FROM 
  ( SELECT team_id, team_name, SUM ( goals ) AS total_goals FROM tournament_matches WHERE season_id = $1 GROUP BY team_id, team_name ) g
  JOIN ( SELECT team_id, COUNT(winner) AS total_winner FROM tournament_matches WHERE season_id = $1 AND winner = true GROUP BY team_id ) tm1 USING(team_id)
  JOIN ( SELECT team_id, COUNT(loser) AS total_loser FROM tournament_matches WHERE season_id = $1 AND loser = true GROUP BY team_id ) tm2 USING(team_id)
  JOIN ( SELECT team_id, COUNT(draw) AS total_draw FROM tournament_matches WHERE season_id = $1 AND draw = true GROUP BY team_id ) tm3 USING(team_id) ORDER BY tm1.total_winner DESC`,
};