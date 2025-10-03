const Question = require('../models/questions');

exports.calculateScore = async (quizId, userAnswers) => {
    try {
        const questions = await Question.find({ quiz_id: quizId });
        
        if (questions.length === 0) {
            throw new Error('No questions found for this quiz');
        }

        let score = 0;
        let totalPossible = 0;
        const results = [];

        const questionMap = new Map();
        questions.forEach(q => {
            questionMap.set(q._id.toString(), q);
            totalPossible += q.points;
        });

        userAnswers.forEach(userAnswer => {
            const question = questionMap.get(userAnswer.questionId);
            
            if (!question) {
                results.push({
                    questionId: userAnswer.questionId,
                    correct: false,
                    error: 'Question not found'
                });
                return;
            }

            let isCorrect = false;

            if (question.type === 'text') {
                isCorrect = !!userAnswer.answerText && 
                           userAnswer.answerText.length <= question.max_text_length;
            } else {
                const correctOptions = question.options
                    .filter(opt => opt.is_correct)
                    .map(opt => opt._id.toString());

                if (question.type === 'single_choice') {
                    isCorrect = correctOptions.length === 1 && 
                               correctOptions[0] === userAnswer.selectedOptionId;
                } else if (question.type === 'multiple_choice') {
                    const userSelections = Array.isArray(userAnswer.selectedOptionIds) 
                        ? userAnswer.selectedOptionIds 
                        : [];
                    
                    isCorrect = correctOptions.length === userSelections.length &&
                               correctOptions.every(opt => userSelections.includes(opt)) &&
                               userSelections.every(opt => correctOptions.includes(opt));
                }
            }

            if (isCorrect) {
                score += question.points;
            }

            results.push({
                questionId: userAnswer.questionId,
                correct: isCorrect,
                points: isCorrect ? question.points : 0
            });
        });

        return {
            score,
            total: totalPossible,
            percentage: totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0,
            results
        };
    } catch (error) {
        throw new Error(`Error calculating score: ${error.message}`);
    }
};