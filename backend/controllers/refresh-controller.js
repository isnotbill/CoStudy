const User = require('../models/User');
const jwt = require('jsonwebtoken');

const refreshUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies) return res.sendStatus(204);

    const refreshToken = cookies.refreshToken;
    const found = await User.findOne({ refreshToken }).exec();
    if (!found) return res.sendStatus(403); // Forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || found.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { 
                    "UserInfo": {
                        "username": found.username,
                        "role": found.role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken });
        }
    )
}

module.exports = { refreshUser }
