var fs = require('fs');				// for all modules except global modules, we need to use "require"
var exec = require('child_process').exec;
var zip = require('bestzip');


var production_live = true;
var production_local = false;
var dist = false;
var agentIdLive = "5abb8c0b6a46656b3251292f";
var facebookAppId = "2071518303119323";
var baseUrl = "http://southsurrey.ca/";
var facebookPixelId = "426626084414998";

console.log(__dirname);
console.log(__filename);
process.chdir("angular/");
console.log(__dirname);
console.log(__filename);
var prod_environment = `export const environment={ production: ${production_live},apiBaseUrl: "http://api.uat.djt.ca",agentIdLive: "${agentIdLive}",facebookAppId: "${facebookAppId}",baseUrl: "${baseUrl}",facebookPixelId: "${facebookPixelId}",s3ImageUrl: "https://s3.ca-central-1.amazonaws.com/citruscow-canada/FVREB/{{mslno}}/image{{count}}.jpeg",s3ThumbImageUrl: "https://s3.ca-central-1.amazonaws.com/citruscow-canada/FVREB/{{mslno}}/thumb_image{{count}}.jpeg"};`

var environment = `export const environment={ production: ${production_local},apiBaseUrl: "http://api.uat.djt.ca",agentIdLive: "${agentIdLive}",facebookAppId: "${facebookAppId}",baseUrl: "${baseUrl}",facebookPixelId: "${facebookPixelId}",s3ImageUrl: "https://s3.ca-central-1.amazonaws.com/citruscow-canada/FVREB/{{mslno}}/image{{count}}.jpeg",s3ThumbImageUrl: "https://s3.ca-central-1.amazonaws.com/citruscow-canada/FVREB/{{mslno}}/thumb_image{{count}}.jpeg"};`
//      /home/matrix/2019/Citrus_backend/angular/src/environments/environment.prod.ts
//    /home/matrix/2019/Citrus_backend/angular/src/environments/environment.ts


fs.writeFile('angular/src/environments/environment.prod.ts', prod_environment, (err,data) => {
	if(err){
      console.log(err);
  }else{
      fs.writeFile('angular/src/environments/environment.ts', environment, (err2,data2) => {
        if(err){
            console.log(err);
        }else{
              // Creating The Build
              process.chdir("angular/");
              var child = exec('ng build --prod --output-hashing none',function (error, stdout, stderr) {
    							console.log('stdout: ' + stdout);
    							console.log('stderr: ' + stderr);
    							if (error !== null) {
    								console.log('exec error: ' + error);
    							}else{
                    zip({
                      source: './dist',
                      destination: './destination.zip'
                    }).then(function() {


                    }).catch(function(err) {
                      console.error(err.stack);
                      process.exit(1);
                    });
                  }
							});
              //Creating the Build function ends here
        }
      });
  }
});







var child = exec('mv /Controller/angular/dist.zip ../../Assets/builds/',function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }else{
      console.log('Moved successfully');
    }
});
