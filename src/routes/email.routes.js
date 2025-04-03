const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/messages', emailController.saveMessage);

module.exports = router;