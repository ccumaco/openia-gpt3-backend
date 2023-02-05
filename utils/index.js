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
  };