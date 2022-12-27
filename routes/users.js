const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport') 
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync (async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome!');
            res.redirect('/courses');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/courses');
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');

})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/courses';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { 
            return next(err); }
    });
    req.flash('success', "Goodbye!");
    res.redirect('/courses');
})


module.exports = router;