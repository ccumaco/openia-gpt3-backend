const bcrypt = require('bcrypt');
const { db } = require('../dbServer')
const jwt = require('jsonwebtoken');

const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
}

const getUserInfoFromDB = async (userEmail) => {
  const query = 'SELECT * FROM users WHERE userEmail = ?'
  await db.query(query, [userEmail], (error, results) => {
    console.log(results[0]);
    if (error) {
      console.log(error);
      return null
    };
    return results[0];
  });
}

const generateNewToken = () => {
  // Obtener información del usuario a partir de la base de datos
  // ...
  const user = getUserInfoFromDB();
  
  // Crear payload del token
  const payload = {
    userId: user.id,
    email: user.email
  };
  
  // Generar nuevo token de acceso
  const options = { expiresIn: '30m' };
  const secret = process.env.SECRET;
  const newToken = jwt.sign(payload, secret, options);
  
  return newToken;
}
const checkToken = (req) => {
  // Obtener token del encabezado de la petición
  const token = req.headers['authorization'];
  
  // Verificar si existe un token
  if (!token) {
    // Generar nuevo token si no existe
    return generateNewToken();
  }
  
  try {
    // Verificar validez del token existente
    const decoded = jwt.verify(token, process.env.SECRET);
    return token;
  } catch(err) {
    // Generar nuevo token si el existente es inválido
    return generateNewToken();
  }
}
const login = async (req, res) => {
  const { userEmail } = req.body
  if (getUserInfoFromDB(userEmail)) {
    res.send(checkToken(req))
  }
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
      res.send({ message: 'Usuario registrado correctamente', newToken });
    }
  );
}
const logout = (req, res) => {
  // Elimina el userToken de acceso del usuario (ejemplo con cookie)
  res.clearCookie('accessToken');

  // Envía una respuesta al cliente indicando que la sesión ha sido cerrada correctamente
  res.send({ message: 'Logout successful' });
}


module.exports = {
  login,
  register,
  logout,
  generateNewToken
}