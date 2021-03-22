export = {
    registerUser: 'INSERT INTO app_user(username, email, password) VALUES($1, $2, $3) RETURNING *',
    login: 'SELECT user_id, password FROM app_user WHERE username = $1'
}