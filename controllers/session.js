const sessions = require('express-session');

const oneHour = 1000 * 60 * 60;

const sessionMiddleware = sessions({
    name: 'myCookie',
    secret: 'th1s1sn0t@s3cr3t',
    saveUninitialized: false,
    cookie: { maxAge: oneHour, httpOnly: true },
    resave: false,
});

function isLoggedIn(req, res, next) {
    // if (req.session && req.session.user) {
    //     next();
    // } else {
    //     res.redirect('/');
    // }
    next();
}

module.exports = {
    sessionMiddleware,
    isLoggedIn
}