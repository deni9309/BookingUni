// /* middleware for creating user's session if user credentials are valid */

const { verifyToken } = require("../services/userService");

module.exports = () => async (req, res, next) => {
    const token = req.cookies['token'];

    if (token) {
        try {
            const decodedToken = await verifyToken(token);

            req.user = decodedToken;

            res.locals.user = decodedToken;
            res.locals.isAuthenticated = true;
        } catch (err) {
            res.clearCookie('token');

            return res.redirect('/auth/login');
        }
    }

    next();
};