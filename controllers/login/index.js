'use strict';


var passport = require('passport'),
    UserModel = require('../../models/userModel');


var addingUser = function() {

    var u1 = new UserModel({
        firstname: 'Kraken',
        lastname: 'McSquid',
        email: 'kraken@paypal.com',
        password: 'kraken',
        role: 'admin'
    });

    var u2 = new UserModel({
        firstname: 'Ash',
        lastname: 'Williams',
        email: 'ash.williams@paypal.com',
        password: 'ash',
        role: 'user'
    });

    //Ignore errors. In this case, the errors will be for duplicate keys as we run this app more than once.
    u1.save();
    u2.save();

};


module.exports = function (router) {


    /**
     * Display the login page. We also want to display any error messages that result from a failed login attempt.
     */
    router.get('/', function (req, res) {
        addingUser();

        //Include any error messages that come from the login process.
        var model = {
            messages: req.flash('error')
        };
        res.render('login', model);
    });

    /**
     * Receive the login credentials and authenticate.
     * Successful authentications will go to /profile or if the user was trying to access a secured resource, the URL
     * that was originally requested.
     *
     * Failed authentications will go back to the login page with a helpful error message to be displayed.
     */
    router.post('/', function (req, res) {

        passport.authenticate('local', {
            successRedirect: req.session.goingTo || '/profile',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res);

    });

};
