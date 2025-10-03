const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const quizRoutes = require('./routers/quizzRouter');
const questionRoutes = require('./routers/questionRoute');
const database = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 8000;

// Connect to database and start server
const startServer = async () => {
    try {
        await database.connect();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`.yellow.underline.bold);
        });
    } catch (error) {
        console.error('Failed to start server:', error.red.bold);
        process.exit(1);
    }
};

startServer();

module.exports = app;