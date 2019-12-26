const Utils = require('../../Utils');
const logger = Utils.logger;
const Models = require('../../Models');
const bookings = require('../../Services').bookings;

const moment = require('moment');
const async = require('async');

module.exports = {


    authenticate: function(request, callback) {

        var token = request.token;
        ////console.log(context);

        Utils.universalfunctions.validate_socket(token, function(err, res) {
            if (err) {
                callback(err)
            } else { //updating the socket id of the user

                var queryData = {
                        _id: res.data._id
                    },
                    updateData = {
                        socket_id: request.socket_id
                    },
                    options = {
                        new: true,
                        upsert: false
                    }

                Models.users.findOneAndUpdate(queryData, updateData, options).exec(function(err, res) {
                    if (err) {
                        logger.errorLogger("Error while updating Socket id of the user  ", err)
                        callback(err)
                    } else {
                        logger.successLogger("Successfully updated Socket id of the user", res)
                        callback(null, res)
                    }
                });

            }
        });
    },
    // Function to remove the socket id info from the user DB.
    disconnect: function(params, callback) {
        var queryData = {
                _id: params._id
            },
            updateData = {
                socket_id: ""
            },
            options = {
                new: true,
                upsert: false
            }

        Models.users.findOneAndUpdate(queryData, updateData, options).exec(function(err, res) {
            if (err) {
                logger.errorLogger("Error while updating Socket id of the user  ", err)
                callback(err)
            } else {
                logger.successLogger("Successfully updated Socket id of the user", res)
                callback(null, res)
            }
        });
    },

    //request booking service
    createbooking: function (request,callback) {
        bookings.createbooking(request,function (err,res) {
            if (err) {
                callback(err)
            }else {
                callback(null,res)
            }
        })
    },

    //respond to a booking request
    bookingRequest: function (request,callback) {
        bookings.bookingRequest(request,function (err,res) {
            if (err) {
                callback(err)
            }else {
                callback(null,res)
            }
        })
    },

    activeUser: function(user) {
        var user = JSON.parse(user),

            queryData = {
                _id: user._id
            },
            updateData = {
                is_active: true,
                last_active: Date.parse((new Date()).toISOString()) / 1000
            },
            options = {
                new: true,
                upsert: false
            }

        Models.users.findOneAndUpdate(queryData, updateData, options).exec(function(err, res) {
            if (err) {
                logger.errorLogger("Error while updating is active user data  ", err)
            } else {
                logger.successLogger("Successfully updated is active user data", res)
            }
        });
    },

    handelRejectedBookings : function (bookings,io) {
        async.each(bookings,function (booking,cb) {

            var active_user_Socket_ID = booking.vehicle_ID.user_ID.socket_id;

            if (active_user_Socket_ID && active_user_Socket_ID.length > 0) {

                var response = Utils.responses.parkingRequestRejected;
                response.result = {
                    _id: booking._id,
                    status: booking.status
                };

                io.to(active_user_Socket_ID).emit('bookingRejected',response);
            }

            cb(null,true)

        },function (err,res) {
            if (err) {
                logger.errorLogger("Error while emitting the Rejected Bookings events", err)
            } else {
                logger.successLogger("Successfully emitted the Rejected Bookings events", res)
            }
        })
    },

    newMessage: function(newMessage) {

        //console.log('Got message', newMessage);
    },

    goodbye: function() {

        this.emit('Take it easy, pal');
    }

}
