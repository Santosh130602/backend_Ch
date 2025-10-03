const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Quiz = require('../models/Quiz');
const Question = require('../models/questions');

describe('Quiz API Tests', () => {
  let testQuizId;
  let testQuestionId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/quizapp_test');
  });

  afterAll(async () => {
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Quiz Management', () => {
    test('Should create a new quiz', async () => {
      const response = await request(app)
        .post('/api/quizzes')
        .send({
          title: 'Test Quiz',
          description: 'A test quiz for unit testing'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Quiz');
      testQuizId = response.body.data._id;
    });

    test('Should get all quizzes', async () => {
      const response = await request(app)
        .get('/api/quizzes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    test('Should get quiz by ID', async () => {
      const response = await request(app)
        .get(`/api/quizzes/${testQuizId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testQuizId);
    });
  });

  describe('Question Management', () => {
    test('Should add a question to quiz', async () => {
      const response = await request(app)
        .post('/api/questions')
        .send({
          quiz_id: testQuizId,
          text: 'What is 2+2?',
          type: 'single_choice',
          options: [
            { text: '3', is_correct: false },
            { text: '4', is_correct: true },
            { text: '5', is_correct: false }
          ],
          points: 2
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.text).toBe('What is 2+2?');
      testQuestionId = response.body.data._id;
    });

    test('Should get quiz questions without correct answers', async () => {
      const response = await request(app)
        .get(`/api/quizzes/${testQuizId}/questions`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      
      // Verify correct answers are not included
      response.body.data.forEach(question => {
        question.options.forEach(option => {
          expect(option.is_correct).toBeUndefined();
        });
      });
    });
  });
});