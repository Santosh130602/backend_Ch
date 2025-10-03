const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const validation = require('../middleware/validation');

router.post('/', validation.validateQuiz, quizController.createQuiz);
router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizById);
router.get('/:id/questions', quizController.getQuizQuestions);
router.post('/:id/submit', validation.validateSubmission, quizController.submitAnswers);

module.exports = router;