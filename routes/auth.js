const express = require('express');
const { login, register, logout, verifyToken, recoveryPassword, verifyTokenEmail, newPassword } = require('../controllers/authController');
const { limiter } = require('../middlewares/rateLimit');

const router = express.Router();


router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/verify-token', verifyToken);
router.post('/recovery-password', limiter(2), recoveryPassword);
router.post('/validate-email-token', limiter(5), verifyTokenEmail);
router.post('/new-password', limiter(5), newPassword);

module.exports = router;