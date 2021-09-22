$(document).on("nifty.ready", () => {
  document.querySelector("title").innerHTML = "TRN | MASTER DATA";
  $('#master-menu-li').addClass('active-sub');
  $('#master-menu-ul').addClass('in');
  $('#master-menu-li-prefix').addClass('active-sub');

  $("#page-title > h1.page-header").text("MASTER DATA");
  $("#page-navigate > .breadcrumb-level-1").text("Prefix member");
  $("#page-navigate > .breadcrumb-level-2").remove();
  $("#page-navigate > .breadcrumb-level-3").remove();
  setTablePrefixFromdatabase();
  setActive();
  CancelRegisPrefixMember();
  var datafromtable = [];
});
/*****************************END ZONE SET ACTIVE  PREFIX MEMBER ************************************************ */
const setActive = function () {
  res = callXMLHttpRequest(`${API.masterData}/getActivePrefix`, {});
  if (res) {
    generateOptionWithValue("seachActive", res.data);
    generateOptionWithValue("regisactivprefix", res.data);
    generateOptionWithValue("edactivprefix", res.data);
  }

};

/*****************************END ZONE SET ACTIVE  PREFIX MEMBER ************************************************ */

/*****************************END ZONE SET DATATABLE  PREFIX MEMBER ************************************************ */

const setTablePrefixFromdatabase = function () {
  res = callXMLHttpRequest(`${API.masterData}/getdatatablePrefix`, {});
  if (res.statusCode == "200") {
    getDataTable("tablePrefix", res.data, renderTablePrefix());
  } else {
    getDataTable("tablePrefix", {}, renderTablePrefix());
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

const renderTablePrefix = function (params) {
  //const data = params ? params : [];
  let column = [
    {
      title: "Prefix Name",
      data: "prefix_name",
      className: "text-center",
    },
    {
      title: "Prefix Description",
      data: "prefix_desc",
      className: "text-center",
      render: function (data) {
        return data ? data : "-";
      },
    },
    {
      title: "Active",
      data: "active",
      className: "text-center",
    },
    {
      title: "Action",
      data: null,
      className: "text-center",
      render: function (data) {
        return `<button class="btn btn-mint btn-icon"    onclick='PrefixEditclick(${JSON.stringify(
          data
        )})' type="button" ><i class="far fa-edit"></i></button>`;
      },
    },
  ];
  return column;
};

/*****************************END ZONE SET DATATALBLE  PREFIX MEMBER ************************************************ */

/*****************************ZONE CANCEL PREFIX MEMBER ************************************************ */

$("#closemodelAdd").click(function () {
  CancelRegisPrefixMember();
});
$("#cancelRegis").click(function () {
  CancelRegisPrefixMember();
});
const CancelRegisPrefixMember = function () {
  $("#txtprefixname").val("");
  $("#txtPrefixdes").val("");
  $("#modal-add-Prefix").modal('hide');
  $("#modal-add-Prefix").bootstrapValidator("destroy");
  $('.selectpicker').selectpicker('refresh');
  setActive();
}
$("#cancelEdit").click(function () {
  CancelEditPrefixMember();
});
$("#closemodelEdit").click(function () {
  CancelEditPrefixMember();
});
const CancelEditPrefixMember = function () {
  $("#edtxtprefixname").val("");
  $("#edtxtPrefixdes").val("");
  $("#modal-edit-Prefix").bootstrapValidator("destroy");
  $('#edactivprefix').selectpicker('refresh');

}
/*****************************ZONE REGISTER PREFIX MEMBER ************************************************ */



/*****************************ZONE REGISTER PREFIX MEMBER ************************************************ */

///// MODEL ADD PREFIX ////////////////////////////
$("#openModalPrefixAdd").click(function () {
  $("#modal-add-Prefix").modal("show");
});
/////END  MODEL ADD PREFIX ////////////////////////////

// Click regis Prefix member
//================================================= //
$("#regisPrefix").click(function () {
  registerPrefixMember();
});

//END Click regis Prefix member

//funtion Call API Regis Prefixmember//
//================================================= //
const registerPrefixMember = function () {
  const obj = {
    prefixName: el("txtprefixname").value,
    prefix_des: el("txtPrefixdes").value,
    prefis_active: el("regisactivprefix").value,
  };
  if (validateAddPrefix()) {
    let res = callXMLHttpRequest(`${API.masterData}/addPrefix`, obj);
    if (res.statusCode == "200") {
      CancelRegisPrefixMember();
      setTablePrefixFromdatabase();
    } else {
      alertMsg("warning", res.statusDsec);

    }
  }

};
//================================================= //
//END funtion Call API Regis Prefixmember//

/***************************** END ZONE REGISTER PREFIX MEMBER ************************************************ */

/*****************************  ZONE EDIT PREFIX MEMBER ************************************************ */

///// MODEL EDIT PREFIX ////////////////////////////
const PrefixEditclick = function (data) {

  $("#idedPrefix").val(data._id);
  $("#edvaluePrefixdes").val(data.active_value);
  $("#edtxtprefixname").val(data.prefix_name);
  $("#edtxtPrefixdes").val(data.prefix_desc);
  $("#edactivprefix").val(data.active_value);
  $('#edactivprefix').selectpicker('refresh');
  if (data._id != "" && data._id != null) {
    $("#modal-edit-Prefix").modal("show");
    datafromtable = data;
  }
};
/////END  MODEL EDIT PREFIX ////////////////////////////

// Click Edit Prefix member
//================================================= //
$("#editPrefix").click(function () {
  const obj = {
    idprefix: el("idedPrefix").value,
    prefixName: el("edtxtprefixname").value,
    prefix_des: el("edtxtPrefixdes").value,
    prefix_active: el("edactivprefix").value,
  };
  editPrefixMember(obj);
});
//================================================= //
//END Click Edit Prefix member

//funtion Call API Edit Prefixmember//
//================================================= //
const editPrefixMember = function (data) {
  if (validateEditPrefix() && data.idprefix != null && data.idprefix != "" && datafromtable.prefix_name == data.prefixName) {
    let res = callXMLHttpRequest(`${API.masterData}/editPrefixActive`, data);
    // console.log("Active only!"+res);
    if (res.statusCode == "200") {
      $("#modal-edit-Prefix").modal("hide");
      CancelEditPrefixMember();
      setTablePrefixFromdatabase();
    } else {
      alertMsg("warning", res.statusDsec);
    }
  } else if (validateEditPrefix() && data.idprefix != null && data.idprefix != "" && datafromtable.prefix_name != data.prefixName) {
    let res = callXMLHttpRequest(`${API.masterData}/editPrefixAll`, data);
    // console.log(res);
    if (res.statusCode == "200") {
      $("#modal-edit-Prefix").modal("hide");
      CancelEditPrefixMember();
      setTablePrefixFromdatabase();
    } else {

      alertMsg("warning", res.statusDsec);
    }
  }


};

//================================================= //
//END funtion Call API Edit Prefixmember//
/***************************** END ZONE EDIT PREFIX MEMBER ************************************************ */



/*****************************  ZONE RESET SEANCH PREFIX MEMBER ************************************************ */
$("#resetSeach").click(function () {
  $("#seachprefixname").val("");
  $("#seachActive").val("");
  $('.selectpicker').selectpicker('refresh');
  setTablePrefixFromdatabase();
});
/*****************************END  ZONE RESET SEANCH PREFIX MEMBER ************************************************ */

/*****************************  ZONE SEANCH PREFIX MEMBER ************************************************ */
$("#seachprefix").click(function () {
  const checkseach = [];
  const prefix = el("seachprefixname").value
  const Active = el("seachActive").value
  if (prefix != "") {
    checkseach.push({ c1: prefix });
  }
  if (Active != "") {
    checkseach.push({ c2: Active });
  }
  if (checkseach.length > 0) {
    seachdataPrefix();
  } else {
    setTablePrefixFromdatabase();
  }

});

const seachdataPrefix = function () {
  let obj = {
    prefix: el("seachprefixname").value,
    Active: el("seachActive").value,
  };
  res = callXMLHttpRequest(`${API.masterData}/seachPrefix`, obj);
  if (res.statusCode == "200") {

    getDataTable("tablePrefix", res.data, renderTablePrefix());
  } else {
    getDataTable("tablePrefix", res.data, renderTablePrefix());
  }
};

/***************************** END ZONE SEANCH PREFIX MEMBER ************************************************ */
// function Active add validateMember
//================================================= //
const validateAddPrefix = function () {
  elementsName = {
    txtprefixname: {
      validators: {
        notEmpty: {
          message: "This field is required!!",
        }, regexp: {
          regexp: /^[A-Z,a-z,.,ก-๙]+$/,
          message: "Format invaild Text only!!",
        },
      },
    },
    regisactivprefix: {
      validators: {
        notEmpty: {
          message: "This field is required!!",
        },
      },
    }

  };
  if (validate("#modal-add-Prefix", elementsName)) {
    return true;
  } else {
    return false;
  }
};
//================================================= //
//END function add validateMember

// function Active edit validateMember
//================================================= //
const validateEditPrefix = function () {
  elementsName = {
    edtxtprefixname: {
      validators: {
        notEmpty: {
          message: "This field is required!!",
        }, regexp: {
          regexp: /^[A-Z,a-z,.,ก-๙]+$/,
          message: "Format invaild Text only!!",
        },
      },
    },
    edactivprefix: {
      validators: {
        notEmpty: {
          message: "This field is required!!",
        },
      },
    }

  };
  if (validate("#modal-edit-Prefix", elementsName)) {
    return true;
  } else {
    return false;
  }
};
//================================================= //
//END function edit validate

// const isText = function (evt) {
// let point = evt.target.value;
// let pointLength = point.length;
// let pointIn = point.indexOf('.');
// if (pointIn > -1) {
//   if (pointLength > pointIn + 2) {
//     let mouseIsDown = false;
//     window.addEventListener('mousedown', function () {
//       mouseIsDown = true;
//       setTimeout(function () {
//         if (mouseIsDown) {
//           evetMose = true;
//         }
//       }, 75);
//     });
//     window.addEventListener('mouseup', function () {
//       mouseIsDown = false;
//     });
//     if (evetMose) {
//       evetMose = false;
//       return true;
//     } else {
//       return false;
//     }
//   } else {
//     return true;
//   }
// } else {
//   return true;
// }
// };