const express = require('express');
const { verifyToken } = require('../controllers/authController');
const multer = require('multer');
const upload = multer();
const {
    generateImage,
    generateText,
    generateTextFree,
    generateArticle,
    generateLikeEmail,
    generateResumes,
    transcriptAudio
} = require('../controllers/openaiController');
const router = express.Router();
const miMiddleware = (req, res, next) => {
    console.log('Middleware ejecutado');
    next();
  };


router.post('/generate-image', generateImage);
router.post('/generate-text-social', generateText);
router.post('/generate-text-free', miMiddleware ,generateTextFree);
router.post('/generate-article', generateArticle);
router.post('/generate-email', generateLikeEmail);
router.post('/generate-resumes', generateResumes);
router.post('/transcript-audio', upload.single('file'), transcriptAudio)
module.exports = router;
