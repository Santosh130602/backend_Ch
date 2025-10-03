# backend VERTO - Quiz Management API

A **Node.js + Express** backend server for creating quizzes, adding questions, submitting answers, and calculating scores.
The project uses **MongoDB (Mongoose)** for data storage, **Joi** for validation, and **Jest + Supertest** for API testing.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Folder Structure](#folder-structure)
* [Environment Variables](#environment-variables)
* [Installation & Setup](#installation--setup)
* [Running the Project](#running-the-project)
* [API Endpoints](#api-endpoints)

  * [Quiz Routes](#quiz-routes)
  * [Question Routes](#question-routes)
* [Request & Response Examples](#request--response-examples)
* [Validation Rules](#validation-rules)
* [Scoring Logic](#scoring-logic)
* [Testing](#testing)
* [Health Check](#health-check)
* [Error Handling](#error-handling)
* [Contribution](#contribution)
* [License](#license)
* [Author](#author)

---

## Features

* Create quizzes and manage questions
* Submit answers and calculate scores automatically
* Supports **single choice**, **multiple choice**, and **text questions**
* Request validation using **Joi**
* Clean API responses with consistent success/error structure
* Comprehensive **unit and integration tests**

---

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Validation:** Joi
* **Testing:** Jest, Supertest, mongodb-memory-server
* **Utilities:** dotenv, colors

---

## Folder Structure

```
.
├── config/
│   └── db.js               
├── controllers/
│   ├── quizController.js    
│   └── questionController.js
├── middleware/
│   └── validation.js        
├── models/
│   ├── Quiz.js
│   ├── Question.js
│   └── Option.js
├── routers/
│   ├── quizzRouter.js      
│   └── questionRoute.js     
├── services/
│   ├── quizService.js
│   └── scoringService.js
├── tests/
│   ├── quiz.test.js
│   └── scoringService.test.js
├── index.js                
├── package.json
└── .env
```

---

## Environment Variables

| Variable      | Description               | Example                             |
| ------------- | ------------------------- | ----------------------------------- |
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017/quizapp` |
| `PORT`        | Port on which server runs | `4000`                              |

---

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/Santosh130602/backend_Ch.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root:

```env
PORT=4000
MONGODB_URL=mongodb://localhost:27017/quizapp
```

4. Start the server:

* Development (with nodemon):

```bash
npm run dev
```

* Production:

```bash
npm start
```

* Testing:

```bash
npm test
```

---

## API Endpoints

### Quiz Routes (`/api/quizzes`)

| Method | Endpoint         | Body / Params            | Description                                            |
| ------ | ---------------- | ------------------------ | ------------------------------------------------------ |
| POST   | `/`              | `{ title, description }` | Create a new quiz                                      |
| GET    | `/`              | —                        | Get all quizzes                                        |
| GET    | `/:id`           | `id`                     | Get quiz by ID                                         |
| GET    | `/:id/questions` | `id`                     | Get all questions for a quiz (without correct answers) |
| POST   | `/:id/submit`    | `{ answers: [...] }`     | Submit answers and calculate score                     |

### Question Routes (`/api/questions`)

| Method | Endpoint        | Body / Params                                               | Description                           |
| ------ | --------------- | ----------------------------------------------------------- | ------------------------------------- |
| POST   | `/`             | `{ quiz_id, text, type, options, points, max_text_length }` | Add a new question                    |
| GET    | `/quiz/:quizId` | `quizId`                                                    | Get all questions for a specific quiz |

---

## Request & Response Examples

### Create Quiz

**Request**

```json
POST /api/quizzes
{
  "title": "Math Quiz",
  "description": "Basic arithmetic quiz"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "_id": "64e7b12e0f4a2b3c12345678",
    "title": "Math Quiz",
    "description": "Basic arithmetic quiz",
    "created_at": "2025-10-03T00:00:00Z",
    "updated_at": "2025-10-03T00:00:00Z"
  }
}
```

### Add Question (Single Choice)

**Request**

```json
POST /api/questions
{
  "quiz_id": "64e7b12e0f4a2b3c12345678",
  "text": "What is 2 + 2?",
  "type": "single_choice",
  "options": [
    { "text": "3", "is_correct": false },
    { "text": "4", "is_correct": true }
  ],
  "points": 2
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "_id": "64e7b1ab0f4a2b3c12345679",
    "quiz_id": "64e7b12e0f4a2b3c12345678",
    "text": "What is 2 + 2?",
    "type": "single_choice",
    "options": [
      { "_id": "64e7b1ab0f4a2b3c12345680", "text": "3" },
      { "_id": "64e7b1ab0f4a2b3c12345681", "text": "4" }
    ],
    "points": 2,
    "created_at": "2025-10-03T00:00:00Z"
  }
}
```

### Submit Answers

**Request**

```json
POST /api/quizzes/64e7b12e0f4a2b3c12345678/submit
{
  "answers": [
    {
      "questionId": "64e7b1ab0f4a2b3c12345679",
      "selectedOptionId": "64e7b1ab0f4a2b3c12345681"
    }
  ]
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "score": 2,
    "total": 2,
    "percentage": 100,
    "results": [
      {
        "questionId": "64e7b1ab0f4a2b3c12345679",
        "correct": true,
        "points": 2
      }
    ]
  }
}
```

---

## Validation Rules

* **Quiz:**

  * `title` → required, max 200 characters
  * `description` → optional, max 500 characters

* **Question:**

  * `quiz_id` → required, must be valid ObjectId
  * `text` → required, max 500 characters
  * `type` → `'single_choice' | 'multiple_choice' | 'text'`
  * `options` → required for choice questions, at least 2 options, one correct for single_choice, ≥1 correct for multiple_choice
  * `max_text_length` → required only for text questions, default 300
  * `points` → minimum 1

* **Answer Submission:**

  * At least 1 answer required
  * Each answer must include `questionId`
  * `selectedOptionId` → for single_choice
  * `selectedOptionIds` → for multiple_choice
  * `answerText` → for text questions

---


