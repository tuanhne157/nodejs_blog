const express = require('express');
const router = express.Router();

// nạp dữ liệu funtion từ NewsController.js
const newsController = require('../app/controllers/NewsController');

// Get /news/...
// router.use('/:slug', newsController.show);

// Get /news      newsController.index
router.get('/', newsController.index);
module.exports = router;
