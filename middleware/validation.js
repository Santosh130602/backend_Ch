const Joi = require('joi');

const quizSchema = Joi.object({
    title: Joi.string().trim().max(200).required(),
    description: Joi.string().trim().max(500).optional()
});

const questionSchema = Joi.object({
    quiz_id: Joi.string().hex().length(24).required(),
    text: Joi.string().trim().max(500).required(),
    type: Joi.string().valid('multiple_choice', 'single_choice', 'text').default('single_choice'),
    options: Joi.when('type', {
        is: Joi.valid('multiple_choice', 'single_choice'),
        then: Joi.array().items(
            Joi.object({
                text: Joi.string().trim().max(300).required(),
                is_correct: Joi.boolean().default(false)
            })
        ).min(2).required(),
        otherwise: Joi.forbidden()
    }),
    max_text_length: Joi.when('type', {
        is: 'text',
        then: Joi.number().max(300).default(300),
        otherwise: Joi.forbidden()
    }),
    points: Joi.number().min(1).default(1)
});

const answerSubmissionSchema = Joi.object({
    answers: Joi.array().items(
        Joi.object({
            questionId: Joi.string().hex().length(24).required(),
            selectedOptionId: Joi.string().hex().length(24).optional(),
            selectedOptionIds: Joi.array().items(Joi.string().hex().length(24)).optional(),
            answerText: Joi.string().trim().max(300).optional()
        })
    ).min(1).required()
});

exports.validateQuiz = (req, res, next) => {
    const { error } = quizSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }
    next();
};

exports.validateQuestion = (req, res, next) => {
    const { error } = questionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }
    next();
};

exports.validateSubmission = (req, res, next) => {
    const { error } = answerSubmissionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }
    next();
};