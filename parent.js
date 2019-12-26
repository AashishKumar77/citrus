// const fs = require('fs');  
// const child_process = require('child_process');  
//  for(var i=0; i<3; i++) {  
//    var workerProcess = child_process.spawn('node', ['/home/chetannarang/chetan_nodejs/test/myapp/child.js', i]);  
//   workerProcess.stdout.on('data', function (data) {  
//       console.log('stdout: ' + data);  
//    });  
//  workerProcess.stderr.on('data', function (data) {  
//       console.log('stderr: ' + data);  
//    });  
//  workerProcess.on('close', function (code) {  
//       console.log('child process exited with code ' + code);  
//    });  
// }  

const fs = require('fs');  
const child_process = require('child_process');  
 for(var i=0; i<3; i++) {  
   var worker_process = child_process.fork("/home/chetannarang/chetan_nodejs/test/myapp/app.js", [i]);    
  worker_process.on('close', function (code) {  
      console.log('child process exited with code ' + code);  
   });  
}  