const url = new URL(window.location.href);
const userId = url.searchParams.get("userId");
$(document).on("nifty.ready", function () {
  document.querySelector("title").innerHTML = "TRN | MEMBER";
  $('#member-menu-li').addClass('active-sub');
  $('#member-menu-ul').addClass('in');
  $('#member-menu-ul-li').addClass('active-sub');
  $("#page-title > h1.page-header").text("Member");
  $("#page-navigate > .breadcrumb-level-1").text("Member");
  $("#page-navigate > .breadcrumb-level-2").text("Member Detail");
  $("#page-navigate > .breadcrumb-level-3").remove();
if(userId){
  renderTableDeposit();
  renderTableWithdraw();
  renderTableTransaction();
  renderDdlStatus();
  renderDdlPrefix();
  memberRender(userId);

  statusNew(userId);
  validateEditData();
  $("#searchDate").click();
}else{
  window.location.href = "./memberSearch.html";
}

document.querySelector("[data-id=prefix]").addEventListener('click', (event) => {
  renderDdlPrefix();
});

});
$(document).ready(function () {
  $("#dpkDateFrom").on("dp.change", function (e) {
    $("#dpkDateTo").data("DateTimePicker").minDate(e.date);
  });
  $("#dpkDateTo").on("dp.change", function (e) {
    $("#dpkDateFrom").data("DateTimePicker").maxDate(e.date);
  });

  $("#txtDateFrom").val(formatDate(new Date()) + " 00:00:00");
  $("#txtDateTo").val(formatDate(new Date()) + " 23:59:59");
});

// SHOW MEMBER DATA =====================================================
const memberRender = function (memberId) {
  let obj = {
    memberId: memberId,
  };
  let res = callXMLHttpRequest(API.member + "/member", obj);
  if (res.statusCode == "200") {
    let member = res.data[0];

    $('#prefix').html("<option value="+member.prefix_id+">"+member.prefixname+"</option>")
    $("#prefix").selectpicker("refresh");
    el("firstname").value = member.first_name;
    el("lastname").value = member.last_name;
    el("email").value = member.email;
    el("tel").value = member.tel;
    el("memberStatus").value = member.status;
    $("#memberStatus").selectpicker("refresh");
    el("username").value = member.username;
    el("editPassword").value = member.password;
  } else {
    alertMsg("danger", res.statusText);
  }
};

// SHOW BALANCE DATA =======================================================
const statusNew = function (data) {
  let jsonData = {
    uid: data,
  };
  let res = callXMLHttpRequest(API.member + "/findWallet", jsonData);
  if (res.statusCode == "200") {
    let findResult = res.data[0];
    el("balance").value = findResult.balance;
  }
};
// DATA TIME PICKER ========================================================

$("#dpkDateFrom").datetimepicker();
$("#dpkDateTo").datetimepicker();

//==========================================================================
const getDdlParameter = function () {
  let obj = {
    prog_module: "member",
    param_name: "member_status",
  };
  let res = callXMLHttpRequest(API.member + "/getDdlParameter", obj);
  if (res.statusCode == "200") {
    generateOptionWithValue("statusDdl", res.data);
  }
};
// RESETPASSWORD ==========================================================
$("#resetPassword").click(() => {
  resetPassword();
});
const resetPassword = async function () {
  let newPass = generatePasswordMember();
  const obj = {
    id: userId,
    pass: newPass,
  };
  let res = callXMLHttpRequest(API.member + "/upDatePassword", obj);
  if (res.statusCode == "200") {
    el("editPassword").value = newPass;
    alertMsg("success", "update data success");
  } else {
    alertMsg("danger", "update data  error");
  }
};
//====================================================================

$("#resetDate").click(function () {
  $("#txtDateFrom").val("");
  $("#txtDateTo").val("");
});

//=====================================================================
$("#searchDate").click(function () {
  fetchMemberDeposit();
  fetchMemberWithdraw();
  fetchMemberTransaction();
});

// TABLE WITHDRAW =====================================================
const renderTableWithdraw = function (params) {
  let data = [];
  if (params) {
    data = params;
  }
  let column = [
    {
      data: "date",
      className: "text-center",
      render: function (data) {
        if (data) {
          return formatDateStart(data);
        } else {
          return `-`;
        }
      },
    },
    {
      data: "type",
      className: "text-center",
    },
    {
      data: "amount",
      className: "text-center",
    },
    {
      data: "status",
      className: "text-center",
    },
  ];
  if (data.length > 0) {
    setParameterTable("tableWithdraw", data, column);
  } else {
    setParameterTable("tableWithdraw", [], column);
  }
};

const fetchMemberWithdraw = function () {
  let jsonData = {
    dateFrom: $("#txtDateFrom").val(),
    dateTo: $("#txtDateTo").val(),
    uid: userId,
  };
  let res = callXMLHttpRequest(API.member + "/tabWithdrawTabel", jsonData);
  if (res.statusCode == "200") {
    renderTableWithdraw(res.data);
  } else {
    renderTableWithdraw();
  }
};
// TABLE DEPOSIT ================================================================
const renderTableDeposit = function (params) {
  let data = [];
  if (params) {
    data = params;
  }
  let column = [
    {
      data: "date",
      className: "text-center",
      render: function (data) {
        if (data) {
          return formatDateStart(data);
        } else {
          return `-`;
        }
      },
    },
    {
      data: "type",
      className: "text-center",
    },
    {
      data: "amount",
      className: "text-center",
    },
    {
      data: "status",
      className: "text-center",
    },
  ];
  if (data.length > 0) {
    setParameterTable("tableDeposit", data, column);
  } else {
    setParameterTable("tableDeposit", [], column);
  }
};

const fetchMemberDeposit = function () {
  let jsonData = {
    dateFrom: $("#txtDateFrom").val(),
    dateTo: $("#txtDateTo").val(),
    uid: userId,
  };
  let res = callXMLHttpRequest(API.member + "/tabDepositTabel", jsonData);
  if (res.statusCode == "200") {
    renderTableDeposit(res.data);
  } else {
    renderTableDeposit();
  }
};

// TABLE TRANSACTION =======================================================
const renderTableTransaction = function (params) {
  let data = [];
  if (params) {
    data = params;
  }
  let column = [
    {
      data: "date",
      className: "text-center",
      render: function (data) {
        if (data) {
          return formatDateStart(data);
        } else {
          return `-`;
        }
      },
    },
    {
      data: "type",
      className: "text-center",
    },
    {
      data: "balanceForward",
      className: "text-center",
    },
    {
      data: "amount",
      className: "text-center",
    },
    {
      data: "balance",
      className: "text-center",
    },
  ];
  if (data.length > 0) {
    setParameterTable("tableTransaction", data, column);
  } else {
    setParameterTable("tableTransaction", [], column);
  }
};

const fetchMemberTransaction = function () {
  let jsonData = {
    dateFrom: $("#txtDateFrom").val(),
    dateTo: $("#txtDateTo").val(),
    uid: userId,
  };
  let res = callXMLHttpRequest(API.member + "/tabStatementTabel", jsonData);
  if (res.statusCode == "200") {
    renderTableTransaction(res.data);
  } else {
    renderTableTransaction();
  }
};
// BUTTON CANCEL =======================================================

$("#cancelInfo").click(function (data) {
  window.location.href = "./memberSearch.html" ;
});

// EDIT DATA MEMBER =====================================================
$("#editMember").click(() => {
  editMember();
});

const editMember = async function () {
  $("#mainMember").bootstrapValidator("destroy");
  if (validateEditData()) {  
      let obj = {
        id: userId,
        prefix: el("prefix").value,
        firstname: el("firstname").value,
        lastname: el("lastname").value,
        email: el("email").value,
        tel: el("tel").value,
        memberStatus: el("memberStatus").value,
      };
      let res = callXMLHttpRequest(API.member + "/upDateDataMember", obj);
      if (res.statusCode == "200") {
        alertMsg("success", res.statusText);
        memberRender(userId);
      } else {
        alertMsg("danger", res.statusText);
      }  
  }
};
//=========================================================================

const validateEditData = function () {
  elementsName = {
    prefix: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    firstname: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    lastname: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    email: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    tel: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
        regexp: {
          regexp: /^[0-9]+$/,
          message: "fomart invaild number only",
        },
        stringLength: {
          max: 10,
          min: 10,
          message: "The Telephone must be  10 characters",
        },
      },
    },
    memberStatus: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
  };
  if (validate("#mainMember", elementsName)) {
    return true;
  } else {
    return false;
  }
};
//  GENERATEPASSWORD ==========================================================
const generatePasswordMember = function () {
  let length = 4;
  let charset =
    "Ya0bc1JKdeFIfBgTU2hSiOPjk2lmCDn3XopGH4qLQrsMNtWuvV5wxRyz6A7E8Z9";
  let charset2 = "";
  let val = "";
  for (let i = 0, n = charset.length; i < length; i++) {
    charset2 = String(Date.now());
    val += charset.charAt(Math.floor(Math.random() * n));
    val += charset2.charAt(Math.floor(Math.random() * charset2.length));
  }
  return val;
};

const formatDate = function (date) {
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
  var fullDate = year + "-" + month + "-" + day;
  return fullDate;
};

//  SET SELECT =================================================================
//  SELECT STATUS ==============================================================
const renderDdlStatus = function () {
  let obj = {
    prog_module: "member",
    param_name: "member_status",
  };
  let res = callXMLHttpRequest(API.member + "/getDdlParameter", obj);
  if (res.statusCode == "200") {
    generateOptionWithValue("memberStatus", res.data);
  }
};
// SELECT PREFIX ==============================================================
const renderDdlPrefix = function () {
  let obj = {
    active: "1",
  };
  let res = callXMLHttpRequest(API.member + "/renderDdlPrefix", obj);
  if (res.statusCode == "200") {
    generateOptionWithValuePrefix("prefix", res.data);
  }
};

const generateOptionWithValuePrefix = function (id, data, value) {
  let option = "";
  option += "<option value  selected>Please select...</option>";
  for (let i = 0; i < data.length; i++) {
    if (data[i]._id) {
      option +=
        '<option value="' +
        data[i]._id +
        '" >' +
        data[i].prefix_name +
        "" +
        "</option>";
    }
  }
  document.getElementById(id).innerHTML = option;
  $("#" + id).selectpicker("refresh");
};
//=============================================================================
