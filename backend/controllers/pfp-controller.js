const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper');
const fs = require('fs')

const uploadProfilePicture = async (req, res) => {
    try {
        // Check if file exists
        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: "File required"
            });
        }

        const user = await User.findOne({ username: req.userInfo.username });
        if(!user) return res.sendStatus(401);

        // upload to cloudinary
        const {url, publicId} = await uploadToCloudinary(req.file.path);

        user.profilePicture.url = url;
        user.profilePicture.publicId = publicId;

        await user.save();
        
        // prevent local storage
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: "Uploaded profile picture",
        })

    } catch(e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

module.exports = uploadProfilePicture;
