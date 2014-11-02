/**
 * A model for our user
 */
'use strict';
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Q = require('q');

var userModel = function () {

    var userSchema = mongoose.Schema({
        email: {type: String, unique: true, required: true},
        displayname: String,
        firstname: String,
        lastname: String,
        password: String, //We'll store bCrypt hashed passwords.  Just say no to plaintext!
        role: String
    });


    /**
     * Helper function that takes a plaintext password and compares it against the user's hashed password.
     * @param plainText
     * @returns true/false
     */
    userSchema.methods.passwordMatches = function (plainText) {
        var user = this;
        return bcrypt.compareSync(plainText, user.password);
    };


    return mongoose.model('User', userSchema);
};

var model = new userModel();
module.exports.model = model;

module.exports.findByEmail = function (email) {
    var deferred = Q.defer();
    model.findOne({
        email: email
    }, function (err, user) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(user);
        }
    });
    return deferred.promise;
};

module.exports.upsert = function (user, isNewPassword) {
    var deferred = Q.defer();
    if (isNewPassword && user.password) {
        user.password = bcrypt.hashSync(user.password, 8);
    }

    if (user.email === 'absainte@yahoo.fr' || user.email === 'yannick.grenzinger@gmail.com') {
        user.role = 'admin';
    } else {
        user.role = 'client';
    }

    model.findOneAndUpdate({email: user.email}, user, {upsert: true}, function (err, userFromDB) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(userFromDB);
        }
    });
    return deferred.promise;
};
