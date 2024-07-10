const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/random', questionController.getRandomQuestions);
router.post('/submit', questionController.submitAnswer);

module.exports = router;