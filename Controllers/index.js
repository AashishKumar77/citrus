
/*-----------------------------------------------------------------------
   * @ file        : index.js
   * @ description : Main module to incluse all the controllers.
   * @ author      : Anurag Gupta
   * @ date        :
-----------------------------------------------------------------------*/

'use strict';

module.exports = {
		AdminController              : require('./AdminController'),
    CronController               : require('./cronController'),
    LobController                : require('./LobControllers'),
    RetsPropertyRD_1_Controller  : require('./retsPropertyRD_1_Controller'),
    UserController               : require('./userController'),
		CronC						             : require('./cronC'),
		crCron   										 : require('./crCron')

};
