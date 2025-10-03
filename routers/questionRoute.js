const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const validation = require('../middleware/validation');

router.post('/', validation.validateQuestion, questionController.addQuestion);
router.get('/quiz/:quizId', questionController.getQuestionsByQuiz);

module.exports = router;