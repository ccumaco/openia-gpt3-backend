const express = require('express');
const {index, auth, logout, register} = require('../controllers/loginController');

const router = express.Router();

router.get('/login', index);
router.get('/register', register);
router.post('/auth', auth);
router.get('/logout', logout);

module.exports = router;