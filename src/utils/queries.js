module.exports = {
    //Querys user
    getUsers:'SELECT * FROM app_user ORDER BY user_id ASC',
    getUserById: 'SELECT * FROM app_user WHERE user_id = $1',
    getLogin: 'SELECT * FROM app_user WHERE username = $1 AND password = $2',
    createUser: 'INSERT INTO app_user (username, email, password) VALUES ($1, $2, $3) RETURNING *',
    updateUser: 'UPDATE app_user SET username = $1, email = $2, password = $3, avatar = $4 WHERE user_id = $5 RETURNING *',
    deleteUser: 'DELETE FROM app_user where user_id = $1',

    //Queries forms
    getMenus: 'SELECT menu_id, title_menu FROM menu WHERE submenu IS NULL',
    getSub: 'WITH RECURSIVE ctemenu AS ( SELECT menu_id, title_menu, submenu FROM menu WHERE menu_id = $1 UNION ALL SELECT menu.menu_id, menu.title_menu, menu.submenu FROM menu JOIN ctemenu ON menu.submenu = ctemenu.menu_id) SELECT ctemenu.menu_id, ctemenu.title_menu, ctemenu.submenu, form.form_id, form.title_form FROM ctemenu LEFT JOIN form ON ctemenu.menu_id = form.menu_id ORDER BY ctemenu.menu_id',
    getQuestion: 'SELECT * FROM question INNER JOIN type_question on question.form_id = $1 AND question.question_id = type_question.question_id INNER JOIN form ON form.form_id = $1',
    getAnswer: 'SELECT form.title_form, question.title_q, question.value AS question, answer.value, answer.user_id, question.question_id FROM answer JOIN question ON answer.question_id = question.question_id JOIN form ON form.form_id = question.form_id and form.form_id = $1',
    getAnswerUser: 'SELECT form.title_form FROM answer INNER JOIN question ON answer.question_id = question.question_id INNER JOIN form ON form.form_id = question.form_id AND answer.user_id = $1',
    createMenu: 'INSERT INTO menu (title_menu, user_id, submenu) VALUES ($1, $2, $3) RETURNING *',
    createForm: 'INSERT INTO form (menu_id, title_form, description_form, locked) VALUES ($1, $2, $3, $4) RETURNING *',
    createQuestion: 'INSERT INTO question (form_id, title_q, description_q, value, response_size, required) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    createQuestion2: 'INSERT INTO type_question (question_id, selection, text, numeric, checklist) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    createAnswer: 'INSERT INTO answer (question_id, user_id, value) VALUES ($1, $2, $3) RETURNING *',
    deleteMenu: 'DELETE FROM menu WHERE menu_id = $1',
    deleteForm: 'DELETE FROM form WHERE form_id = $1',
    deleteQuestion: 'DELETE FROM question WHERE question_id = $1',
}
