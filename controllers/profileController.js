const router = require('express').Router();

router.get('/', async (req, res) => {
   
    res.render('user/profile', {
        title: 'Profile'
    });
});

module.exports = router;
