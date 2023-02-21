const bcrypt = require('bcrypt');
const { db } = require('../dbServer')
const jwt = require('jsonwebtoken');
const { getUserInfoFromDB } = require('../utils');
const User = require('../models/users');
require("dotenv").config()

const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
}



const generateNewToken = (userEmail) => {
  // Obtener información del usuario a partir de la base de datos
  // ...
  const user = getUserInfoFromDB(userEmail);
  
  // Crear payload del token
  const payload = {
    userId: user.id,
    email: user.email
  };
  
  // Generar nuevo token de acceso
  const options = { expiresIn: '2d' };
  const secret = process.env.JWT_SECRET;
  const newToken = jwt.sign(payload, secret, options);
  
  return newToken;
}
const checkToken = (req) => {
  // Obtener token del encabezado de la petición
  const token = req.headers['authorization'];
  
  // Verificar si existe un token
  if (!token) {
    // Generar nuevo token si no existe
    return generateNewToken(req.userEmail);
  }
  
  try {
    // Verificar validez del token existente
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return token;
  } catch(err) {
    // Generar nuevo token si el existente es inválido
    return generateNewToken();
  }
}

async function comparePassword(userPassword, databasePassword) {
  const isMatch = await bcrypt.compare(userPassword, databasePassword);
  return isMatch;
}
const login = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  // Busca al usuario en la base de datos
  const user = await User.findOne({ where: { userEmail } });

  // Si el usuario no existe, devuelve un error
  if (!user) {
      return res.status(400).json({ message: 'El correo electrónico o la contraseña son incorrectos.' });
  }

  // Verifica la contraseña del usuario
  const isMatch = await bcrypt.compare(userPassword, user.userPassword);

  // Si la contraseña no coincide, devuelve un error
  if (!isMatch) {
      return res.status(400).json({ message: 'El correo electrónico o la contraseña son incorrectos.' });
  }

  // Genera un token JWT para el usuario
  const token = jwt.sign({ userId: user.userId }, 'secreto');
  req.session.user = user;
  // Devuelve el token al cliente
  res.json({ "userToken": token, valid: true });
};
const register = async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    // Validar los datos recibidos
    if (!userName) {
      return res.status(400).json({ message: 'El nombre de usuario es requerido' });
    }

    if (!userEmail) {
      return res.status(400).json({ message: 'El correo electrónico es requerido' });
    }

    if (!userPassword) {
      return res.status(400).json({ message: 'La contraseña es requerida' });
    }

    // Crear un nuevo usuario en la base de datos
    const newUser = await User.create({
      userName,
      userEmail,
      userPassword
    });

    // Enviar la respuesta al cliente
    res.status(201).json({ message: 'Usuario registrado exitosamente', newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
}
const logout = (req, res) => {
  // Elimina el userToken de acceso del usuario (ejemplo con cookie)
  res.clearCookie('accessToken');
  req.session.destroy()
  // Envía una respuesta al cliente indicando que la sesión ha sido cerrada correctamente
  res.send({ message: 'Logout successful' });
}

module.exports = {
  login,
  register,
  logout
}