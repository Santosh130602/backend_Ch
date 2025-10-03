const Quiz = require('../models/Quiz');
const Question = require('../models/questions');

exports.createQuiz = async (quizData) => {
    try {
        const quiz = new Quiz(quizData);
        return await quiz.save();
    } catch (error) {
        throw new Error(`Error creating quiz: ${error.message}`);
    }
};

exports.getAllQuizzes = async () => {
    try {
        return await Quiz.find().select('-__v').sort({ created_at: -1 });
    } catch (error) {
        throw new Error(`Error fetching quizzes: ${error.message}`);
    }
};

exports.getQuizById = async (quizId) => {
    try {
        return await Quiz.findById(quizId).select('-__v');
    } catch (error) {
        throw new Error(`Error fetching quiz: ${error.message}`);
    }
};

exports.getQuizQuestions = async (quizId) => {
    try {
        const questions = await Question.find({ quiz_id: quizId })
            .select('-options.is_correct -__v')
            .populate('quiz_id', 'title');
        
        const sanitizedQuestions = questions.map(question => {
            const questionObj = question.toObject();
            questionObj.options = questionObj.options.map(option => {
                const { is_correct, ...sanitizedOption } = option;
                return sanitizedOption;
            });
            return questionObj;
        });
        
        return sanitizedQuestions;
    } catch (error) {
        throw new Error(`Error fetching quiz questions: ${error.message}`);
    }
};

exports.addQuestion = async (questionData) => {
    try {
        const quiz = await Quiz.findById(questionData.quiz_id);
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        const question = new Question(questionData);
        return await question.save();
    } catch (error) {
        throw new Error(`Error adding question: ${error.message}`);
    }
};

exports.getQuestionsByQuiz = async (quizId) => {
    try {
        return await Question.find({ quiz_id: quizId })
            .populate('quiz_id', 'title')
            .select('-__v');
    } catch (error) {
        throw new Error(`Error fetching questions: ${error.message}`);
    }
};