const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authJWT');
const uploadMiddleware = require('../middleware/upload-middleware');
const uploadProfilePicture = require('../controllers/pfp-controller');

// upload image
router.post(
    '/upload',
    authenticateJWT,
    uploadMiddleware.single('image'), 
    uploadProfilePicture
)

// get image

module.exports = router;
