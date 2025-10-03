const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const scoringService = require('../services/scoringService');
const Quiz = require('../models/Quiz');
const Question = require('../models/questions');

let mongoServer;

describe('Scoring Service Tests', () => {
  let testQuiz;
  let testQuestions;

  beforeAll(async () => {
    jest.setTimeout(10000);
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    testQuiz = await Quiz.create({
      title: 'Scoring Test Quiz',
      description: 'Quiz for scoring tests'
    });

    testQuestions = await Question.insertMany([
      {
        quiz_id: testQuiz._id,
        text: 'Single choice question',
        type: 'single_choice',
        options: [
          { text: 'Correct', is_correct: true },
          { text: 'Wrong', is_correct: false }
        ],
        points: 1
      },
      {
        quiz_id: testQuiz._id,
        text: 'Multiple choice question',
        type: 'multiple_choice',
        options: [
          { text: 'Correct 1', is_correct: true },
          { text: 'Wrong', is_correct: false },
          { text: 'Correct 2', is_correct: true }
        ],
        points: 2
      }
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Should calculate correct score for single choice', async () => {
    const question = testQuestions[0];
    const correctOptionId = question.options.find(o => o.is_correct)._id.toString();

    const userAnswers = [
      {
        questionId: question._id.toString(),
        selectedOptionId: correctOptionId // singular for single_choice
      }
    ];

    const result = await scoringService.calculateScore(testQuiz._id.toString(), userAnswers);
    expect(result.score).toBe(1);
    expect(result.total).toBe(3);
    expect(result.results[0].correct).toBe(true);
  });

  test('Should calculate correct score for multiple choice', async () => {
    const question = testQuestions[1];
    const correctOptionIds = question.options.filter(o => o.is_correct).map(o => o._id.toString());

    const userAnswers = [
      {
        questionId: question._id.toString(),
        selectedOptionIds: correctOptionIds // array for multiple_choice
      }
    ];

    const result = await scoringService.calculateScore(testQuiz._id.toString(), userAnswers);
    expect(result.score).toBe(2);
    expect(result.results[0].correct).toBe(true);
  });

  test('Should handle incorrect answers', async () => {
    const question = testQuestions[0];
    const wrongOptionId = question.options.find(o => !o.is_correct)._id.toString();

    const userAnswers = [
      {
        questionId: question._id.toString(),
        selectedOptionId: wrongOptionId // singular for single_choice
      }
    ];

    const result = await scoringService.calculateScore(testQuiz._id.toString(), userAnswers);
    expect(result.score).toBe(0);
    expect(result.results[0].correct).toBe(false);
  });
});
