const express = require('express');
const cors = require('cors')
const { generateImage, generateText } = require('../controllers/openaiController');
const router = express.Router();
var corsOptions = {
  origin: ['https://leafy-malasada-939f12.netlify.app/', 'http://localhost:5173'],
  optionsSuccessStatus: 200 // For legacy browser support
}
router.use(cors(corsOptions))


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
