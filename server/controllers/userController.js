const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { nombre, email, contraseña } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    await db.query('INSERT INTO usuarios (nombre, email, contraseña, tipo_usuario) VALUES (?, ?, ?, ?)', 
      [nombre, email, hashedPassword, 'estudiante']);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, contraseña } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (users.length > 0) {
      const user = users[0];
      const match = await bcrypt.compare(contraseña, user.contraseña);
      if (match) {
        const token = jwt.sign({ userId: user.id, tipo_usuario: user.tipo_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user.id, nombre: user.nombre, tipo_usuario: user.tipo_usuario });
      } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
      }
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};
