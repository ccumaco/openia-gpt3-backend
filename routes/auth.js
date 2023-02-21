const express = require('express');
const { login, register, logout } = require('../controllers/authController');
const { validateToken } = require('../middlewares/auth');

const router = express.Router();


router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/verify-token', validateToken);

module.exports = router;