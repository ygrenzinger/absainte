/**
 * A model for our user
 */
'use strict';
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Q = require('q'),
    uuid = require('node-uuid'),
    _ = require('lodash');

var userModel = function () {

    var itemSchema = new mongoose.Schema({
        name: String,
        quantity: Number,
        price: Number
    });

    var orderSchema = new mongoose.Schema({
        uuid: String,
        total: Number,
        address: {
            line1: String,
            line2: String,
            city: String,
            country_code: String,
            postal_code: String,
            state: String
        },
        items: [itemSchema]
    });

    var userSchema = mongoose.Schema({
        email: {type: String, unique: true, required: true},
        fullname: String,
        firstname: String,
        lastname: String,
        password: String, //We'll store bCrypt hashed passwords.  Just say no to plaintext!
        role: String,
        orders: [orderSchema]
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

var findByEmail = function (email) {
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

var upsert = function (user, isNewPassword) {
    var deferred = Q.defer();
    if (isNewPassword && user.password) {
        user.password = bcrypt.hashSync(user.password, 8);
    }

    if (_.contains(process.env.ADMINS, user.email)) {
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

var insertNewOrder = function (user, paypalPayment) {
    var deferred = Q.defer();

    var order = {
        uuid: uuid.v4(),
        total: paypalPayment.transactions[0].amount.total,
        address: paypalPayment.payer.payer_info.shipping_address,
        items: []
    };

    _.forEach(paypalPayment.transactions[0].item_list.items, function (paypalItem) {
        var item = {
            name: paypalItem.name,
            quantity: paypalItem.quantity,
            price: paypalItem.price
        };
        order.items.push(item);
    });

    if (!user.orders) {
        user.orders = [];
    }

    user.orders.push(order);

    model.findOneAndUpdate({email: user.email}, user, {upsert: true}, function (err, userFromDB) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(userFromDB);
        }
    });
    return deferred.promise;
};

module.exports.findByEmail = findByEmail;
module.exports.upsert = upsert;
module.exports.insertNewOrder = insertNewOrder;

