module.exports = {
    //Querys user
    getLogin: 'SELECT * FROM app_user WHERE username = $1 AND password = $2',
    createUser: 'INSERT INTO app_user (username, email, password) VALUES ($1, $2, $3) RETURNING *',
    updateUser: 'UPDATE app_user SET username = $1, email = $2, password = $3, phone = $4, address = $5, bettor = $6 WHERE user_id = $7 RETURNING *',
    deleteUser: 'DELETE FROM app_user where user_id = $1',

}
