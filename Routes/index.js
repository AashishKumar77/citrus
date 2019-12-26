
/*-----------------------------------------------------------------------
   * @ file        : index.js
   * @ description : Main module to incluse all the Routes.
   * @ author      : Anurag Gupta
   * @ date        : 18-dec.2017
-----------------------------------------------------------------------*/

'use strict';

const userRoute         =  require('./userRoute');
const AdminRoute         =  require('./AdminRoute');
const cronRoute         =  require('./cronRoute');
const ResidentialRoute  =  require('./ResidentialRoute');
const payment = require('./payment');


module.exports = [].concat(userRoute).concat(cronRoute).concat(ResidentialRoute).concat(AdminRoute);
