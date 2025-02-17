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
                "UserInfo": {
                    "username": found.username
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        );
        const refreshToken = jwt.sign(
            { "username": found.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        
        // Store refresh token
        found.refreshToken = refreshToken;
        const result = await found.save();
        console.log(result);

        // Create secure cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});

        // Send access token to user
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { loginUser }