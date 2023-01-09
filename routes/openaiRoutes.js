const express = require('express');
const { generateImage, generateText } = require('../controllers/openaiController');
const router = express.Router();



router.post('/generateimage', generateImage);
router.post('/generateText', generateText);
router.get('/', async (req, res) => {
    try { 
      res.send("saludando!!!")
    } catch (error) {
      console.error(error.message);
    }
  });

module.exports = router;
