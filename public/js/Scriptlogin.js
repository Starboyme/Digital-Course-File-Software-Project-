$(function () {

    $('#submit').on('click', function () {

        var logtype="";
        if(document.getElementsByName('logintype')[0].checked){logtype="admin";} 
        else if(document.getElementsByName('logintype')[1].checked){logtype="faculty";}
        else if(document.getElementsByName('logintype')[2].checked){logtype="student";} 
        else{logtype="null"}

        var temp = $('div#display');
        temp.html('');

        $.ajax({
            url: 'http://localhost:3000/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: document.getElementById("username").value,
                                    password: document.getElementById("password").value,
                                    logintype: logtype}),

            success: function (response) {

                // window.close()
                var w = window.open('about:blank');
                w.document.open();
                w.document.write(response);
                w.document.close();

                // console.log(response)
                // temp.append(response);
            }
        });

    });

    $('#f1submit').on('click', function () {

        var temp = $('div#otp-input');
        temp.html('');

        $.ajax({
            url: 'http://localhost:3000/f1submit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: document.getElementById("username").value,
                                    email: document.getElementById("email").value,
                                    }),

            success: function (response) {

                if(response=="0"){
                    temp.append("Invalid Details")
                }
                else{
                    temp.append(`\
                    <label for="otp">OTP</label>\
                    <input type="text" class="form-control" id="otp" name="otp">\
                    <input type="submit" id="f2submit">\
                    `);
                }
                
            }
        });


    });


     $(document).on("click","#f2submit",function() {

        var temp = $('div#otp-input');
        // temp.html('');

        $.ajax({
            url: 'http://localhost:3000/f2submit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ otp: document.getElementById("otp").value,
                                    }),

            success: function (response) {

                if(response=="0"){
                    temp.append("Otp did not match")
                }
                else{
                    temp.append(`
                    <label for="newpassword">NEW PASSWORD</label>\
                    <input type="text" class="form-control" id="newpassword" name="newpassword">\
                    <input type="submit" id="new_password_submit">\
                    `);
                }
                
            }
        });


    });

    $(document).on("click","#new_password_submit",function() {

        var temp = $('div#acknowledgement');
        
        $.ajax({
            url: 'http://localhost:3000/newpasswordreset',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: document.getElementById("username").value,
                                   newpassword: document.getElementById("newpassword").value
                                    }),

            success: function (response) {

                temp.append(response);
                
            }
        });

    });

   
});