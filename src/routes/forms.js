const { Router } = require('express');
const router = Router();

const { 
    getMenus, 
    getSub,
    getQuestion,
    getAnswer,
    getAnswerUser,
    createMenu,
    createForm,
    createQuestion,
    createAnswer,
    deleteMenu,
    deleteForm,
    deleteQuestion,
} = require('../controllers/forms.controllers');

router.get('/menu', getMenus);
router.get('/submenu/:id', getSub);
router.get('/question/:id', getQuestion);
router.get('/answer/:id', getAnswer);
router.get('/answerUser/:id', getAnswerUser);

router.post('/menu', createMenu);
router.post('/form', createForm);
router.post('/question', createQuestion);
router.post('/answer', createAnswer);

router.delete('/menu/:id', deleteMenu);
router.delete('/form/:id', deleteForm);
router.delete('/question/:id', deleteQuestion);

module.exports = router;