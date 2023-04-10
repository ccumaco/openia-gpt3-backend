const express = require('express');
const { verifyToken } = require('../controllers/authController');
const {
    generateImage,
    generateText,
    generateTextFree,
    generateArticle,
    generateLikeEmail,
    generateResumes,
    generateTextByAudio
} = require('../controllers/openaiController');
const router = express.Router();



router.post('/generate-image', generateImage);
router.post('/generate-text-social', generateText);
router.post('/generate-text-free', generateTextFree);
router.post('/generate-article', generateArticle);
router.post('/generate-email', generateLikeEmail);
router.post('/generate-resumes', generateResumes);
router.post('/audio-to-text', generateTextByAudio);

module.exports = router;
