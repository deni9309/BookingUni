const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');

const session = require('../middlewares/session');
const { trimBody } = require('../middlewares/trimBody');
const { EXCLUDE_PASSWORD, EXCLUDE_REPEAT_PASSWORD } = require('../config/constants');

module.exports = (app) => {
    const hbs = handlebars.create({
        extname: 'hbs'
    });

    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');

    app.use('/static', express.static('static'));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(session());
    app.use(trimBody(EXCLUDE_PASSWORD, EXCLUDE_REPEAT_PASSWORD));
};