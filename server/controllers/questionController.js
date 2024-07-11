const db = require('../config/db');

exports.getRandomQuestions = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM preguntas ORDER BY RAND() LIMIT 10');
    console.log('Preguntas:', rows); 
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron preguntas' });
    }
    
    const questionsWithAnswers = await Promise.all(rows.map(async (question) => {
      const [answers] = await db.query('SELECT * FROM respuestas WHERE pregunta_id = ?', [question.id]);
      console.log('Respuestas para pregunta', question.id, ':', answers);
      return { ...question, respuestas: answers }
    }));

    res.json(questionsWithAnswers);
  } catch (error) {
    console.error('Error al obtener preguntas aleatorias:', error); 
    res.status(500).json({ message: 'Error al obtener preguntas aleatorias' });
  }
};

exports.submitAnswer = async (req, res) => {
  const { answerId } = req.body;
  try {
    const [answer] = await db.query('SELECT es_correcta FROM respuestas WHERE id = ?', [answerId]);
    console.log('Respuesta:', answer); 
    if (!answer || answer.length === 0) {
      return res.status(404).json({ message: 'Respuesta no encontrada' });
    }
    res.json({ isCorrect: answer[0].es_correcta });
  } catch (error) {
    console.error('Error al enviar la respuesta:', error); 
    res.status(500).json({ message: 'Error al enviar la respuesta' });
  }
};
