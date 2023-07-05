const bcrypt = require('bcrypt');

const User = require('../models/User');
const { JWT_SECRET } = require('../config/constants');
const jwt = require('../lib/jwt');

async function register(email, username, password) {
    const userExists = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
    if (userExists) {
        throw new Error('Username is already taken!');
    }

    const emailExists = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    if (emailExists) {
        throw new Error('This email is already registered!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        username,
        password: hashedPassword,
    });

    //TODO: modify if registration creates user's session (logs the user in automatically)
    const token = await createSession(user);
    return token;
}

async function login(username, password) {
    const user = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
    if (!user) {
        throw new Error('Incorrect username or password!');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid == false) {
        throw new Error('Incorrect username or password!');
    }

    const token = await createSession(user);
    return token;
}

async function createSession(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        username: user.username
    };

    const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' });
    return token;
}

async function verifyToken(token) {
    const result = await jwt.verify(token, JWT_SECRET);

    return result;
}

module.exports = {
    register,
    login,
    verifyToken,
};
