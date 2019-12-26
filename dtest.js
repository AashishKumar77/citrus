// function validateemailsub(val) {
//                                                 var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
//                                                 var address = val;
//                                                 console.log("reg.test(address)",reg.test(address));
//                                                 if(reg.test(address) == false) {
//                                                                 //alert('Invalid Email Address');
//                                                                 return false;
//                                                 }else{
//                                                                 return true;
//                                                 }
//                                 }
//
// var check = validateemailsub('r@g.com')
// console.log(check);

// var geolib =  require('geolib');
// var val = geolib.isPointInside(
//     {longitude: -118.58367924999999,latitude: 48.26674076588964},
//     [
//       {
//           latitude : 50.20327522727269,
//           longitude : -120.14373784374999
//       },
//       {
//           latitude : 46.707852512177624,
//           longitude : -122.36297612499999
//       },
//       {
//           latitude : 47.44109230183927,
//           longitude : -112.43133549999999
//       },
//       {
//           latitude : 50.301621340792686,
//           longitude : -120.16571049999999
//       },
//       {
//           latitude : 50.20327522727269,
//           longitude : -120.14373784374999
//       }
//     ]
// );
//
//
// console.log(val);
var val = new Date("2019-03-26T12:10:23.517+0000");
console.log(new Date(val - 5 * 24 * 60 * 60 * 1000));
// var val2 = new Date(val + 24 * 60 * 60 * 1000),
// var d = new Date("");
 // var newD = d.setDate(d.getDate()-5);
