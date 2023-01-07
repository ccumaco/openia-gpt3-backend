const { db } = require("../dbServer");

const index = (req, res) => {
  if (req.session.loggedin) {
    // Output username
    res.send('enviando al home');

  } else {
    res.send('Inicia Sesion');
  }
}

const register = (req, res) => {
  res.send('tienes que ir a registro');
}

const auth = async (req, res) => {
  let { email, password } = req.body;
  db.query('SELECT * FROM users WHERE userEmail = ?', [email], function (error, results, fields) {
      if (error) res.send(error);
      res.send(results)
      // results.forEach(result => {
      //     res.send(result);
      // })
  })
}

const logout = (req, res) => {
  if (req.session.loggedin) {
    req.session.destroy();
  }
  res.send('enviando al home');
}


module.exports = {
  index,
  register,
  auth,
  logout,
}