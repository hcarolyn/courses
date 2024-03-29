module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', "Sign in please!");
        return res.redirect('/login');
    }
    next();
}
