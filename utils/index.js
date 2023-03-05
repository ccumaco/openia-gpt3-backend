const { db } = require("../dbServer");
const bcrypt = require('bcrypt');

const hashedPassword = async (userPassword) => {
  const saltRounds = 10;
  const password = await bcrypt.hash(userPassword, saltRounds);
  return password;
}

const getUserInfoFromDB = (userEmail) => {
  const query = 'SELECT * FROM users WHERE userEmail = ?'
  return new Promise((resolve, reject) => {
    db.query(query, [userEmail], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results[0]);
    });
  });
}
  
  module.exports = {
    getUserInfoFromDB,
    hashedPassword
  };