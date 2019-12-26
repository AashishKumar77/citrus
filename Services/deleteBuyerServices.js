'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name_1 = Models.MY_LISTING;
var table_name_2 = Models.SEARCHDATA;
var table_name_3 = Models.MARK_FAVORITE;
var table_name_4 = Models.users;
// var deleteUsefulLinks = function (idToDelete, callback) {
//     table_name.findByIdAndRemove(idToDelete, (err, todo) => {
//         if(err) {
//             if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
//             return callback(err);
//         }
//         //console.log(todo);
//         return callback(null,todo);
//     });
// };
//Delete Listings
var deleteListing = function (criteria, callback) {
    //console.log("Delete Listing Service Criteria",criteria);
    table_name_1.remove(criteria, function(err,data) {
        if (err) return callback(err);
        // //console.log("Service",);
        return callback(null,data.result);
    });
}

//Delete Search Datas
var deleteSearchDatas = function (criteria, callback) {
    //console.log("Delete Search Datas Service Criteria",criteria);
    table_name_2.remove(criteria, function(err,data) {
        if (err) return callback(err);
        // //console.log("Service",);
        return callback(null,data.result);
    });
}

//Delete Favourites
var deleteFavourites = function (criteria, callback) {
    //console.log("Delete Favourites Service Criteria",criteria);
    table_name_3.remove(criteria, function(err,data) {
        if (err) return callback(err);
        // //console.log("Service",);
        return callback(null,data.result);
    });
}

//delete User

//Delete Favourites
var deleteUser = function (criteria, callback) {
    //console.log("Delete User Service Criteria",criteria);
    table_name_4.remove(criteria, function(err,data) {
        if (err) return callback(err);
        // //console.log("Service",);
        return callback(null,data.result);
    });
}

module.exports = {
    deleteListing       : deleteListing,
    deleteSearchDatas   : deleteSearchDatas,
    deleteFavourites    : deleteFavourites,
    deleteUser          : deleteUser
};
