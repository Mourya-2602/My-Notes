// const { centreSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
// const Centre = require('./models/centre');
// const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
