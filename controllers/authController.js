const bcrypt = require('bcrypt');
const { db } = require('../dbServer')
const jwt = require('jsonwebtoken');
const { getUserInfoFromDB } = require('../utils');
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
  const user = await getUserInfoFromDB(userEmail);
  if (user) {
    if (await comparePassword(userPassword, user.userPassword) === false) {
      res.send('contraseña o email invalido');
      return;
    };
    res.send({
      userId: user.userId,
      userEmail: user.userEmail,
      userName: user.userName,
      userToken: checkToken(req)
    });
  } else {
    res.status(401).send({error: 'no se encuentra el usuario'});
  };
};
const register = async (req, res) => {
  // Obtén los datos del usuario de la solicitud
  const { userName, userEmail, userPassword } = req.body;

  // Hashea la contraseña del usuario
  const hashedPassword = await bcrypt.hash(userPassword, 10);

  const newToken = checkToken(req);
  // Inserta el nuevo usuario en la base de datos
  db.query(
    'INSERT INTO users (userName, userEmail, userPassword, userToken) VALUES (?, ?, ?, ?)',
    [userName, userEmail, hashedPassword, newToken],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ error: 'Error al registrar el usuario'});
      }
      res.send({ userEmail, userName, userToken: newToken });
    }
  );
}
const logout = (req, res) => {
  // Elimina el userToken de acceso del usuario (ejemplo con cookie)
  res.clearCookie('accessToken');

  // Envía una respuesta al cliente indicando que la sesión ha sido cerrada correctamente
  res.send({ message: 'Logout successful' });
}

const verifyToken = (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ valid: false });
    }
    // aqui se podria verificar tambien la fecha de expiracion
    return res.status(200).json({ valid: true });
  });
}


module.exports = {
  login,
  register,
  logout,
  verifyToken
}