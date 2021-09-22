const fullScreen = function(){
    const elem = document.querySelector("body");
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if (elem.mozRequestFullScreen) { /* FIREFOX */
            elem.mozRequestFullScreen();
          } else if (elem.webkitRequestFullscreen) { /* CHROME, SAFARI & OPERA */
            elem.webkitRequestFullscreen();
          } else if (elem.msRequestFullscreen) { /* IE/EDGE */
            elem.msRequestFullscreen();
          }
    }else{
        document.exitFullscreen();
    }
}
// FUNCTION EVENT KEYPRESS UNLOCK SCREEN  10/9/2020
const unlockKeyPress = function(e){
    if(e.keyCode === 13){
        unlockScreen();
    }
}
// FUNCTION LOCK SCREEN  10/9/2020
const lockScreen = function () {
    $("#p").val('');
    $("#u").val(constEmail);
    $("#lockScreen").show().css("opacity", "1");
    $("#lockScreenBackground").show().css("opacity", "0.8");
    localStorage.setItem('l',true);
}
// FUNCTION UNLOCK SCREEN  10/9/2020
const unlockScreen = async function () {
    const username = $("#u").val();
    const password = $("#p").val();
    if(username && password){
        try{
            await fetch(`${API.auth}/unlock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: (username).trim(),
                    password: (password).trim()
                })
            }).then(async response => await response.json()).then(async response => {
                if (response.statusCode === statusCode.Success.ok.codeText && response.data) {
                    $("#lockScreen, #lockScreenBackground").css("opacity", "0").hide();
                    localStorage.setItem('l',false);
                }else if(response.statusCode === statusCode.Success.ok.codeText && response.message) {
                    alertMsg("warning", response.message);
                }else if(response.statusCode === statusCode.Fail.err.codeText){
                    alertMsg("danger",response.statusCode + ' ' + response.statusText);
                } else {
                    alertMsg("warning", "username or password is incorrect");
                }
            });
        }catch(error){
            alertMsg("danger", error);
        }
    }else{
        let msg = '';
        if(!username){
            msg += 'Username null'
        }
        if(!password){
            msg += '  password null'
        }
        alertMsg("warning", msg);
    } 
}
// FUNCTION ISNULL  10/9/2020
const isNull = (param) => {
    if ((param == null) || (param == undefined) || (param.length)) {
        return true;
    } else {
        return false;
    }
}
// FUNCTION DEBUG  10/9/2020
const debug = (message) => {
    const d = new Date();
    const l = '/';
    const s = ':';
    let dateFormat = `${d.getDate()}${l}${d.getMonth()+1}${l}${d.getFullYear()}` + 
    ' ' + 
    `${d.getHours()}${s}${d.getMinutes()}${s}${d.getSeconds()}`;
	console.log([dateFormat],": " + message);
};
// LOGOUT 
const logout = function(){
    localStorage.clear("userData");
    localStorage.setItem('l',false);
    alertMsg("success", "Logout Success")
    setTimeout(() => {
        window.location.replace(`${location.origin}/login/login.html`);
    }, 200);
}
// FUNCTION FATCH DATA FROM API 
const fatchResult = function(url, data){
    return new Promise(async (resolve) =>{
        try{
            const userData = JSON.parse(localStorage.getItem("userData"));
            const token = userData.token;
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token,
                },
                body: JSON.stringify(data)
            }).then(async response => await response.json()).then(async response => {
                if (response.statusCode === statusCode.Success.ok.codeText && response.data) {
                    resolve(response.data);
                }else if (response.statusCode === statusCode.Success.ok.codeText && response.message) {
                    resolve(true);
                    alertMsg("success", response.message);
                }else if(response.statusCode === statusCode.Success.noContent.codeText) {
                    resolve(false);
                    alertMsg("warning", response.statusText);
                }else if(response.statusCode ===  statusCode.ClientErrors.badRequest.codeText) {
                    resolve(false);
                    alertMsg("warning", response.message);
                }else {
                    resolve(false);
                    alertMsg("danger", response.statusText + ' ' + response.message);
                }
            });
        }catch(error){
            debug(url + ' -> ' + error);
            alertMsg("danger", error);
        }
    })
}
// FUNCTION GENERATE PASSWORD 8 DIGITS INCLUDING 1-8 a-z AND A-Z
const generatePassword = function(){
    let length = 4;
    let charset = "Yabc1JKdeFIfBgTU2hSiOPjk2lmCDn3XopGH4qLQrsMNtWuvV5wxRyz6A7E8Z";
    const number = Date.now();
    const charset2 = number.toString(16);
    let val = '';
    for(let i = 0,n = charset.length;i< length;i++){
        val += charset.charAt(Math.floor(Math.random()*n));
    }
    while(val.length < 8){
        const a = charset2.charAt(Math.floor(Math.random()*charset2.length));
        if(a !== '0' && a  !== '9'){
            val += a; 
        }
    }
    return val;
}
// FUNCTION GENERATE PASSWORD 8 DIGITS INCLUDING 1-8 a-z AND A-Z
const generatePassword2 = function(){
    const number = Date.now();
    const charset2 = number.toString(16);
    let val = charset2.substring(charset2.length-8,charset2.length);
    return val;
}
//HTTP STATUS CODE 
const statusCode = {
    Informational: {
        Continue: {
            code: 100,
            codeText: "100",
            description: "Continue",
        },
        switchingProtocols: {
            code: 101,
            codeText: "101",
            description: "Switching Protocols",
        },
        processing: {
            code: 102,
            codeText: "102",
            description: "Processing",
        },
        earlyHints: {
            code: 103,
            codeText: "103",
            description: "Early Hints",
        },
    },
    Success: {
        ok: {
            code: 200,
            codeText: "200",
            description: "OK",
        },
        created: {
            code: 201,
            codeText: "201",
            description: "Created",
        },
        accepted: {
            code: 202,
            codeText: "202",
            description: "Accepted",
        },
        nonAuthoritativeInformation: {
            code: 203,
            codeText: "203",
            description: "Non-Authoritative Information",
        },
        noContent: {
            code: 204,
            codeText: "204",
            description: "No Content",
        },
        noOuCode: {
            code: 212,
            codeText: "212",
            description: "This is organzation code not found",
        },
        noSusDoc: {
            code: 204,
            codeText: "204",
            description: "Sub document type not found ",
        },
        resetContent: {
            code: 205,
            codeText: "205",
            description: "Reset Content",
        },
        partialContent: {
            code: 206,
            codeText: "206",
            description: "Partial Content",
        },
        multiStatus: {
            code: 207,
            codeText: "207",
            description: "Multi-Status",
        },
        alreadyReported: {
            code: 208,
            codeText: "208",
            description: "Already Reported",
        },
        imUsed: {
            code: 226,
            codeText: "226",
            description: " IM Used",
        },
    },
    Redirection: {
        multipleChoices: {
            code: 300,
            codeText: "300",
            description: "Multiple Choices",
        },
        movedPermanently: {
            code: 301,
            codeText: "301",
            description: "Moved Permanently",
        },
        found: {
            code: 302,
            codeText: "302",
            description: 'Found (Previously "Moved temporarily")',
        },
        seeOther: {
            code: 303,
            codeText: "303",
            description: "See Other (since HTTP/1.1)",
        },
        notModified: {
            code: 304,
            codeText: "304",
            description: "Not Modified (RFC 7232)",
        },
        useProxy: {
            code: 305,
            codeText: "305",
            description: "Use Proxy (since HTTP/1.1)",
        },
        switchProxy: {
            code: 306,
            codeText: "306",
            description: "Switch Proxy",
        },
        temporaryRedirect: {
            code: 307,
            codeText: "307",
            description: "Temporary Redirect (since HTTP/1.1)",
        },
        permanentRedirect: {
            code: 308,
            codeText: "308",
            description: "Permanent Redirect (RFC 7538)",
        },
    },
    ClientErrors: {
        badRequest: {
            code: 400,
            codeText: "400",
            description: "Bad Request",
        },
        unauthorized: {
            code: 401,
            codeText: "401",
            description: "Unauthorized",
        },
        paymentRequired: {
            code: 402,
            codeText: "402",
            description: "Payment Required",
        },
        forbidden: {
            code: 403,
            codeText: "403",
            description: "Forbidden",
        },
        notFound: {
            code: 404,
            codeText: "404",
            description: "Not Found",
        },
        methodNotAllowed: {
            code: 405,
            codeText: "405",
            description: "Method Not Allowed",
        },
        notAcceptable: {
            code: 406,
            codeText: "406",
            description: "Not Acceptable",
        },
        proxyAuthenticationRequired: {
            code: 407,
            codeText: "407",
            description: "Proxy Authentication Required",
        },
        requestTimeout: {
            code: 408,
            codeText: "408",
            description: "Request Timeout",
        },
    },
    Fail: {
        err: {
            code: 500,
            codeText: "500",
            description: "ERROR",
        },
        notImplemented: {
            code: 501,
            codeText: "501",
            description: "Not Implemented",
        },
        badGateway: {
            code: 502,
            codeText: "502",
            description: "Bad Gateway",
        },
        serviceUnavailable: {
            code: 503,
            codeText: "503",
            description: "Service Unavailable",
        },
        gatewayTimeout: {
            code: 504,
            codeText: "504",
            description: "Gateway Timeout",
        },
        httpVersionNotSupported: {
            code: 505,
            codeText: "505",
            description: "HTTP Version Not Supported",
        },
        variantAlsoNegotiates: {
            code: 506,
            codeText: "506",
            description: " Variant Also Negotiates",
        },
        insufficientStorage: {
            code: 507,
            codeText: "507",
            description: "Insufficient Storage ",
        },
        loopDetected: {
            code: 508,
            codeText: "508",
            description: " Loop Detected",
        },
        notExtended: {
            code: 510,
            codeText: "510",
            description: "Not Extended",
        },
        networkAuthenticationRequired: {
            code: 511,
            codeText: "511",
            description: "Network Authentication Required",
        },
        fail: {
            code: 202,
            codeText: "202",
            description: "Data Not Found",
        },
    }
}