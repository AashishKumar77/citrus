const handlers = require('./socketHandler');
const socketIO = require('socket.io');
const Joi      = require('joi');
const eventEmitter = require('../../Utils').eventEmitter;
const responses = require('../../Utils').responses;
const spaceController = require('../../Controllers').spaces;
exports.register = function (server, options, next) {

    //Opening the socket connection

    var io = socketIO(server.select('ws').listener),
    users={};

    io.on('connection', function(socket) {

        // //console.log(socket);

        socket.auth = false;
        socket.emit('connected')

        socket.on('authenticate',function (query,callback) {     //on authenticate event registering user's socket id in user DB and currently running instance
            var request = {
                token : query['x-logintoken'],
                socket_id : socket.id
            };


            handlers.authenticate(request,function (err,res) {
                if (err) {
                    callback(err || responses.userNotAuthenticated)
                }else {
                    users[socket.id] = JSON.stringify(res);
                    socket.auth = true;
                    //callback(null,responses.userAuthenticated);
                    spaceController.getCountOfTodayBooking({},res,(err, res) => callback(err,res));
                }
            });

        });

        socket.on('iAmActive',function (callback) {             //on I am Active event update user's is_active field and last_active field in user DB
            if (users[socket.id]) {
                handlers.activeUser(users[socket.id])
                if (callback && typeof(callback) == "function")
                    callback(((() => {return new Date()})()));      //sending server time in response callback
            }else {
                socket.disconnect('unauthorized');
            }
        });


        socket.on('requestBooking',function (query,callback) {
            if (users[socket.id]) {

                Joi.validate(query,
                    Joi.object().keys({
                        parking_ID : Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).required().label('Parking Object Id'),
                        vehicle_ID: Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).required().label('Vehicle Object Id'),
                        startTime : Joi.number().greater(Math.ceil(((new Date()).getTime())/1000)).required().label('Request Start Time'),
                        endTime:Joi.number().greater(Joi.ref('startTime')).required().label('Request End Time')
                    }),
                    function (err, value) {
                        if (err) {
                            var response = responses.parkingRequestError
                            response.message = (err.details[0]) ? err.details[0].message : "Error while booking"
                            callback(response);
                            //socket.emit('bookingError',{message:err.details[0].message||"Error while booking"})
                        }else {

                            var request = {
                                user_data: JSON.parse(users[socket.id]),
                                parking_ID: query.parking_ID,
                                vehicle_ID: query.vehicle_ID,
                                startTime: query.startTime,
                                endTime: query.endTime
                            }

                            handlers.createbooking(request,function (err,res) {
                                if (err) {
                                    callback(err);
                                }else {

                                    //console.log('Booking request Successfully********',res);

                                    if (res.result.status == 0) {

                                        var spaceOwner = res.parking_data.User_ID;
                                        //console.log('This is spaceowner****',spaceOwner.socket_id);
                                        if (spaceOwner.socket_id && spaceOwner.socket_id.length > 0 && users[spaceOwner.socket_id] ) {
                                            delete res.parking_data;
                                            io.to(spaceOwner.socket_id).emit('newBookingRequest', res);
                                        }

                                        delete res.parking_data;

                                        callback(null,res);

                                        //socket.emit('bookingRequested',responseobj);
                                        //socket.emit('bookingAccepted',responseobj)
                                    }else {
                                        delete res.parking_data;
                                        callback(null,res);
                                    }

                                }
                            });
                        }
                    }
                );

            }else {
                socket.disconnect('unauthorized');
            }
        })

        socket.on('respondToRequest',function (query,callback) {
            if (users[socket.id]) {
                Joi.validate(query,
                    Joi.object().keys({
                        booking_id : Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).required().label('Booking Object Id'),
                        accept     : Joi.boolean().required().label('Booking Accept Status')
                    }),
                    function (err, value) {
                        if (err) {
                            var response = responses.parkingRequestError
                            response.message = (err.details[0]) ? err.details[0].message : "Error while booking"
                            callback(response);
                        }else {

                            var request = {
                                user_data: JSON.parse(users[socket.id]),
                                booking_id: query.booking_id,
                                accept: query.accept
                            }

                            handlers.bookingRequest(request,function (err,res) {
                                if (err) {
                                    callback(err);
                                }else {

                                    var socket = res.result.vehicle_ID.user_ID.socket_id;

                                    if (socket && socket.length > 0) {

                                        if (res.statusCode==202) {
                                            io.to(socket).emit('bookingRejected', res);
                                        }else {
                                            io.to(socket).emit('bookingAccepted', res);
                                        }

                                    }

                                    callback(null,res)
                                }
                            });
                        }
                    }
                );

            }else {
                socket.disconnect('unauthorized');
            }
        });



        socket.on('disconnect', function() {            //on Disconnect event delete the current user socket id in user database and delete the user's key/Value pair from the users object
            if (users[socket.id]) {
                handlers.disconnect(JSON.parse(users[socket.id]),function (err,res) {
                    if (!err && res) {
                        delete users[socket.id];
                        socket.disconnect('diconnected');
                    }
                });
            }else {
                socket.disconnect('unauthorized');
            }
        });

        socket.on('newMessage', handlers.newMessage);
        socket.on('goodbye', handlers.goodbye);
        socket.on('getCountOfTodayBooking',function (query,callback) {
            if (users[socket.id]) {
                var userData = JSON.parse(users[socket.id]);
                spaceController.getCountOfTodayBooking({},userData,(err, res) => callback(err || res));
            }else {
                socket.disconnect('unauthorized');
            }
        });

        setTimeout(function(){
            if (!socket.auth) {         //checking if the user connected and authenticated otherwise delete user instance from the user DB
                if (users[socket.id]) {
                    handlers.disconnect(JSON.parse(users[socket.id]),function (err,res) {
                        if (!err && res) {
                            delete users[socket.id];
                            socket.disconnect('diconnected');
                        }
                    });
                }else {
                    socket.disconnect('unauthorized');
                }
            }
        }, 2000);

    });

    eventEmitter.on('rejected_booking',function (booking) {

        var active_user_Socket_ID = booking.parking_data.User_ID.socket_id;
        if (active_user_Socket_ID && active_user_Socket_ID.length > 0 && users[active_user_Socket_ID]) {

            var responseobj = {
                _id: booking._id,
                status: booking.status
            };

            io.to(active_user_Socket_ID).emit('bookingTimedOut', responseobj);
        }
    })

    eventEmitter.on('payment_timed_out',function (booking) {

        var active_user_Socket_ID = booking.vehicle_ID.user_ID.socket_id;
        if (active_user_Socket_ID && active_user_Socket_ID.length > 0 && users[active_user_Socket_ID]) {

            var responseobj = {
                _id: booking._id,
                status: booking.status
            };

            io.to(active_user_Socket_ID).emit('paymentTimedOut', responseobj);
        }
    })

    eventEmitter.on('auto_rejected_bookings',function (bookings) {
        handlers.handelRejectedBookings(bookings,io);
    })

    eventEmitter.on('notify_extend_booking',function (res) {
        var spaceOwner = res.parking_data.parkingId.User_ID;
        //console.log('This is spaceowner****',spaceOwner.socket_id);
        if (spaceOwner.socket_id && spaceOwner.socket_id.length > 0 && users[spaceOwner.socket_id] ) {
            delete res.parking_data;
            io.to(spaceOwner.socket_id).emit('newBookingRequest', res);
        }
    })


    next();
}

exports.register.attributes = {
    name: 'pwayz-socket-connection'
};
