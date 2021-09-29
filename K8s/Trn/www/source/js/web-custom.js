(async () => {
  await injectWebComplement();
  const pushData = {
    key: "dc44d9c450d61db16cb6",
    cluster: "ap1",
  };
  setTimeout(() => {
    checkLogin();
    const pusher = new Pusher(pushData.key, {cluster: pushData.cluster});
    pusher.subscribe('staff').bind('login', function (dataPusher) {
      if(localStorage.getItem('userData')){
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = userData.token;
        if(constEmail === dataPusher.username && dataPusher.token !== token){
          alertMsg("danger", '');
          logout();
        }
      }
    });
  }, 500);
 
})();
let constEmail;
const checkLogin = async function () {
  if (localStorage.getItem("userData")) {
    if (window.location.pathname === "/login/login.html") {
      window.location.replace(`${location.origin}/pages/index.html`);
    } else {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData.token;
      try {
        await fetch(`${API.auth}/checkLogin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
          .then(async (response) => await response.json())
          .then(async (response) => {
            if (
              response.statusCode ===
              statusCode.ClientErrors.unauthorized.codeText
            ) {
              alertMsg("danger", " token expired ");
              setTimeout(() => {
                localStorage.clear("userData");
                window.location.replace(`${location.origin}/login/login.html`);
              }, 2000);
            } else if (
              response.statusCode === statusCode.ClientErrors.forbidden.codeText
            ) {
              alertMsg("danger", response.statusCode + " " + response.data);
              setTimeout(() => {
                localStorage.clear("userData");
                window.location.replace(`${location.origin}/login/login.html`);
              }, 2000);
            } else {
              constEmail = response.data.email;
              document.getElementById("navStaffName").innerHTML = (
                (response.data.prefixName ? response.data.prefixName : " ") +
                " " +
                response.data.first_name +
                " " +
                response.data.last_name
              ).toUpperCase();
              document.getElementById(
                "navStaffEmail"
              ).innerHTML = response.data.email.toUpperCase();
              if (JSON.parse(localStorage.getItem("l")) === true) {
                lockScreen();
              }
            }
          });
      } catch (error) {
        alertMsg("danger", "Auth -> checkLogin ->" + error);
        debug("Auth -> checkLogin ->" + error);
      }
    }
  } else {
    if (window.location.pathname !== "/login/login.html") {
      window.location.replace(`${location.origin}/login/login.html`);
    }
  }
};

function injectWebComplement() {
  return new Promise((resolve) => {
    let script = document.createElement("script");
    script.src = `${location.origin}/source/js/init-web-complement.js`;
    document.querySelector("body").appendChild(script);
    resolve(true);
  });
}

function validate(fieldName, elements) {
  $(fieldName)
    .bootstrapValidator({
      message: "This value is not valid",
      excluded: [":disabled"],
      fields: elements,
    })
    .on("status.field.bv", function (e, data) {
      e.preventDefault();
      var $parent = data.element.parents(".form-group");
      // Remove the has-success class
      $parent.removeClass("has-success");
    });
  $(fieldName).bootstrapValidator("validate");
  if ($(".has-error").length == 0) {
    return true;
  } else {
    if ($(".form-group.selectpicker").hasClass("has-error")) {
      $(".form-group.selectpicker")
        .find(".btn-group.bootstrap-select.form-control")
        .find(".btn.dropdown-toggle.btn-default.bs-placeholder")
        .attr("style", "border-color : #f55a4e !important");
    } else {
      $(".form-group.selectpicker")
        .find(".btn-group.bootstrap-select.form-control")
        .find(".btn.dropdown-toggle.btn-default")
        .removeAttr("style");
    }
    return false;
  }
}

const alertMsg = function (type, msg) {
  if (type && msg) {
    var typeMsg = "";
    if (type.toLowerCase() === "danger") {
      typeMsg = "Danger";
    }
    if (type.toLowerCase() === "warning") {
      typeMsg = "Warning";
    }
    if (type.toLowerCase() === "success") {
      typeMsg = "Success";
    }
    $.niftyNoty({
      type: type.toLowerCase(),
      container: "floating",
      html: "<strong>" + typeMsg + "!</strong> " + msg,
      closeBtn: true,
      floating: {
        position: "top-right",
        animationIn: "jellyIn",
        animationOut: "fadeOut",
      },
      focus: true,
      timer: false ? 0 : 2500,
    });
  }
};

const setParameterTable = function (
  id,
  data,
  columns,
  columnsOrder,
  length,
  widthTable
) {
  let leg = 10;
  let orderc = 0;
  let status;
  if (columnsOrder) {
    orderc = columnsOrder;
    status = "desc";
  }
  if (length) {
    leg = length;
  }
  const optionTable = {
    order: [[orderc, status]],
    pageLength: 10,
    bDestroy: true,
    responsive: true,
    searching: false,
    pageLength: leg,
    lengthChange: false,
    info: false,
    language: {
      paginate: {
        previous: '<i class="demo-psi-arrow-left"></i>',
        next: '<i class="demo-psi-arrow-right"></i>',
      },
    },
    data: data,
    columns: columns ? columns : [],
    buttons: [
      {
        extend: "collection",
        text: "Export",
        buttons: ["copy", "excel", "csv", "pdf", "print"],
      },
    ],
  };
  if (widthTable) {
    optionTable.columnDefs = widthTable;
  }
  $(`#${id}`).DataTable(optionTable);
};

const callXMLHttpRequest = function (url, data) {
  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData.token;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("authorization", "Bearer " + token);
    xhr.send(JSON.stringify(data));
    try {
      result = JSON.parse(xhr.responseText);
    } catch (error) {
      result = { statusText: xhr.responseText };
    }
    return result;
  } catch (error) {
    debug(url + " " + error);
    return false;
  }
};

const formatDateStart = function (date) {
  var datetime = new Date(date).getTime();
  var currentTime = datetime;
  var d = new Date(currentTime),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  let hh = d.getHours();
  let mm = d.getMinutes();
  let ss = d.getSeconds();
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (ss < 10) {
    ss = "0" + ss;
  }
  let dateHour = hh + ":" + mm + ":" + ss;
  var fullDate = year + "-" + month + "-" + day + " " + dateHour;
  return fullDate;
};

const generateOptionWithValue = function (id, data, value) {
  let option = "";
  option += "<option value  selected>Please select...</option>";
  for (let i = 0; i < data.length; i++) {
    if (data[i].param_value) {
      option +=
        '<option value="' +
        data[i].param_value +
        '" >' +
        data[i].param_desc +
        "" +
        "</option>";
    }
  }
  document.getElementById(id).innerHTML = option;
  $("#" + id).selectpicker("refresh");
};

// GENERATE DATA ON DATATABLE DEPOSIT
const genDataTable = function (id, columns, data) {
  $(id).DataTable({
    pageLength: 10,
    destroy: true,
    paging: true,
    searching: true,
    processing: true,
    serverSide: true,
    lengthMenu: [
      [10, 25, 50, 100, -1],
      [10, 25, 50, 100, "All"],
    ],
    ajax: {
      url: data.url,
      type: "POST",
      data: data.data,
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    },
    columns: columns ? columns : [],
  });
};

const callAPI = (path, request) => {
  return new Promise((resolve, reject) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData.token;
    fetch(`${API.deposit}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then(async (response) => await response.json())
      .then(async (response) => {
        if (response.statusCode === "200") {
          console.log(111);
          resolve(response.data);
        }
      });
  });
};
const el = function (id) {
  return document.getElementById(id);
};

const checkNull = function (param) {
  if (param !== "" && typeof param !== "undefined" && typeof param !== null) {
    return true;
  } else {
    return false;
  }
};

let evetMose = false;
const isNumber = function (evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 46 || charCode > 57)) {
    return false;
  } else if (charCode == 47) {
    return false;
  } else {
    if (charCode == 46) {
      if (evt.target.value.includes(".")) {
        return false;
      } else {
        return true;
      }
    } else {
      let point = evt.target.value;
      let pointLength = point.length;
      let pointIn = point.indexOf(".");
      if (pointIn > -1) {
        if (pointLength > pointIn + 2) {
          let mouseIsDown = false;
          window.addEventListener("mousedown", function () {
            mouseIsDown = true;
            setTimeout(function () {
              if (mouseIsDown) {
                evetMose = true;
              }
            }, 75);
          });
          window.addEventListener("mouseup", function () {
            mouseIsDown = false;
          });
          if (evetMose) {
            evetMose = false;
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }
};

const formatMoney = function (
  amount,
  decimalCount = 3,
  decimal = ".",
  thousands = ","
) {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
    const negativeSign = amount < 0 ? "-" : "";
    let i = parseInt((amount = Math.abs(Number(amount) || 0))).toString();
    let j = i.length > 3 ? i.length % 3 : 0;
    let show =
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "");
    return show.slice(0, -1);
  } catch (e) {
    console.log(e);
  }
};

const deCodeFormatMoney = function (data) {
  return parseFloat(data.split(",").join(""));
};

const alphanumeric = "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$";
const alpha = "[ A-Za-z()]";
const alphabetical = "^[a-zA-Z0-9@_.]+$";
const onKeyValidate = function (e, charVal) {
  var keynum;
  var keyChars = /[\x00\x08]/;
  var validChars = new RegExp(charVal);
  if (window.event) {
    keynum = e.keyCode;
  } else if (e.which) {
    keynum = e.which;
  }
  var keychar = String.fromCharCode(keynum);
  if (!validChars.test(keychar) && !keyChars.test(keychar)) {
    return false;
  } else {
    return keychar;
  }
};
