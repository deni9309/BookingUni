const { Schema, Types, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required!'],
        // match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Email is not valid!'],
        unique: true,
    },
    username: {
        type: String,
        minLength: [3, 'Username must be at least 3 characters long!'],
        match: [/^[a-z0-9]+$/i, 'Username must contain only lowercase english letters and numbers!'],
        unique: true
    },
    password: {
        type: String,
        minLength: [5, 'Password must be at least 5 characters long!'],
    }
});

userSchema.index({ username: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

userSchema.index({ email: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;