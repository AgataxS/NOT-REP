const db = require('../config/db');

exports.getRandomQuestions = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM preguntas ORDER BY RAND() LIMIT 10');
    
    const questionsWithAnswers = await Promise.all(rows.map(async (question) => {
      const [answers] = await db.query('SELECT * FROM respuestas WHERE pregunta_id = ?', [question.id]);
      return { ...question, respuestas: answers };
    }));
    
    res.json(questionsWithAnswers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener preguntas aleatorias' });
  }
};

exports.submitAnswer = async (req, res) => {
  const { answerId } = req.body;
  try {
    const [answer] = await db.query('SELECT es_correcta FROM respuestas WHERE id = ?', [answerId]);
    res.json({ isCorrect: answer[0].es_correcta });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar la respuesta' });
  }
};