const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('users/register')
};

module.exports.register = async (req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = await User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Business Connect!');
            const redirectUrl = req.session.returnTo || '/' || '/listings';
            res.redirect(redirectUrl);
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    if(req.query.returnTo){
        req.session.returnTo = req.query.returnTo;
    }
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back')
    const redirectUrl = res.locals.returnTo || '/' || '/listings';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout(function() {
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
};