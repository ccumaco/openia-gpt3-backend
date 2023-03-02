const rateLimit = require("express-rate-limit");

const limiter = (limit) => rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: limit, // limit each IP to 100 requests per windowMs
  message: {
    status: false,
    message: "Has excesido el numero maximo de intentos, intenta mas tarde"
  }
});

module.exports = {limiter};