/*---------------------------------------------------------------------------------
 * @ file        : server.js
 * @ description : This is the main startup server file to init the application.
 * @ author      : Anurag
 * @ date        :
 pm2 start server.js --name citrus --log-date-format 'YYYY-MM-DD-HH:mm-Z'
 ----------------------------------------------------------------------------------*/

// Include external modules.
const Hapi = require('hapi');
const mongoose = require('mongoose');

// Include internal modules.
const plugIns = require('./PlugIns');
const configs = require('./Configs');
const env = require('./env');
const Utils = require('./Utils');
const app = configs.app[env.instance];
const db = configs.db [env.instance];
const server = new Hapi.Server();
const routes = require('./Routes');
const im = require('imagemagick');
const scheduler= require('./scheduler');
// var cors = require('cors')
// var app = express()

// app.use(cors())

// creating REST API server connection.


server.connection({
    host: app.host,
    port: app.port,
    routes: {
        cors: {
            origin: ['*'],
            additionalHeaders: ["Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin", "X-Requested-With", "Content-Type", "CORELATION_ID",'cache-control','X_AUTH_TOKEN'],
            // additionalHeaders: ["Access-Control-Allow-Methods", ['GET,PUT,POST,DELETE', 'OPTIONS']],
            // additionalExposedHeaders: ['x-logintoken']
        }
    },
    labels: ['api']
}, {
    timeout: {
        server: 50000
    },
});

// creating SOCKET server connection.


const apiServer = server.select('api');

console.log('\x1b[32m', "+++ SERVER SETTINGS LOADED +++\r\n" + JSON.stringify(app) + "\n");

// configure all routes to server object.

server.route(routes)
// register PlugIn's and Start the server.
server.register(plugIns, function (err) {
    // something bad happened loading the plugin.
    if (err) {
        throw err;
    }// start server after all PlugIns registration.
        server.route({
            method: 'GET',
            path: '/{file*}',
            handler: {
            directory: {
              path: 'Assets',
              listing: true
            }
            }
        })
    server.start(function (err) {
        if (err) {
            console.log('\x1b[31m', "+++ Error starting server +++");
            throw err;
        } else {
            /*Utils.universalfunctions.getOffsetViaLatLong([51.507351, -0.127758], function (err, result) {
                console.log("getOffsetViaLatLong", err, result);
            })*/
            console.log('\x1b[32m', '+++ SERVER STARTED +++\r\nServer running ');
        };
    });
});
var asd="asd_fgj_gh"
asd=  Utils.universalfunctions.replaceCharacterInString(asd,"_"," ");

    Utils.universalfunctions.makeDirectory(function (err, message) {
         if (err) {

         }else {

         }
    });
    Utils.universalfunctions.bootstrapAdmin(function (err, result) {
         if (err) {
           console.log("errr",err);
         }else {
             console.log("result",result);
         }
    });
    Utils.universalfunctions.bootstrapDefaultPage(function (err, result) {
         if (err) {
           console.log("errr",err);
         }else {
             console.log("result",result);
         }
    });
    Utils.universalfunctions.bootstrapDefaultPageDetail(function (err, result) {
         if (err) {
           console.log("errr",err);
         }else {
             console.log("result",result);
         }
    });
    /*Utils.universalfunctions.bootstrapOfPriceperSqft_ConvertTo_Number(function (err, result) {
         if (err) {
           console.log("errr",err);
         }else {
             console.log("result",result);
         }
    });*/
    Utils.universalfunctions.bootstrapDefaultLandingPage(function (err, result) {
         if (err) {
           console.log("errr",err);
         }else {
             console.log("result",result);
         }
    });


const Db_Options = {
    db: {native_parser: true},
    server: {poolSize: 5},
    user: db.username,
    pass: db.password
};
// Build the connection string.
const mongoUrl = 'mongodb://' + db.host + ':' + db.port + '/' + db.name;
// create DB connection.
mongoose.connect(mongoUrl, Db_Options, function (err) {
    if (err) { console.log('\x1b[31m', "DB Error: " + err);
        process.exit(1);
    } else {
        //scheduler.daily_scheduler();            //starting the CRON(scheduler)
        console.log('\x1b[32m', 'MongoDB Connected :' + mongoUrl);
    }
});
