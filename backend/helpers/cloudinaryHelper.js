const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async(filepath) => {
    try {
        const result = await cloudinary.uploader.upload(filepath);

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch(e) {
        console.error(e);
        throw new Error('Error uploading to cloudinary')
    }
}

module.exports = {
    uploadToCloudinary
}
