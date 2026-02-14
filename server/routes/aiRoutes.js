const express = require('express');
const { getResponses, streamResponses, summarizeResponses } = require('../controllers/aiController');
const router = express.Router();

router.post('/prompt', getResponses);
console.log('Registering /stream route');
router.post('/stream', streamResponses);
router.post('/summarize', summarizeResponses);
router.post('/chat', require('../controllers/aiController').chat);

module.exports = router;
