const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authJWT');
const uploadMiddleware = require('../middleware/upload-middleware');
const uploadImage = require('../controllers/image-controller');

// upload image
router.post(
    '/upload',
    authenticateJWT,
    uploadMiddleware.single('image'), 
    uploadImage
)

// get image

module.exports = router;
