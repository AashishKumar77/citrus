'use strict';
var UniversalFunctions = require('../Utils/');
var responses = require('../Utils/responses') //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.CONTACTFORM;
var table_name_new = Models.users;

//Get Users from DB

var getData = function (criteria, projection, options, callback) {
       //console.log(criteria,"criteriacriteria")
    table_name.find(criteria, projection, options, function (err, result) { ////console.log("criteria_err",err);
        if (err) {
            if (err.name == "CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null, result);
    });
};

//Insert User in DB
var InsertData = function (objToSave, callback) {
    //console.log(objToSave)
    new table_name(objToSave).save(function (err, result) {
        if (err) { ////console.log("==========createUser==============",err);
            return callback(err);
        }
        return callback(null, result);
    })
};
var InsertDataTousers = function (objToSave, callback) {
    //console.log(objToSave)
    new table_name_new(objToSave).save(function (err, result) {
        if (err) { ////console.log("==========createUser==============",err);
            return callback(err);
        }
        return callback(null, result);
    })
};
var InsertDatatoSeller = function (objToSave, callback) {
    //console.log(objToSave)
    new table_name(objToSave).save(function (err, result) {3
        //console.log(err,err)
        if (err) { ////console.log("==========createUser==============",err);
            return callback(err);
        }
        return callback(null, result);
    })
};
var InsertDatacrm = function (objToSave, callback) {
    //console.log(objToSave)
    new table_name(objToSave).save(function (err, result) {
        if (err) { ////console.log("==========createUser==============",err);
            return callback(err);
        }
        //console.log(result,"llllllllllllllllll")
        return callback(null, result);
    })
};

var updateData = function (criteria, dataToSet, options, callback) { 
    //console.log("here+++++++xxxx++++",criteria,dataToSet);
    table_name.update(criteria, dataToSet, options, function (err, result) {
        if (err) {
            //console.log("==========updateUser===========", err);
            if (err.name == "CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        //console.log(result,"/v1/admin/removeLeadFromCRM result")
        return callback(null, result);
    });
};
//.insert()
var InsertMultiple = function (objToSave, callback) {
    table_name.insertMany(objToSave, function (err, result) {
        if (err) { ////console.log("==========createUser==============",err);
            return callback(err);
        }
        return callback(null, result);
    })
};

//Delete Seller
var deleteData = function (criteria, callback) {
    table_name.remove(criteria, function (err, result) {
         //console.log("criteria_err",result);
        if (err) {
            // if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null, result);
    });
};

var getAllData = function (criteria, skip, limit,options, callback) {
    //console.log(options)
    table_name.find(criteria, function (err, result) { ////console.log("criteria_err",err);
        if (err) {
            if (err.name == "CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null, result);
    }).skip(skip).limit(limit).collation({locale: "en" }).sort(options.sort)
};

var getAllContactLeads = function (criteria, skip, limit, callback) {
    var populateModel = [
        {
            path: "assignedTo",
            match: {},
            select: 'firstName lastName _id email',
            model: 'user',
            options: { lean: true }
        }
    ];
    table_name.find(criteria).populate(populateModel).skip(skip).limit(limit).exec(function (err, result) { ////console.log("criteria_err",err);
        if (err) {
            if (err.name == "CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null, result);
    });
};


var assignContactsLead = function (newBuyer, callback) {
    //console.log(newBuyer);
    var criteria_1 = {
        "siteId": newBuyer.siteId,
        "userType": "Agent",
        "rotateInContactBox": true
    }
    var assignedTo;
    table_name_new.find(criteria_1).distinct('_id', function (err1, ids) {
        if (err1) {
            return callback(err);
        } else if (ids.length > 0) {
            var id_s = [];
            ids.forEach(function (element) {
                id_s.push(element.toString())
            });
            //Getting all the previously assigned Buyers
            //console.log("+++++++++++++++++++++++++++++++");
            //console.log("++++++++++++++++++++++++++++++++");
            var criteria_2 = {
                "siteId": newBuyer.siteId,
                "formType": "Contact Us"
            }
            table_name.find(criteria_2, function (err2, buyers) {
                if (err2) {
                    return callback(err);
                } else if (buyers.length > 0) {
                    //console.log("Buyers Length :: ", buyers.length);
                    var newLength = (buyers.length) - 2
                    // //console.log("BBBBBBBBBBBBBBBBB",buyers);
                    var lastAssigned = buyers[newLength].assignedTo;
                    // //console.log("IDS",id_s);
                    // //console.log("lastAssigned :",lastAssigned);
                    // //console.log(typeof lastAssigned);
                    // //console.log(typeof ids);
                    if (lastAssigned) {


                        // //console.log("Array Index",ids.indexOf(lastAssigned));

                        var arrayIndex = id_s.indexOf(lastAssigned.toString());
                        if (arrayIndex > -1) {
                            if (arrayIndex < (id_s.length) - 1) {
                                //console.log(3);
                                var val = arrayIndex + 1;
                                //console.log("val", val);
                                assignedTo = ids[val];
                                //Updating DB
                                var criteria_3 = {
                                    email: newBuyer.email
                                }
                                var dataToSet = {
                                    assignedTo: assignedTo
                                }
                                table_name.findOneAndUpdate(criteria_3, dataToSet, { new: true }, function (err, result) {
                                    if (err) {
                                        return callback(err);
                                    }
                                    return callback(null, result);
                                });
                            } else {
                                //console.log(2);
                                assignedTo = ids[0];
                                //Updating DB
                                var criteria_3 = {
                                    email: newBuyer.email
                                }
                                var dataToSet = {
                                    assignedTo: assignedTo
                                }
                                table_name.findOneAndUpdate(criteria_3, dataToSet, { new: true }, function (err, result) {
                                    if (err) {
                                        return callback(err);
                                    }
                                    return callback(null, result);
                                });
                            }
                        } else {
                            //console.log(1);
                            assignedTo = ids[0];
                            //Updating DB
                            var criteria_3 = {
                                email: newBuyer.email
                            }
                            var dataToSet = {
                                assignedTo: assignedTo
                            }
                            table_name.findOneAndUpdate(criteria_3, dataToSet, { new: true }, function (err, result) {
                                if (err) {
                                    return callback(err);
                                }
                                return callback(null, result);
                            });
                        }
                    } else {
                        //console.log(1);
                        assignedTo = ids[0];
                        //Updating DB
                        var criteria_3 = {
                            email: newBuyer.email
                        }
                        var dataToSet = {
                            assignedTo: assignedTo
                        }
                        table_name.findOneAndUpdate(criteria_3, dataToSet, { new: true }, function (err, result) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(null, result);
                        });
                    }
                } else {
                    return callback({
                        "statusCode": 200,
                        "status": "success",
                        "message": "No Buyers Found"
                    });
                }
            });
        } else {

            return callback({
                                "statusCode": 200,
                                "status": "success",
                                "message": "Contact Form Submitted But Not Assigned To Any Agent"
                            })
        }
    });
}


// Assigne Landing Page Leads
var assignLandingPageLead = function (newLandingLead, callback) {
    //console.log("New Landing Lead Data", newLandingLead);
    var criteria = {
        "landingPageId": newLandingLead._id,
        "siteId": newLandingLead.siteId,
        "formType": "Landing Page"
    }
    //console.log("Criteria", criteria);
    var length = newLandingLead.pageAgents.length;
    var assignedTo;
    if (length > 0) {
        table_name.find(criteria).exec((err, lastAssignedLead) => {
            if (err) {
                //console.log("Error", err);
            } else if (lastAssignedLead.length > 0) {
                // //console.log(4);
                var le = lastAssignedLead.length;
                //console.log("le", le);
                // //console.log("++++++++++++++++++++++++++++++");
                // //console.log("LEAD assigned Details");
                // //console.log(lastAssignedLead);
                // //console.log("+++++++++++++++++++++++++++++");
                var ind = le - 1;
                // //console.log("IND",ind);
                // //console.log("lastAssignedLead[ind] ::::::::::::",lastAssignedLead[ind]);
                // var indexId = -1;
                var indexValue = null;
                if (lastAssignedLead[ind].assignedTo) {
                    indexValue = lastAssignedLead[ind].assignedTo;
                }

                //console.log("IndexId", indexValue);
                if (indexValue != null) {
                    //console.log(newLandingLead.pageAgents);
                    var newArr = newLandingLead.pageAgents.map(String)
                    var arrayIndex = newArr.indexOf(indexValue.toString());
                    //console.log("Array Index", arrayIndex);
                    if (arrayIndex > -1) {
                        if (arrayIndex < length - 1) {
                            // //console.log(3);
                            var val = arrayIndex + 1;
                            //console.log("val", val);
                            assignedTo = newLandingLead.pageAgents[val];
                            return callback(null, assignedTo);
                            // //console.log("In Loop 3");
                            // //console.log(assignToAgent);
                        } else {
                            //console.log(2);
                            assignedTo = newLandingLead.pageAgents[0];
                            return callback(null, assignedTo);
                        }
                    } else {
                        //console.log(1);
                        assignedTo = newLandingLead.pageAgents[0];
                        return callback(null, assignedTo);
                    }
                } else {
                    //console.log(66);
                    assignedTo = newLandingLead.pageAgents[0];
                    return callback(null, assignedTo);
                }

            } else {
                assignedTo = newLandingLead.pageAgents[0];
                return callback(null, assignedTo);
            }
        });
    } else {
        var val = 0
        return callback(val);
    }

}


module.exports = {
    getData: getData,
    InsertData: InsertData,
    updateData: updateData,
    InsertMultiple: InsertMultiple,
    deleteData: deleteData,
    getAllData: getAllData,
    getAllContactLeads: getAllContactLeads,
    assignContactsLead: assignContactsLead,
    assignLandingPageLead: assignLandingPageLead,
    InsertDatacrm: InsertDatacrm,
    InsertDatatoSeller: InsertDatatoSeller,
    InsertDataTousers:InsertDataTousers
};
