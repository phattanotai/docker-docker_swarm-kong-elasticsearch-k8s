$(document).ready((e) => {
    $('#btn-login').click(async e => await login());
    $('#username, #password').keydown(async e =>{
        if(e.keyCode === 13){
            await login();
        }else{
            document.getElementById("btn-login").disabled = false;
        }
    });
});
const getMsg = function(flag, element,msg) {
    if (flag) {
      element.innerHTML = msg;
      element.className += " movedown";
      setTimeout(() => {
        element.classList.remove('movedown');
      }, 3000);
    }
}
const login = function() {
    return new Promise(async resolve => {
        if(!document.getElementById('username').value){
            getMsg(true, document.querySelector('.errormsg'),"Username is required");
        }else if(!document.getElementById('password').value){
            getMsg(true, document.querySelector('.errormsg'),"Password is required");
        }else{
            document.getElementById("btn-login").disabled = true;
            document.getElementById("username").disabled = true;
            document.getElementById("password").disabled = true;
            try{
                    await fetch(`${API.auth}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: (document.getElementById('username').value).trim(),
                            password: (document.getElementById('password').value).trim()
                        })
                    }).then(async response => await response.json()).then(async response => {
                        if (response.statusCode === statusCode.Success.ok.codeText && response.data) {
                            alertMsg("success", 'login success');
                            localStorage.setItem("userData",JSON.stringify(response.data));
                            setTimeout(() => {
                                window.location.replace(`${location.origin}/pages/index.html`);
                                resolve(response.statusText);
                            }, 200);
                        }else if(response.statusCode === statusCode.Success.ok.codeText && response.message) {
                            alertMsg("warning", response.message);
                        }else if(response.statusCode === statusCode.Fail.err.codeText){
                            alertMsg("danger",response.statusCode + ' ' + response.statusText);
                        } else {
                            resolve(response.statusText);
                            alertMsg("danger", "username or password is incorrect");
                        }
                        document.getElementById("username").disabled = false;
                        document.getElementById("password").disabled = false;
                    });
            }catch(error){
                document.getElementById("username").disabled = false;
                document.getElementById("password").disabled = false;
                alertMsg("danger", error);
            }
        }
    });
}
const validateLoginData = function () {
    elementsName = {
        username: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                },
            }
        },
        password: {
            validators: {
                notEmpty: {
                    message: 'This field is required'
                }
            }
        }
    }
    if (validate('#editStaffForm', elementsName)) {
        return true;
    } else {
        return false;
    }
}