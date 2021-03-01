// $(function () {
//     $('#sbmt').on('click', function () {

//         $.ajax({
//             url: 'http://localhost:3000/login',
//             method: 'POST',
//             contentType: 'application/json',
//             data: JSON.stringify({ username: document.getElementById("username").innerHTML ,
//                                     password: document.getElementById("password").innerHTML,
//                                     logintype: document.getElementById("logintype")}),
//             success: function (response) {

//                 var temp = $('div#display');
//                 temp.html('');
//                 //response.details.forEach(function (detail) {
//                     temp.append('\
//                             <div class="card m-auto pl-2 border-bottom-0">\
//                             <div class="card-body">\
//                             <h3 class="card-title"><b>Personal details</b></h3>\
//                             <p class="card-text text-dark font-weight-bold">Society aadhaar : '+ response.details[0].aadhaarS + '<br>\
//                             Chilling aadhaar : '+ response.details[0].aadhaarC + '<br>\
//                             Email : '+ response.details[0].societyEmail + '<br>\
//                             Cow Milk Rate   : '+ response.details[0].basecmrate + '<br>\
//                             Buffalo Milk Rate: '+ response.details[0].basebmrate + '<br>\
//                             Buffalo Milk Rate: '+ response.details[0].basebmrate + '<br>\
//                             Door No: '+ response.details[0].doorNo + '<br>\
//                             Locality: '+ response.details[0].locality + '<br>\
//                             Pincode: '+ response.details[0].pincode + '<br>\
//                             PhoneNo: '+ response.details[0].phoneNo + '</p>\
//                             </div></div>\
//                            ');
//                // });

//             }
//         });

//     });
// }