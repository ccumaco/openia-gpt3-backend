const express = require('express');
const { verifyToken } = require('../controllers/authController');
const { generateImage, generateText, generateTextFree, generateArticle, generateEmail } = require('../controllers/openaiController');
const router = express.Router();



router.post('/generate-image', generateImage);
router.post('/generate-text-social', generateText);
router.post('/generate-text-free', generateTextFree);
router.post('/generate-article', generateArticle);
router.post('/generate-email', generateEmail);

module.exports = router;
