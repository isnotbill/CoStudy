const User = require('../models/User');
const bcrypt = require('bcrypt');

const registerNewUser = async (req,res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are both required.'});

    // Check for duplicate usernames
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409) // 409: Conflict

    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // create and store the new user
        const newUser = await User.create({
            "username": user,
            "password": hashedPwd
        });

        console.log(newUser);

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { registerNewUser };