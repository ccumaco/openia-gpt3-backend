const bcrypt = require('bcrypt');

const hashedPassword = async (userPassword) => {
  const saltRounds = 10;
  const password = await bcrypt.hash(userPassword, saltRounds);
  return password;
}

  
  module.exports = {
    hashedPassword
  };