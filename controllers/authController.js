const bcrypt = require('bcrypt');
const { db } = require('../dbServer')
const jwt = require('jsonwebtoken');
const { getUserInfoFromDB, hashedPassword } = require('../utils');
require("dotenv").config()
const validator = require('validator');
const nodemailer = require("nodemailer");
const { successEmail } = require('../Emails/html');
const { transporter } = require('../Emails/mailer');
const User = require('../Models/Users');




const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
}


const generateNewToken = async (userEmail) => {
  // Obtener información del usuario a partir de la base de datos
  // ...
  const user = await User.findOne({ where: { userEmail: userEmail } })

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
const checkToken = async (req, userEmail) => {
  // Obtener token del encabezado de la petición
  const token = req.headers['authorization'];

  // Verificar si existe un token
  if (!token) {
    // Generar nuevo token si no existe
    return await generateNewToken(req.userEmail);
  }

  try {
    // Verificar validez del token existente
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return token;
  } catch (err) {
    // Generar nuevo token si el existente es inválido
    return await generateNewToken(userEmail);
  }
}

const comparePassword = async (userPassword, databasePassword) => {
  const isMatch = await bcrypt.compare(userPassword, databasePassword);
  return isMatch;
}
const login = async (req, res) => {
  const { userEmail, userPassword } = req.body;
  if (!userEmail || !userPassword) {
    return res.status(400).send({ status: false, message: 'falta correo o contraseña' });
  }
  console.log(userEmail, userPassword, 'userEmail, userEmailuserEmailuserEmail');
  const user = await User.findOne({ where: { userEmail: userEmail } })
  if (user) {
    if (await comparePassword(userPassword, user.userPassword) === false) {
      res.status(400).send({ status: false, message: 'contraseña o email invalido' });
      return;
    };
    const userToken = await checkToken(req, userEmail)
    res.status(200).send({
      userId: user.userId,
      userEmail: user.userEmail,
      userName: user.userName,
      userPlan: user.userPlan,
      userStatus: user.userStatus,
      userToken
    });
  } else {
    res.status(401).send({ status: false, message: 'no se encuentra el usuario' });
  };
};
const register = async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;
  try {
    const password = await hashedPassword(userPassword);
    const newToken = jwt.sign({ userEmail }, process.env.JWT_SECRET);
    const user = await User.create({
      userName,
      userEmail,
      userPassword: password,
      userToken: newToken
    });
    res.send({user, status: 200});
  } catch (error) {
    res.status(404).send({ errors: error.errors });
  }
};
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
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    res.status(400).send({ message: 'Dirección de correo electrónico inválida' });
    return;
  }

  const user = await User.findOne({ where: { userEmail: email } });
  if (!user) {
    res.status(404).send({ message: 'Usuario no encontrado' });
    return;
  }

  const resetToken = await generateNewToken(email);
  try {
    const result = await User.update(
      { reset_token: resetToken },
      { where: { userEmail: email } }
    );
    if (result.length) {
      let objToRecoveryPassword = {
        from: 'Arquitext <recovery@arquitext.com>',
        to: email,
        subject: "Recuperar Contraseña de tu cuenta Incopy",
        html: successEmail(resetToken, email),
      }
  
      let info = await transporter.sendMail(objToRecoveryPassword);
  
      return res.status(200).send({
        messageId: info.messageId,
        message: "Se a enviado exitosamente a tu correo un link para recuperar tu contraseña"
      });
    } else {
      throw new Error;
    }
  } catch (error) {
    console.error('Error al recuperar la contraseña: ', error);
    res.status(500).send({ message: 'Error al recuperar la contraseña' });
    return false;
  }
};

const verifyTokenEmail = async (req, res) => {
  const { email, token } = req.body;
  console.log(token);
  const tokenValidated = await jwt.verify(token, process.env.JWT_SECRET)
  if (tokenValidated) {
    res.status(200).send({
      message: "el token se a validado exitosamente puedes cambiar tu contraseña"
    })
  } else {
    res.status(404).send({
      message: "el token o email no son validos"
    })
  }
}

const newPassword = async (req, res) => {
  const { newPassword, repeatPassword, token } = req.body;
  console.log(newPassword, repeatPassword, 'token');
  console.log(token, 'token');
  if (newPassword != repeatPassword) return res.status(400).send({ message: "Las contraseñas no coinciden" })
  if (newPassword.length < 5) return res.status(400).send({ message: "La contraseña tiene menos de 5 caracteres" })
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const query = "UPDATE users SET userPassword = ? WHERE reset_token = ?";
  try {
    const results = await db.query(query, [hashedPassword, token])
    res.status(200).send({
      message: "La contraseña se a cambiado "
    })
  } catch (error) {
    console.log(error, "algo fallo");
    res.status(404).send("algo fallo")
  }
}

module.exports = {
  login,
  register,
  logout,
  verifyToken,
  recoveryPassword,
  verifyTokenEmail,
  newPassword
}