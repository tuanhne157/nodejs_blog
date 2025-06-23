const express = require('express');
const router = express.Router();

// nạp dữ liệu funtion từ SiteController.js
const siteController = require('../app/controllers/SiteController');

// GET /site/... , rỏ vào SiteController.index
router.get('/search', siteController.search);

// GET home, trỏ vào SiteController.index
router.get('/home', siteController.index);

router.get('/', siteController.index);
module.exports = router;
