export = {
    registerUser: 'INSERT INTO app_user(username, email, password) VALUES($1, $2, $3) RETURNING *'
}