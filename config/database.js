const mongoose = require('mongoose');

//TODO rename db
const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/booking-uni-sep22';

module.exports = async (app) => {
    try {
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Database connected!');

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};