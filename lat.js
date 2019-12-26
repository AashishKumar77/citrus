// var proj4 = require('proj4');
//
// var firstProjection = "+proj=utm +zone=10 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
//
// var secondProjection = "+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
//
//
// var val = proj4(firstProjection,secondProjection,[509627.8412499996,5444079.467499999]);
//
// console.log(val);



var utmObj = require('utm-latlng');
var utm=new utmObj();
var val = utm.convertUtmToLatLng(509627.8412499996, 5444079.467499999, 10, 'U');

console.log(val);
