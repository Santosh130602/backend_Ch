const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Option text is required'],
        trim: true,
        maxlength: [300, 'Option text cannot exceed 300 characters']
    },
    is_correct: {
        type: Boolean,
        default: false
    }
});

const questionSchema = new mongoose.Schema({
    quiz_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: [true, 'Quiz ID is required']
    },
    text: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true,
        maxlength: [500, 'Question text cannot exceed 500 characters']
    },
    type: {
        type: String,
        enum: ['multiple_choice', 'single_choice', 'text'],
        default: 'single_choice'
    },
    options: [optionSchema],
    max_text_length: {
        type: Number,
        default: 300
    },
    points: {
        type: Number,
        default: 1,
        min: [1, 'Points must be at least 1']
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

questionSchema.pre('save', function(next) {
    if (this.type !== 'text') {
        const correctOptions = this.options.filter(option => option.is_correct);
        
        if (correctOptions.length === 0) {
            return next(new Error('At least one correct option is required for multiple/single choice questions'));
        }
        
        if (this.type === 'single_choice' && correctOptions.length > 1) {
            return next(new Error('Single choice questions can have only one correct option'));
        }
    }
    
    if (this.type === 'text' && !this.max_text_length) {
        this.max_text_length = 300;
    }
    
    next();
});

module.exports = mongoose.model('Question', questionSchema);