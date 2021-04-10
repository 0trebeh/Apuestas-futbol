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
};
