const quizService = require('../services/quizService');

exports.addQuestion = async (req, res, next) => {
    try {
        const question = await quizService.addQuestion(req.body);
        res.status(201).json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getQuestionsByQuiz = async (req, res, next) => {
    try {
        const questions = await quizService.getQuestionsByQuiz(req.params.quizId);
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