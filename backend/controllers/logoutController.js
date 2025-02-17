const User = require('../models/User');
const jwt = require('jsonwebtoken');

const logoutUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies) return res.sendStatus(204);
    
    const refreshToken = cookies.jwt;
    const found = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!found) {
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
        return res.sendStatus(204);
    }

    found.refreshToken = '';
    const result = await found.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
    res.sendStatus(204);
}

module.exports = { logoutUser };