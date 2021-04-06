export = {
  registerUser:
    'INSERT INTO app_user(username, email, password) VALUES($1, $2, $3) RETURNING *',
  login: 'SELECT user_id, password, username FROM app_user WHERE email = $1',
  invalidToken: 'SELECT token FROM invalidTokens WHERE token = $1',
  invalidateToken: 'INSERT INTO invalidTokens(token) VALUES($1)',
};
