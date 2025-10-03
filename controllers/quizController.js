const quizService = require('../services/quizService');
const scoringService = require('../services/scoringService');

exports.createQuiz = async (req, res, next) => {
    try {
        const quiz = await quizService.createQuiz(req.body);
        res.status(201).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getAllQuizzes = async (req, res, next) => {
    try {
        const quizzes = await quizService.getAllQuizzes();
        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getQuizById = async (req, res, next) => {
    try {
        const quiz = await quizService.getQuizById(req.params.id);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found'
            });
        }
        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getQuizQuestions = async (req, res, next) => {
    try {
        const questions = await quizService.getQuizQuestions(req.params.id);
        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.submitAnswers = async (req, res, next) => {
    try {
        const { answers } = req.body;
        const quizId = req.params.id;
        
        const result = await scoringService.calculateScore(quizId, answers);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};