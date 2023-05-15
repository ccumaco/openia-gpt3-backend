const express = require('express');
const { login, register, logout, verifyToken, recoveryPassword, verifyTokenEmail, newPassword } = require('../controllers/authController');
const { limiter } = require('../middlewares/rateLimit');

const router = express.Router();


router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/verify-token', verifyToken);
router.post('/recovery-password', recoveryPassword);
router.post('/validate-email-token', verifyTokenEmail);
router.post('/new-password', newPassword);

module.exports = router;