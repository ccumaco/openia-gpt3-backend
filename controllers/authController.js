const bcrypt = require('bcrypt');
const { db } = require('../dbServer')
const jwt = require('jsonwebtoken');
const { getUserInfoFromDB } = require('../utils');
require("dotenv").config()
const validator = require('validator');
const nodemailer = require("nodemailer");
const { successEmail } = require('../Emails/html');
const { transporter } = require('../Emails/mailer');




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
  } catch (err) {
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
      res.status(400).send({ status: false, message: 'contraseña o email invalido' });
      return;
    };
    res.send({
      userId: user.userId,
      userEmail: user.userEmail,
      userName: user.userName,
      userToken: checkToken(req)
    });
  } else {
    res.status(401).send({ status: false, message: 'no se encuentra el usuario' });
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
        return res.status(500).send({ error: 'Error al registrar el usuario' });
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

const recoveryPassword = async (req, res) => {
  const { email, userId } = req.body;
  try {
    if (!validator.isEmail(email)) {
      res.status(400).send('Dirección de correo electrónico inválida');
      return;
    }

    const results = await db.query('SELECT * FROM users WHERE userEmail = ?', [db.escape(email)]);
    if (results.length === 0) {
      res.status(404).send('Usuario no encontrado');
      return;
    }

    const resetToken = Math.random().toString(36).slice(-8);

    const query = 'UPDATE users SET reset_token = ? WHERE userId = ?'
    await db.query(query, [resetToken, userId]);
    let objToRecoveryPassword = {
      from: 'Arquitext <recovery@arquitext.com>',
      to: email,
      subject: "Recuperar Contraseña de tu cuenta Incopy",
      html: successEmail(resetToken),
    }

    let info = await transporter.sendMail(objToRecoveryPassword);

    return res.status(200).send({
      messageId: info.messageId,
      message: "Envio exitoso"
    });
  } catch (err) {
    console.error('Error al recuperar la contraseña: ', err);
    res.status(500).send({ error: 'Error al recuperar la contraseña' });
  }
};

module.exports = {
  login,
  register,
  logout,
  verifyToken,
  recoveryPassword
}