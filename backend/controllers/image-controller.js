const Image = require('../models/Image');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper');

const uploadImage = async (req, res) => {
    try {
        // Check if file exists
        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: "File required"
            });
        }

        // upload to cloudinary
        const {url, publicId} = await uploadToCloudinary(req.file.path);

        // store image
        const uploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });

        await uploadedImage.save();

        res.status(201).json({
            success: true,
            message: "Uploaded image",
            image: uploadedImage
        })

    } catch(e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

module.exports = uploadImage;
