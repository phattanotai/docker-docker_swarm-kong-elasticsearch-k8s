$(document).on("nifty.ready", () => {
  document.querySelector("title").innerHTML = "TRN | WITHDRAW";
  $('#withdraw-menu-li').addClass('active-sub');
  $('#withdraw-menu-ul').addClass('in');
  $('#withdraw-menu-ul-li').addClass('active-sub');
  $("#page-title > h1.page-header").text("Withdraw");
  $("#page-navigate > .breadcrumb-level-1").text("Withdraw");
  $("#page-navigate > .breadcrumb-level-2").text("Withdraw Transaction");
  $("#page-navigate > .breadcrumb-level-3").remove();
  renderDdlStatus();
  fetchTableWithdraw();
});

$(document).ready(function () {
  $("#dpkDateFrom").on("dp.change", function (e) {
    $("#dpkDateTo").data("DateTimePicker").minDate(e.date);
  });
  $("#dpkDateTo").on("dp.change", function (e) {
    $("#dpkDateFrom").data("DateTimePicker").maxDate(e.date);
  });
  if (screen.width <= 1024) {
    el("colRes").classList.remove("col-xs-10");
    el("colRes").classList.add("col-xs-12");
  }
});

const renderDdlStatus = function () {
  let obj = {
    prog_module: "withdraw",
    param_name: "withdraw_status",
  };
  let res = callXMLHttpRequest(`${API.withdraw}/renderDdlStatus`, obj);
  if (res.statusCode == "200") {
    generateOptionWithValue("statusDdl", res.data);
  }
};

$("#dpkDateFrom").datetimepicker();
$("#dpkDateTo").datetimepicker();

const renderTableWithdraw = function (params) {
  let data = [];
  if (params) {
    data = params;
  }
  let column = [
    {
      data: "doc_date",
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
      data: "username",
      className: "text-left",
    },
    {
      data: "parameter",
      className: "text-left",
      render: function (data) {
        if (data) {
          let status = data.param_value;
          let classStyle = "";
          if (status == "000") {
            classStyle = "text-warning";
          } else if (status == "200") {
            classStyle = "text-success";
          } else if (status == "300") {
            classStyle = "text-danger";
          }
          return `<div class="${classStyle}">${data.param_desc}</div>`;
        } else {
          return "-";
        }
      },
    },
    {
      data: "amount",
      className: "text-left",
      render: function (data) {
        if (data) {
          return formatMoney(data);
        } else {
          return "-";
        }
      },
    },
    {
      data: "approve_by",
      className: "text-left",
      render: function (data) {
        if (data) {
          return data;
        } else {
          return `-`;
        }
      },
    },
    {
      data: null,
      className: "text-center",
      render: function (data) {
        return `<button class="btn btn-xs btn-mint" type="button" onclick='onChangeStatus(${JSON.stringify(
          data
        )})'><i class="fas fa-clipboard-list"></i>&nbsp;&nbsp;Approve / Reject</button>`;
      },
    },
  ];
  if (data.length > 0) {
    setParameterTable("tableWithdraw", data, column);
  } else {
    setParameterTable("tableWithdraw", [], column);
  }
};

$("#searchWithdraw").click(function () {
  fetchTableWithdraw();
});

const fetchTableWithdraw = function () {
  let jsonData = {
    username: $("#username").val().trim(),
    status: $("#statusDdl").val().trim(),
    dateFrom: new Date($("#txtDateFrom").val().trim()),
    dateTo: new Date($("#txtDateTo").val().trim()),
  };
  let res = callXMLHttpRequest(`${API.withdraw}/searchWithdraw`, jsonData);
  if (res.statusCode == "200") {
    renderTableWithdraw(res.data);
  } else {
    renderTableWithdraw();
  }
};

$("#resetWithdraw").click(function () {
  $("#username").val("");
  $("#txtDateFrom").val("");
  $("#statusDdl").val("");
  $("#statusDdl").selectpicker("refresh");
  $("#txtDateTo").val("");
  fetchTableWithdraw();
});

$("#addWithdraw").click(function () {
  $("#modalWithdraw").modal("show");
  $("#modalTitle").html("Add Transaction");
  if ($("#searchUsername").hasClass("d-p-none")) {
    $("#searchUsername").removeClass("d-p-none");
  }
  if ($("#btnAddBankSave").hasClass("d-p-none")) {
    $("#btnAddBankSave").removeClass("d-p-none");
  }
  if ($("#usernameModal").prop("readonly")) {
    $("#usernameModal").prop("readonly", "");
  }
  if ($("#amountModal").prop("readonly")) {
    $("#amountModal").prop("readonly", "");
  }
  $("#remarkTag").addClass("d-p-none");
  $("#btnApprove").addClass("d-p-none");
  $("#btnReject").addClass("d-p-none");
  $("#usernameModal").val("");
  $("#balanceModal").val("");
  $("#userId").val("");
  $("#amountModal").val("");
  $("#remarkModal").val("");
});

// el("usernameModal").addEventListener("keyup", async (event) => {
//   if (event.keyCode === 13) {
//     $("#userId").val("");
//     $("#balanceModal").val("");
//     $("#modalWithdraw").bootstrapValidator("destroy");
//     if (validateSearchUser()) {
//       let jsonData = {
//         username: $("#usernameModal").val().trim(),
//       };
//       let res = callXMLHttpRequest(`${API.withdraw}/searchUserEvent`, jsonData);
//       if (res.statusCode == "200") {
//         let result = res.data[0];
//         $("#balanceModal").val(formatMoney(result.balance));
//         $("#userId").val(result._id);
//         $("#usernameModal").val(result.username);
//         alertMsg("success", "find username success");
//       } else if (res.statusCode == "202") {
//         alertMsg("danger", "username not found");
//       } else if (res.statusCode == "215" || res.statusCode == "217") {
//         let resultStatus = res.data[0];
//         $("#usernameModal").val(resultStatus.username);
//         alertMsg("danger", res.statusText);
//       } else {
//         alertMsg("danger", res.statusText);
//       }
//     }
//   }
// });

$("#searchUsername").click(function () {
  $("#userId").val("");
  $("#balanceModal").val("");
  $("#modalWithdraw").bootstrapValidator("destroy");
  if (validateSearchUser()) {
    let jsonData = {
      username: $("#usernameModal").val().trim().toLowerCase(),
    };
    let res = callXMLHttpRequest(`${API.withdraw}/searchUserEvent`, jsonData);
    if (res.statusCode == "200") {
      let result = res.data[0];
      $("#balanceModal").val(formatMoney(result.balance));
      $("#userId").val(result._id);
      alertMsg("success", "find username success");
    } else if (res.statusCode == "202") {
      alertMsg("danger", "username not found");
    } else if (res.statusCode == "215" || res.statusCode == "217") {
      alertMsg("danger", res.statusText);
    } else {
      alertMsg("danger", res.statusText);
    }
  }
});

$("#btnAddBankSave").click(function () {
  $("#modalWithdraw").bootstrapValidator("destroy");
  if (validateModal()) {
    let amount = deCodeFormatMoney($("#amountModal").val());
    if (amount > 0.0) {
      if ($("#balanceModal").val()) {
        let jsonData = {
          userId: $("#userId").val(),
          username: $("#usernameModal").val(),
          amount: amount,
          date: new Date(),
          doc_type: "WD",
          status: "000",
        };
        let res = callXMLHttpRequest(`${API.withdraw}/addWithdraw`, jsonData);
        if (res.statusCode == "200") {
          alertMsg("success", "Add withdraw transaction complete.");
          fetchTableWithdraw();
          $("#modalWithdraw").modal("hide");
        } else if (res.statusCode == "205") {
          alertMsg("danger", "Balance less than amount");
        } else if (res.statusCode == "207") {
          alertMsg("danger", "Add withdraw transaction fail.");
        } else if (res.statusCode == "209") {
          alertMsg("danger", "Add wallet transaction fail.");
          fetchTableWithdraw();
        } else if (res.statusCode == "211") {
          alertMsg("danger", "Update main walletfail.");
          fetchTableWithdraw();
        } else if (res.statusCode == "213") {
          alertMsg("danger", "Find document type not found");
        }else{
          alertMsg("danger", res.statusText);
        }
      } else {
        alertMsg("danger", "Username not found");
      }
    } else {
      alertMsg("danger", "Amount must be more than 0.00 baht");
    }
  }
});

const validateData = function () {
  elementsName = {
    username: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    statusWithdraw: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
  };
  if (validate("#mainWithDraw", elementsName)) {
    return true;
  } else {
    return false;
  }
};

const validateModal = function () {
  elementsName = {
    usernameModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    balanceModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
      },
    },
    amountModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
        regexp: {
          regexp: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/,
          message: "This field is number required",
        },
      },
    },
  };
  if (validate("#modalWithdraw", elementsName)) {
    $("#modalWithdraw").bootstrapValidator("destroy");
    return true;
  } else {
    return false;
  }
};

const validateSearchUser = function () {
  elementsName = {
    usernameModal: {
      validators: {
        notEmpty: {
          message: "This field is required",
        },
        regexp: {
          regexp: /^[a-zA-Z0-9@_.]+$/,
          message: "This field is format invalid",
        },
      },
    },
  };
  if (validate("#modalWithdraw", elementsName)) {
    return true;
  } else {
    return false;
  }
};

const onChangeStatus = function (data) {
  let status = data.status;
  if (status == "000") {
    statusNew(data);
  } else if (status == "200" || status == "300") {
    approveRejectAlready(data);
  } else {
    alertMsg("danger", "Transaction status not found");
  }
};

const statusNew = function (data) {
  let jsonData = {
    uid: data.uid,
  };
  let res = callXMLHttpRequest(`${API.withdraw}/findWallet`, jsonData);
  if (res.statusCode == "200") {
    let findResult = res.data[0];
    $("#modalWithdraw").modal("show");
    $("#modalTitle").html("Approve / Reject");
    $("#searchUsername").addClass("d-p-none");
    $("#usernameModal").prop("readonly", "readonly");
    $("#amountModal").prop("readonly", "readonly");
    if ($("#remarkTag").hasClass("d-p-none")) {
      $("#remarkTag").removeClass("d-p-none");
    }
    $("#remarkModal").prop("readonly", "");
    if ($("#btnApprove").hasClass("d-p-none")) {
      $("#btnApprove").removeClass("d-p-none");
    }
    if ($("#btnReject").hasClass("d-p-none")) {
      $("#btnReject").removeClass("d-p-none");
    }
    $("#btnAddBankSave").addClass("d-p-none");
    $("#transactionId").val(data._id);
    $("#userId").val(data.uid);
    $("#usernameModal").val(data.username);
    $("#balanceModal").val(formatMoney(findResult.cbal));
    $("#amountModal").val(formatMoney(data.amount));
    $("#remarkModal").val("");
  } else {
    alertMsg("danger", res.statusText);
  }
};

$("#btnApprove").click(function () {
  let transactionId = $("#transactionId").val();
  if (checkNull(transactionId)) {
    let jsonData = {
      userId: $("#userId").val(),
      tid: transactionId,
      status: "200",
      remark: $("#remarkModal").val(),
    };
    let res = callXMLHttpRequest(`${API.withdraw}/approveWithdraw`, jsonData);
    if (res.statusCode == "200") {
      alertMsg("success", "Update transaction success");
      $("#modalWithdraw").modal("hide");
      fetchTableWithdraw();
    } else if (res.statusCode == "203") {
      alertMsg("danger", "Update transaction fail");
    } else {
      alertMsg("danger", res.statusText);
    }
  } else {
    alertMsg("danger", "Transaction ID not found.");
  }
});

const approveRejectAlready = function (data) {
  let jsonData = {
    uid: data.uid,
  };
  let res = callXMLHttpRequest(`${API.withdraw}/findWallet`, jsonData);
  if (res.statusCode == "200") {
    let findResult = res.data[0];
    $("#modalWithdraw").modal("show");
    if (data.status == "200") {
      $("#modalTitle").html("Approved already");
    } else if (data.status == "300") {
      $("#modalTitle").html("Rejected already");
    }
    $("#searchUsername").addClass("d-p-none");
    $("#usernameModal").prop("readonly", "readonly");
    $("#amountModal").prop("readonly", "readonly");
    if ($("#remarkTag").hasClass("d-p-none")) {
      $("#remarkTag").removeClass("d-p-none");
    }
    $("#remarkModal").prop("readonly", "readonly");
    if (!$("#btnApprove").hasClass("d-p-none")) {
      $("#btnApprove").addClass("d-p-none");
    }
    if (!$("#btnReject").hasClass("d-p-none")) {
      $("#btnReject").addClass("d-p-none");
    }
    $("#btnAddBankSave").addClass("d-p-none");
    $("#transactionId").val(data._id);
    $("#usernameModal").val(data.username);
    $("#balanceModal").val(formatMoney(findResult.cbal));
    $("#amountModal").val(formatMoney(data.amount));
    if (checkNull(data.remark)) {
      $("#remarkModal").val(data.remark);
    } else {
      $("#remarkModal").val("No more detail");
    }
  } else {
    alertMsg("danger", res.statusText);
  }
};

$("#btnReject").click(function () {
  let transactionId = $("#transactionId").val();
  if (checkNull(transactionId)) {
    let jsonData = {
      tid: transactionId,
      uid: $("#userId").val(),
      date: new Date(),
      type: "WD",
      status: "300",
      amount: deCodeFormatMoney($("#amountModal").val()),
      remark: $("#remarkModal").val(),
    };
    let res = callXMLHttpRequest(`${API.withdraw}/rejectWithdraw`, jsonData);
    if (res.statusCode == "200") {
      alertMsg("success", "Update transaction success");
      $("#modalWithdraw").modal("hide");
      fetchTableWithdraw();
    } else if (res.statusCode == "203") {
      alertMsg("danger", "Update transaction fail");
    } else {
      alertMsg("danger", res.statusText);
    }
  } else {
    alertMsg("danger", "Transaction ID not found.");
  }
});

$("#amountModal").change(function (e) {
  $(this).val(formatMoney(e.target.value));
});
