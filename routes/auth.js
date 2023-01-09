const express = require('express');
const bcrypt = require('bcrypt');
const {db} = require('../dbServer')
const { login, register, logout } = require('../controllers/authController');

const router = express.Router();


router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

module.exports = router;