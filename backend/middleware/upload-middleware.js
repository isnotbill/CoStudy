const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "backend/uploads/")
    },
    filename: function(req, file, cb) {
        cb(
            null, 
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image'));
    }
}

// middleware
module.exports = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 *1024 *1024 // 5mb
    }
})
