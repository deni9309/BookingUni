const router = require('express').Router();
const validator = require('validator');

const userService = require('../services/userService');
const { extractError } = require('../utils/errorExtractor');

router.get('/login', (req, res) => {
    res.render('user/login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const token = await userService.login(username, password);
        res.cookie('token', token);

        res.redirect('/');
    } catch (error) {
        const errors = extractError(error);

        res.render('user/login', {
            title: 'Login',
            errors,
            ...req.body
        });
    }
});

router.get('/register', (req, res) => {
    res.render('user/register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
    const { email, username, password, repeatPassword } = req.body;

    try {
        if (validator.isEmail(email) == false) {
            throw new Error('Email is not valid!');
        }
        if (password != repeatPassword) {
            throw new Error('Passwords don\'t match!');
        }
        if (Object.entries(req.body).some(([k, v]) => v == '')) {
            throw new Error('All fields are required!');
        }

        //TODO modify here if business logic requires redirection to login page (not automatic login)
        const token = await userService.register(email, username, password);
        res.cookie('token', token);

        res.redirect('/');
    } catch (error) {
        const errors = extractError(error);

        res.render('user/register', {
            title: 'Register',
            errors,
            ...req.body
        });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');

    res.redirect('/');
});

module.exports = router;