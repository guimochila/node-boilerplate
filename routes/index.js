const express = require('express');

const router = express.Router();

// Loading custom controllers
const indexController = require('../controllers/indexController');

/** @route GET /
 * @desc Get main page
 * @access Public
 * */
router.get('/', indexController.index);

module.exports = router;
