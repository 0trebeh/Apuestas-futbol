export = {
  registerUser:
    'INSERT INTO users(name, last_name, id_document, email, phone, address, password) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING name, user_id',
  login:
    'SELECT user_id, password, name, balance FROM users INNER JOIN user_balance USING(user_id) WHERE email = $1',
  invalidToken: 'SELECT token FROM invalidTokens WHERE token = $1',
  invalidateToken: 'INSERT INTO invalidTokens(token) VALUES($1)',
  getProfile:
    'SELECT u.name, u.email, b.balance FROM users u INNER JOIN user_balance b USING(user_id) WHERE u.user_id = $1',
  getUserBets:
    'SELECT b.bet_id AS bet, b.status, b.team_id AS team, b.prediction, bl.ammount, t.name As team_name, bt.name AS bet_name  FROM bet b INNER JOIN bill bl USING(bet_id) INNER JOIN teams t USING(team_id) INNER JOIN bet_types bt USING(bet_type_id) WHERE user_id = $1',
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
  lastestSeasonId:
    'SELECT * FROM tournament INNER JOIN tournament_season USING(tournament_id) WHERE name = $1 ORDER BY season_id DESC',
  tournamentMatches: 'SELECT * FROM tournament_matches WHERE season_id = $1',
  insertPayment:
    "INSERT INTO payment(user_id, account_number, bank, ref_number, ammount, state, payment_date) VALUES($1, $2, $3, $4, $5, 'FINISHED', $6)",
  paymentByRef: 'SELECT * FROM payment WHERE ref_number = $1',
  updateBalance:
    'UPDATE user_balance SET balance = $1 WHERE user_id = $2 RETURNING balance',
  currentBalance: 'SELECT balance FROM user_balance WHERE user_id = $1',
  getBetTypeID: 'SELECT bet_type_id AS id FROM bet_types WHERE name = $1',
  insertBet:
    "INSERT INTO bet(user_id, match_id, team_id, bet_type_id, prediction, status) VALUES($1, $2, $3, $4, $5, 'PENDING') RETURNING bet_id",
  insertBill:
    'INSERT INTO bill(bet_id, ammount, created) VALUES($1, $2, NOW())',
  deleteBet: 'DELETE FROM bet WHERE bet_id = $1',
  getBetAmmount: 'SELECT ammount FROM bill WHERE bet_id = $1',
  getTopScorers: `SELECT number_goals, p.player_id, p.name AS player, t.name AS team FROM scorers s JOIN team_players tp ON tp.id = s.team_players_id JOIN players p ON p.player_id = tp.player_id 
  JOIN teams t ON t.team_id = tp.team_id AND season_id = $1 ORDER BY number_goals DESC`,
  getTopTeams: `SELECT tm1.team_id, g.team_name, tm.total_matches, g.total_goals, tm1.total_winner, tm2.total_loser, tm3.total_draw FROM   
  ( SELECT team_id, team_name, SUM ( goals ) AS total_goals FROM tournament_matches WHERE season_id = $1 GROUP BY team_id, team_name ) g  
  JOIN ( SELECT team_id, COUNT(team_id) AS total_matches FROM tournament_matches WHERE season_id = $1 AND match_status != 'SCHEDULED' GROUP BY team_id ) tm USING(team_id)  
  JOIN ( SELECT team_id, COUNT(winner) AS total_winner FROM tournament_matches WHERE season_id = $1 AND winner = true GROUP BY team_id ) tm1 USING(team_id)  
  JOIN ( SELECT team_id, COUNT(loser) AS total_loser FROM tournament_matches WHERE season_id = $1 AND loser = true GROUP BY team_id ) tm2 USING(team_id)  
  JOIN ( SELECT team_id, COUNT(draw) AS total_draw FROM tournament_matches WHERE season_id = $1 AND draw = true GROUP BY team_id ) tm3 USING(team_id) ORDER BY tm1.total_winner DESC`,
  getPrediction: `SELECT tm1.team_id, tm.team_name, tm1.total_winner/tm.total_matches::float AS p_winner, tm2.total_loser/tm.total_matches::float AS p_loser, tm3.total_draw/tm.total_matches::float AS p_draw FROM   
  ( SELECT team_id, team_name, COUNT ( team_id ) AS total_matches FROM tournament_matches WHERE season_id = $1 AND match_status != 'SCHEDULED' GROUP BY team_id, team_name ) tm  
  JOIN ( SELECT team_id, COUNT(winner) AS total_winner FROM tournament_matches WHERE season_id = $1 AND winner = true GROUP BY team_id ) tm1 USING(team_id)  
  JOIN ( SELECT team_id, COUNT(loser) AS total_loser FROM tournament_matches WHERE season_id = $1 AND loser = true GROUP BY team_id ) tm2 USING(team_id)  
  JOIN ( SELECT team_id, COUNT(draw) AS total_draw FROM tournament_matches WHERE season_id = $1 AND draw = true GROUP BY team_id ) tm3 USING(team_id) ORDER BY p_winner DESC`,
  getPredictionMatches: `SELECT tm4.name1, tm4.side1,
  ((tm1.total_winner/tm.total_matches::float)+(tm6.total_loser/tm.total_matches::float))/2 AS tm1_winner, 
  ((tm3.total_draw/tm.total_matches::float)+(tm7.total_draw/tm.total_matches::float))/2 AS tm_draw,
  ((tm5.total_winner/tm.total_matches::float)+(tm2.total_loser/tm.total_matches::float))/2 AS tm2_winner, 
  tm4.name2, tm4.side2, tm4.t1_winner, tm4.draw, tm4.t2_winner, tm4.match_status, tm4.date
  
  FROM ( SELECT team_id, COUNT ( team_id ) AS total_matches FROM tournament_matches WHERE season_id = $1 AND match_status != 'SCHEDULED' GROUP BY team_id ) tm  
  JOIN ( SELECT team_id, COUNT(winner) AS total_winner FROM tournament_matches WHERE season_id = $1 AND winner = true GROUP BY team_id ) tm1 USING(team_id)  
  JOIN ( SELECT team_id, COUNT(loser) AS total_loser FROM tournament_matches WHERE season_id = $1 AND loser = true GROUP BY team_id ) tm2 USING(team_id)  
  JOIN ( SELECT team_id, COUNT(draw) AS total_draw FROM tournament_matches WHERE season_id = $1 AND draw = true GROUP BY team_id ) tm3 USING(team_id)

  JOIN (SELECT DISTINCT tm1.match_id, tm1.team_id, tm1.team_name AS name1, tm1.side AS side1, tm1.winner AS t1_winner, tm1.loser AS t1_loser, tm1.draw, 
  tm2.team_id AS team_2, tm2.team_name AS name2, tm2.side AS side2,tm2.winner AS t2_winner, tm2.loser AS t2_loser, tm1.date, tm1.match_status
  FROM tournament_matches tm1 JOIN tournament_matches tm2 ON tm1.match_id = tm2.match_id AND tm1.team_id != tm2.team_id AND tm1.side != tm2.side AND tm1.season_id = $1) tm4 USING(team_id)

  JOIN ( SELECT team_id, COUNT(winner) AS total_winner FROM tournament_matches WHERE season_id = $1 AND winner = true GROUP BY team_id ) tm5 ON tm5.team_id = tm4.team_2
  JOIN ( SELECT team_id, COUNT(loser) AS total_loser FROM tournament_matches WHERE season_id = $1 AND loser = true GROUP BY team_id ) tm6 ON tm6.team_id = tm4.team_2  
  JOIN ( SELECT team_id, COUNT(draw) AS total_draw FROM tournament_matches WHERE season_id = $1 AND draw = true GROUP BY team_id ) tm7 ON tm7.team_id = tm4.team_2
  ORDER BY tm4.date DESC`,
  emailExists: 'SELECT email FROM users WHERE email = $1',
  bet_report: `SELECT * FROM bets_report`,
  get_notifications: 'SELECT * FROM user_notifications WHERE user_id = $1',
};
