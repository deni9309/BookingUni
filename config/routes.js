const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const hotelController = require('../controllers/hotelController');
const profileController = require('../controllers/profileController');

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/hotel', hotelController);
    app.use('/profile', profileController);

    // app.get('/error', (req, res, next) => {     
    //     /* throw new Error('propagating error'); // can use one of these */
    //     next(new Error('propagating error'))
    // });

    // /* global error handler -> works only for synchronous errors */
    // app.use((err, req, res, next) => {
    //     console.log('Global error!');
    //     console.log(err.message);
    //     res.redirect('/404')
    // });

    app.use('*', (req, res) => {
        res.render('404');
    });
};