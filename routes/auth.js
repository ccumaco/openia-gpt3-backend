const express = require('express');
const { login, register, logout, verifyToken, recoveryPassword } = require('../controllers/authController');

const router = express.Router();


router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/verify-token', verifyToken);
router.post('/recovery-password', recoveryPassword);

module.exports = router;