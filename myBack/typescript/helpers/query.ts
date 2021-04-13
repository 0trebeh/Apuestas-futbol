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
};
