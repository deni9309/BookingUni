const router = require('express').Router();

const hotelService = require('../services/hotelService');
const { isAuth } = require('../middlewares/isAuth');
const { extractError } = require('../utils/errorExtractor');

router.get('/create', isAuth, (req, res) => {
    res.render('create', { title: 'Create Hotel' });
});

router.post('/create', isAuth, async (req, res) => {
    try {
        if (Object.entries(req.body).some(([k, v]) => v == '')) {
            throw new Error('All fields are required!');
        }

        await hotelService.create(req.user._id, req.body);
        // if (result == -1) {
        //     console.log('Something went wrong while trying to save data!');
        //     return res.redirect('/404');
        // }

        // res.redirect('/');
        res.redirect('/');
    } catch (error) {
        res.render('create', {
            title: 'Create Hotel',
            errors: extractError(error),
            ...req.body
        });
    }
});

router.get('/:id/edit', isAuth, async (req, res) => {
    try {
        const hotel = await hotelService.getById(req.params.id);

        const isOwner = await hotelService.isOwner(req.user._id, req.params.id);
        if (!isOwner) {
            console.log('Warning! Only the hotel owner is authorized to update hotel\'s data!');
            return res.redirect('/unauthorized');
        }

        res.render('edit', {
            title: 'Edit Hotel',
            ...hotel,
        });
    } catch (error) {
        console.log(error.message);
        res.redirect('/404');
    }
});

router.post('/:id/edit', isAuth, async (req, res) => {
    try {
        if (Object.entries(req.body).some(([k, v]) => v == '')) {
            throw new Error('All fields are required!');
        }

        if (await hotelService.isOwner(req.user._id, req.params.id) == false) {
            console.log('Warning! Only the hotel owner is authorized to update hotel\'s data!');
            return res.redirect('/unauthorized');
        }

        const result = await hotelService.edit(req.params.id, req.body);
        if (result == undefined) {
            console.log('Hotel could not be found!');
            return res.redirect('/404');
        }

        res.redirect(`/hotel/${req.params.id}/details`);
    } catch (error) {
        req.body._id = req.params.id;
        const errors = extractError(error);

        res.render('edit', {
            title: 'Edit Hotel',
            errors,
            ...req.body,
        });
    }
});

router.get('/:id/delete', isAuth, async (req, res) => {
    try {
        const isOwner = await hotelService.isOwner(req.user._id, req.params.id)
        if (!isOwner) {
            console.log('Warning! Only the hotel owner is authorized to delete hotel\'s data!');
            return res.redirect('/unauthorized');
        }

        await hotelService.deleteById(req.params.id);

        res.redirect('/');
    } catch (error) {
        console.log(error.message);
        res.redirect('/404');
    }
});

router.get('/:id/book', isAuth, async (req, res) => {
    try {
        const isOwner = await hotelService.isOwner(req.user._id, req.params.id)
        if (isOwner) {
            console.log('You cannot book your own hotels!');
            return res.redirect('/unauthorized');
        }

        await hotelService.book(req.params.id, req.user._id);

        res.redirect(`/hotel/${req.params.id}/details`);
    } catch (error) {
        console.log(error.message);
        res.redirect('/404');
    }
});

router.get('/:id/details', async (req, res) => {
    let isOwner = false;
    let hasBooked = false;
    try {
        const hotel = await hotelService.getById(req.params.id);
        if (req.user) {
            isOwner = await hotelService.isOwner(req.user._id, req.params.id);

            if (hotel.bookings.filter(i => i == req.user._id).length > 0) {
                hasBooked = true;
            }
        }

        res.render('details', {
            title: 'Hotel Details',
            isOwner,
            hotel,
            hasBooked,
        });
    } catch (error) {
        console.log(error.message);
        res.redirect('/404');
    }
});

module.exports = router;