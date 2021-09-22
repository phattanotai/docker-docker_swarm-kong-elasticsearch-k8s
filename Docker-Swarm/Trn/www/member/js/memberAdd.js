$(document).on("nifty.ready", () => {
  document.querySelector('title').innerHTML = 'TRN | MEMBER';
  $('#member-menu-li').addClass('active-sub');
  $('#member-menu-ul').addClass('in');
  $('#member-menu-ul-li').addClass('active-sub');
  $("#page-title > h1.page-header").text("Member");
  $("#page-navigate > .breadcrumb-level-1").text("Member");
  $("#page-navigate > .breadcrumb-level-2").text("Member Search");
  $("#page-navigate > .breadcrumb-level-3").remove();
  renderTableMemberFromdatabase();
  validateSeachMember();
  setPrefixOption();
});
//==============================SET SELECT PREFIX AND STATUS OPTION ===============================================
const setPrefixOption = function () {
  res = callXMLHttpRequest(`${API.member}/getPrefix`, {});
  res2 = callXMLHttpRequest(`${API.member}/getStatus`, {});
  if (res) {
    generateOptionWithValue("seachstatus", res.data);
    generateOptionWithValue("prefix", res.data);
    generateOptionWithValue("edprefix", res.data);
  }
  if (res2) {
    generateOptionWithValue("seachstatus", res2.data);
  }

};
//==============================END SET SELECT PREFIX OPTION ===============================================


const renderTableMemberFromdatabase = function () {
  res = callXMLHttpRequest(`${API.member}/getdatamember`, {});
  if (res.statusCode == "200") {
    getDataTable("tableMember", res.data, renderTableMember());
  } else {
    getDataTable("tableMember", {}, renderTableMember());
  }
};

const getDataTable = function (id, data, columns) {
  $(`#${id}`).DataTable({
    pageLength: 10,
    bDestroy: true,
    responsive: true,
    searching: false,
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
  });
};

const renderTableMember = function (params) {
  //const data = params ? params : [];
  let column = [
    {
      title: "User Name",
      data: "username",
      className: "text-center",
    },
    {
      title: "Member Name",
      data: null,
      className: "text-center",
      render: function (data) {
        return data.first_name + '  ' + data.last_name;
      },
    },
    {
      title: "Telephone No",
      data: "tel",
      className: "text-center",
      render: function (data) {
        return data ? data : "-";
      },
    },
    {
      title: "Register Date",
      data: "reg_date",
      className: "text-center",
      render: function (data) {
        return moment(data).format('DD MMM YYYY HH:mm:ss');
      },
    },
    {
      title: "Status",
      data: "status",
      className: "text-center",
    },
    {
      title: "Action",
      data: null,
      className: "text-center",
      render: function (data) {
        return `<button class="btn btn-mint btn-icon"   onclick='Editmember(${JSON.stringify(
          data
        )})' type="button" ><i class="far fa-edit"></i></button>`;
      },
    },
  ];
  return column;
};

// Click seach  member
//================================================= //
$("#seachmember").click(function () {
  const checkseach = [];
  const membername = el("seachmembername").value
  const status = el("seachstatus").value
  const username = el("seachusername").value
  const tel = el("seachtel").value
  if (membername != "") {
    checkseach.push({ c1: membername });
  }
  if (status != "") {
    checkseach.push({ c2: status });
  }
  if (username != "") {
    checkseach.push({ c3: username });
  }
  if (tel != "") {
    checkseach.push({ c4: tel });
  }
  if (checkseach.length > 0) {
    seachdataMember();
  } else {
    renderTableMemberFromdatabase();
  }

});
//================================================= //
// END seach  member

// Click open modal updatemember
//================================================= //
const mdupdatemember = function (data) {
  $("#edmemberid").val(data._id);
  $("#edprefix").val(data.memberPrefix);
  $("#edtxtfristname").val(data.first_name);
  $("#edtxtlastname").val(data.last_name);
  $("#edtxtemail").val(data.memberEmail);
  $("#edtxttel").val(data.tel);
  $("#edUsernamepv").val(data.username);
  $("#edPasswordpv").val(data.password);
  if (data._id != "" && data._id != null) {
    $("#modal-edit-member").modal("show");
  }
};

//================================================= //
// END Click open modal updatemember

// Click open modal Regismember
//================================================= //
$("#openModalRegismember").click(function () {
  $("#modal-add-member").modal("show");
});
//================================================= //
//END Click open modal Regismember

$("#closemodelAdd").click(function () {
  resetdataRegis();
});
$("#cancelregismem").click(function () {
  resetdataRegis();
});
const resetdataRegis = function (data) {
  el("prefix").value = "";
  el("txtfristname").value = "";
  el("txtlastname").value = "";
  el("txtemail").value = "";
  el("txttel").value = "";
  $('.selectpicker').selectpicker('refresh');
  $("#modal-add-member").modal("hide");
  $("#modal-add-member").bootstrapValidator("destroy");
  renderTableMemberFromdatabase();
};
$("#resetseach").click(function () {
  
  el("seachmembername").value = "";
  el("seachstatus").value = "";
  el("seachusername").value = "";
  el("seachtel").value = "";
  $('.selectpicker').selectpicker('refresh');
  renderTableMemberFromdatabase();

});
// Click regismember
//================================================= //
$("#regismember").click(function () {
  $("#modal-add-member").bootstrapValidator("destroy");
  if (validateMember()) {
    registerdataMember();
  }
});
//================================================= //
//END Click regismember

// Click EDIT MEMBER
const Editmember = function (data) {
  //================================================= //
  window.location.href = "./memberDetail.html?userId=" + data._id;
};
//================================================= //
//END Click EDIT MEMBER

// CALL API SEACH MEMBER
//================================================= //
const seachdataMember = function () {
  let obj = {
    membername: el("seachmembername").value,
    status: el("seachstatus").value,
    username: el("seachusername").value,
    tel: el("seachtel").value,
  };
  res = callXMLHttpRequest(`${API.member}/memberSeach`, obj);
  if (res.statusCode == "200") {
    getDataTable("tableMember", res.data, renderTableMember());
  } else {
    getDataTable("tableMember", res.data, renderTableMember());
  }
};
//================================================= //
//END CALL API SEACH MEMBER

// CALL API REGIS MEMBER
//================================================= //
const registerdataMember = function () {
  const obj = {
    prefix: el("prefix").value,
    txtfristname: el("txtfristname").value,
    txtlastname: el("txtlastname").value,
    txtemail: el("txtemail").value,
    txttel: el("txttel").value,
    txtpassword: generatePassword(),
  };
  let res = callXMLHttpRequest(`${API.member}/memberRegister`, obj);
  if (res.statusCode == "200" && res.data) {
    showUserPass(obj);
    resetdataRegis();
  } else if(res.statusCode == "303" ) {
    alertMsg("warning", "Telephone is already exists");

  } else if(res.statusCode == "304") {
  alertMsg("warning", "Email is already exists");

}else{
  console.error(res);
}
};

//================================================= //
//END CALL API SEACH MEMBER
const showUserPass = function (obj) {
  $("#modal-add-member").modal("hide");
  $("#modal-showpass").modal("show");
  $("#User_show").val((obj.txtemail).toLowerCase());
  $("#Pass_show").val((obj.txtpassword).toLowerCase());
  renderTableMemberFromdatabase();
};

// function add validateMember
//================================================= //
const validateMember = function () {

  elementsName = {
    prefix: {
      validators: {
        notEmpty: {
          message: "This field is required!!",
        },
      },
    },
    txtfristname: {
      validators: {
        notEmpty: {
          message: "This field is required!!",
        },
        regexp: {
          regexp: /^[A-Z,a-z,ก-๙]+$/,
          message: "Format invaild Text only!!",
        },
      },
    },
    txtlastname: {
      validators: {
        notEmpty: {
          message: "This field is required!!",
        },
        regexp: {
          regexp: /^[A-Z,a-z,ก-๙]+$/,
          message: "Format invaild Text only!!",
        },
      },
    },
    txtemail: {
      validators: {
        notEmpty: {
          message: "This field is required!!",
        },
      },
    },
    txttel: {
      validators: {
        notEmpty: {
          message: "This field is required!!",
        },
        stringLength: {
          max: 10,
          min: 10,
          message: "The Telephone must be  10 characters!!",
        },
        regexp: {
          regexp: /^[0-9]+$/,
          message: "Format invaild number only!!",
        },
      },
    },
  };
  if (validate("#modal-add-member", elementsName)) {
    return true;
  } else {
    return false;
  }
};
//================================================= //
//END function add validateMember

// function add validateMember
//================================================= //
const validateSeachMember = function () {
  elementsName = {
    seachtel: {
      validators: {
        stringLength: {
          max: 10,
          min: 0,
          message: "The Telephone must be  10 characters!!",
        },
        regexp: {
          regexp: /^[0-9]+$/,
          message: "Format invaild number only!!",
        },
      },
    },
  };
  if (validate("#datasearchmember", elementsName)) {
    return true;
  } else {
    return false;
  }
};
//================================================= //
//END function add validateMember

