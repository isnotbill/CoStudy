const User = require('../models/User');
const jwt = require('jsonwebtoken');

const logoutUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies) return res.sendStatus(204);
    
    const refreshToken = cookies.refreshToken;
    const found = await User.findOne({ refreshToken: refreshToken }).exec();
    
    if (!found) {
        res.clearCookie('refreshToken', { httpOnly: true });
        return res.sendStatus(204);
    }

    found.refreshToken = '';
    const result = await found.save();
    console.log(result);

    res.clearCookie('refreshToken', { httpOnly: true });
    res.sendStatus(204);
}

module.exports = { logoutUser };
