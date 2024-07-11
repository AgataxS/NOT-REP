const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const auth = require('../middleware/auth');

router.get('/random', auth, questionController.getRandomQuestions);
router.post('/submit', auth, questionController.submitAnswer);

module.exports = router;