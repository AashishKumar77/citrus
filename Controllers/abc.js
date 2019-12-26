var fs = require('fs');				// for all modules except global modules, we need to use "require"
var exec = require('child_process').exec;

var id = "1234567890"
var child = exec(`mv angular/dist.zip ../Assets/builds/${id}.zip`,function (error, stdout, stderr) {
    //console.log('stdout: ' + stdout);
    //console.log('stderr: ' + stderr);
    if (error !== null) {
      //console.log('exec error: ' + error);
    }else{
      //console.log('Moved successfully');
    }
});
