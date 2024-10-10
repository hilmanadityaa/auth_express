const express = require('express');
const router = express.Router();
const User = require('../models/user');

// middleware auth ketika belum login, tidak bisa mengakses halaman yang membutuhkan info login
const auth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    return next();
};

// middleware auth ketika sudah login, tidak bisa mengakses halaman yang tidak membutuhkan login
const authenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    return res.redirect('/admin');
};

router.get('/', authenticated, (req, res) => {
    res.render('auth/homepage');
});

router.get('/register', authenticated, (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        req.session.user_id = user._id;
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Something went wrong');
    }
});

router.get('/login', authenticated, (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByCredentials(username, password);

        if (user) {
            req.session.user_id = user._id;
            return res.render('auth/admin');
        } else {
            return res.render('auth/login');
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Terjadi kesalahan');
    }
});


router.post('/logout', auth, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

router.get('/admin', auth, (req, res) => {
    res.render('auth/admin');
});


router.get('/profile/setting', auth, (req, res) => {

    const user = req.session.user;
    res.send(`profile setting ${user.username}`);
});



module.exports = router;