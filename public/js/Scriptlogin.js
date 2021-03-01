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
});