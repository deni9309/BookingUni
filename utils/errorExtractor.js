function extractError(error) {
    if (error.name == 'ValidationError')
        return Object.values(error.errors).map(v => v.message);
    else {
        return error.message.split('\n');
    }
}

module.exports = {
    extractError,
};