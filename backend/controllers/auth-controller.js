const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' });

    const found = await User.findOne({ username: user}).exec();
    if (!found) return res.sendStatus(401);

    const correctPwd = bcrypt.compare(pwd, found.password);
    if (correctPwd) {
        // Create JWTs
        const accessToken = jwt.sign(
            {
                userId: found._id, // MongoDB: ObjectId
                username: found.username,
                role: found.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '3m' }
        );
        const refreshToken = jwt.sign(
            { 
                userId: found._id,
                username: found.username,
                role: found.role
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        
        // Store refresh token
        found.refreshToken = refreshToken;
        const result = await found.save();
        console.log(result);

        // Create secure cookie with refresh token
        res.cookie('refreshToken', refreshToken, { 
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            }
        );

        // Send access token to user
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { loginUser }
