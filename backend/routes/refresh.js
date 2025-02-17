const express = require('express');
const router = express.Router();
const refreshController = require('../controllers/refreshController');

router.use('/', refreshController.refreshUser);

module.exports = router;