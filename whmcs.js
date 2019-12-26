// const WHMCS = require('node-whmcs');
 
// const whmcsClient = new WHMCS({
//   host: 'clients.citruscow.com', //dont include http/https.
//   identifier: '6OIgbEh0tOlubCFjyJBpBeiM69GZL4BA',
//   secret: 'R5xgMoj4beRNFpD1L7oZxISEnN1df2Km'
//   //endpoint: 'includes/api.php', //only required if you changed the api.php location
// });



// /* create client */
// // whmcsClient
// //   .add('Client', {   
// //     firstname: 'whmcs_18',
// //     lastname: 'name',
// //     email:'whmcs_18@mailinator.com',
// //     address1:'Sunny Meadows',
// //     city:'Brampton',
// //     state:'Toronto',
// //     postcode:'10010',
// //     country:'CA',
// //     phonenumber:'7676767676',
// //     password2:'ab123456',
// //     currency:'2'
// // })
// //   .then(function(client){

// //     console.log('client response ',client);    

// //   }).catch(err => console.log('ERROR:', err));


// /** Create new order */

// var products_ids  = ['7'];

// //  whmcsClient
// //    .add('Order', {   
// //      clientid: '21',
// //      paymentmethod: 'stripe',
// //      pid: products_ids,
// //      promocode:'100PERCENTOFF',
// //    })
// //    .then(function(order){

//     //console.log(order);

//         /** Add service to client */
//     //  var productids = '9';

//     //  whmcsClient.update('ClientProduct',{
//     //  serviceid:productids,
//     //  domain:'whmcs1.matrixmarketers.com',
//     //  serviceusername:'whmcs1',
//     //  servicepassword:'3e8t&C8n?C7WpuRW',
//     //  status:'Active'
//     //  }).then(function(updatedClient){
//     //  console.log(' updated client',updatedClient);
//     //  });      

//   //  }).catch(err => console.log('ERROR:', err));




// /** Accept order */

//     // whmcsClient.call('AcceptOrder',{
//     // orderid:'24',       
//     // }).then(function(acceptedOrder){
//     // console.log(' order accepted',acceptedOrder);
//     // });  

// /** Module Create */

// whmcsClient.call('ModuleCreate',{
// serviceid:'9',       
// }).then(function(acceptedOrder){
// console.log(' order accepted',acceptedOrder);
// }); 

const Utils = require('/home/chetannarang/chetan_nodejs/citrus_backend/Utils');

var email_data = {
  to: 'savita@matrixmarketers.com',
  cc:'savita@matrixmarketers.com',
  from:'chetan@devs.matrixmarketers.com'  ,
  subject: 'Welcome - site has been uploaded',

};

Utils.universalfunctions.send_email(email_data, (err, res)=> {
  if (err){
    console.log("error")  
    }
    else{
      console.log("success site has been uploaded",res);
    }
  
});