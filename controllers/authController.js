const bcrypt = require('bcrypt');
const { db } = require('../dbServer')
const jwt = require('jsonwebtoken');

const verifyPassword = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword)
};
const login = async (req, res) => {
  console.log(req.body);
  const { userEmail, userPassword, userToken } = req.body;

  // Busca el usuario en la base de datos
  db.query('SELECT * FROM users WHERE userEmail = ?', [userEmail], (err, results) => {
    // valida si el usuario no existe
    if (err || !results.length) return res.status(401).send({ message: 'No existe el usuario' });

    const user = results[0];
    // Verifica la contraseña
    if (!verifyPassword(userPassword, user.userPassword)) return res.status(401).send({ message: 'La contraseña o correo no coinciden' });

    // verifica que envie un token
    // if (userToken != results[0].userToken) return res.send('token invalido')
    try {
      const decoded = jwt.verify(userToken, process.env.SECRET);
      res.status(200).send(user)
      return
    } catch (error) {
      console.log('entro al catch');
      const options = { expiresIn: 36000 };
      const newToken = jwt.sign({ userEmail: userEmail }, process.env.SECRET, options);
      db.query('UPDATE users SET userToken = ? WHERE userEmail = ?', [newToken, userEmail],
        (error, results) => {
          if (error) {
            return res.status(500).send({ error: 'Error al generar token' });
          }
          user.userToken = newToken
          res.status(200).send(user);
        })
      return
    }
  });
};
const register = async (req, res) => {
  // Obtén los datos del usuario de la solicitud
  const { userEmail, userPassword } = req.body;

  // Hashea la contraseña del usuario
  const hashedPassword = await bcrypt.hash(userPassword, 10);


  // Expiración en 7 días
  const options = { expiresIn: 36000 };
  const newToken = jwt.sign({ userEmail: userEmail }, process.env.SECRET, options);
  // Inserta el nuevo usuario en la base de datos
  db.query(
    'INSERT INTO users (userEmail, userPassword, userToken) VALUES (?, ?, ?)',
    [userEmail, hashedPassword, newToken],
    (error, results) => {
      if (error) {
        return res.status(500).send({ error: 'Error al registrar el usuario' });
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
  logout
}