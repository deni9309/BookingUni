const router = require('express').Router();

const { isAuth } = require('../middlewares/isAuth');
const hotelService = require('../services/hotelService');

router.get('/', async (req, res) => {
    try {
        const hotels = await hotelService.getAll();

        res.render('home', {
            title: 'BookingUni Home',
            hotels,
        });
    } catch (error) {
        console.log(error.message);
        res.redirect('/404');
    }
});

router.get('/profile', isAuth, async (req, res) => {
    try {
        const userData = {
            userId: req.user._id,
            username: req.user.username,
            email: req.user.email,
        };

        const userBookings = await hotelService.getBookedHotelsForUser(userData.userId);

        res.render('user/profile', {
            title: 'Profile',
            ...userData,
            userBookings
        })
    } catch (error) {
        console.log(error.message);
        res.redirect('/404');
    }
});

router.get('/unauthorized', (req, res) => {
    return res.render('403');
});

module.exports = router;