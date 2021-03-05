const { Router } = require('express');
const router = Router();

const { 
    getUsers, 
    getUserById, 
    getLogin,
    createUser, 
    updateUser, 
    deleteUser 
} = require('../controllers/users.controllers');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/login', getLogin);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;