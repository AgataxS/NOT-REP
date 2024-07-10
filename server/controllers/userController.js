const db = require('../config/db');

exports.registerUser = async (req, res) => {
  const { nombre, email, contraseña } = req.body;
  try {
    await db.query('INSERT INTO usuarios (nombre, email, contraseña, tipo_usuario) VALUES (?, ?, ?, ?)', 
      [nombre, email, contraseña, 'estudiante']);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, contraseña } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM usuarios WHERE email = ? AND contraseña = ?', [email, contraseña]);
    if (user.length > 0) {
      res.json({ userId: user[0].id, nombre: user[0].nombre, tipo_usuario: user[0].tipo_usuario });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};