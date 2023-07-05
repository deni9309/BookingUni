const { Schema, Types, model } = require('mongoose');
const { IMG_URL_PATTERN } = require('../config/constants');

const hotelSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Hotel name is required!'],
        minlength: [4, 'Hotel name must be at least 4 characters long!'],
        unique: true
    },
    city: {
        type: String,
        required: [true, 'City is required!'],
        minlength: [3, 'City must be at least 3 characters long!'],
    },
    imgUrl: {
        type: String,
        required: [true, 'Image URL is required!'],
        validate: {
            validator: (value) => IMG_URL_PATTERN.test(value),
            message: 'Image URL is not valid!'
        },
        // match: [/^https?:\/\/.+$/i, 'Image URL is not valid!']
    },
    rooms: {
        type: Number,
        required: [true, 'Rooms count is required!'],
        min: [1, 'Rooms count must be a number between 1 and 100!'],
        max: [100, 'Rooms count must be a number between 1 and 100!'],
    },
    bookings: [{
        type: Types.ObjectId,
        ref: 'User',
        default: [],
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
});

hotelSchema.index({ name: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Hotel = model('Hotel', hotelSchema);

module.exports = Hotel;
